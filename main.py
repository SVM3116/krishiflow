import os
import uuid
import logging
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import FastAPI, Request, Depends, HTTPException, Query, Security
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Import services & ML models
from middleware.auth import supabase_client, get_current_user
from services.crop_model import crop_suitability_model
from services.pest_model import pest_classifier
from services.weather_service import get_weather_data
from services.plan_service import generate_farm_plan, map_to_frontend_plan

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("krishiflow-ai-backend")

load_dotenv()

app = FastAPI(
    title="KrishiFlow AI Backend",
    description="Python API for KrishiFlow AI - Crop Zoning and Income Optimization Engine",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all cross-origins for frontend integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class FarmAnalysisRequest(BaseModel):
    farm_name: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None
    area_acres: Optional[float] = None
    soil_type: Optional[str] = None
    water_level: Optional[str] = None
    budget: Optional[int] = None
    season: Optional[str] = None
    
    # Frontend camelCase naming mappings
    farmName: Optional[str] = None
    landArea: Optional[float] = None
    district: Optional[str] = None
    soilType: Optional[str] = None
    water: Optional[str] = None

class PestDetectRequest(BaseModel):
    crop_name: Optional[str] = "General"
    symptoms: List[str]

# Helper to validate optional user headers
async def get_optional_user(request: Request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    if not token or not supabase_client:
        return None
    try:
        response = supabase_client.auth.get_user(token)
        return response.user if response else None
    except Exception:
        return None

# Endpoints
@app.get("/api/health")
def health_check():
    """Verify backend server health status."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "appName": "KrishiFlow AI (Python ML Backend)"
    }

@app.get("/api/crop-pairs")
def get_crop_pairs(
    soil: Optional[str] = None,
    water: Optional[str] = None,
    region: Optional[str] = None,
    season: Optional[str] = None,
    limit: int = 5
):
    """Retrieve and rank traditional companion crops based on suitability classifier."""
    try:
        ranked_crops = crop_suitability_model.get_ranked_crops(
            soil=soil or '',
            water=water or '',
            region=region or '',
            season=season or ''
        )
        
        sliced_crops = ranked_crops[:limit]
        return {
            "success": True,
            "message": "Crop recommendations retrieved and ranked successfully.",
            "data": {
                "crops": sliced_crops,
                "total_found": len(ranked_crops)
            }
        }
    except Exception as e:
        logger.error(f"Error in /api/crop-pairs: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve crop pairs.")

@app.post("/api/analyze-farm")
@app.post("/api/analyze")
async def analyze_farm(request_data: FarmAnalysisRequest, user: Optional[dict] = Depends(get_optional_user)):
    """Generate land zoning schedules and continuous cashflow simulations."""
    try:
        # Resolve naming differences between backend and frontend contracts
        farm_name = request_data.farm_name or request_data.farmName or 'My Farm'
        location = request_data.location or request_data.district or 'belagavi'
        state = request_data.state or 'Karnataka'
        area = request_data.area_acres or request_data.landArea
        soil = request_data.soil_type or request_data.soilType
        water = request_data.water_level or request_data.water
        season = request_data.season or 'kharif'
        budget = request_data.budget or 50000
        
        if not location or not area or not soil or not water or not season:
            raise HTTPException(
                status_code=400,
                detail="Missing required fields: location, area, soil, water, and season are required."
            )
            
        try:
            num_area = float(area)
            if num_area <= 0:
                raise ValueError()
        except ValueError:
            raise HTTPException(status_code=400, detail="Area must be a positive number.")
            
        # 1. Run optimization zoning calculations
        analysis = await generate_farm_plan({
            'farm_name': farm_name,
            'location': location,
            'state': state,
            'area_acres': num_area,
            'soil_type': soil,
            'water_level': water,
            'budget': budget,
            'season': season
        })
        
        plan_id = str(uuid.uuid4())
        created_at = datetime.utcnow().isoformat() + "Z"
        
        # 2. Map plan to React-friendly JSON output
        frontend_plan = map_to_frontend_plan(analysis, plan_id, created_at)
        
        # 3. Persist to database (Supabase)
        user_id = user.id if user else None
        if supabase_client:
            try:
                db_record = {
                    'id': plan_id,
                    'user_id': user_id,
                    'created_at': created_at,
                    'farm_name': farm_name,
                    'land_area': num_area,
                    'district': location,
                    'state': state,
                    'soil_type': soil,
                    'water_availability': water,
                    'season': season,
                    'budget': budget,
                    'plan_data': {
                        **frontend_plan,
                        'user_id': user_id
                    },
                    'location': location.lower(),
                    'area_acres': num_area,
                    'water_level': water.lower(),
                    'zones': analysis['zones'],
                    'income_calendar': analysis['income_calendar'],
                    'annual_income': int(analysis['annual_income']),
                    'num_income_months': int(analysis['num_income_months']),
                    'stability_score': float(analysis['scores']['stability_score']),
                    'sustainability_score': float(analysis['scores']['sustainability_score']),
                    'biodiversity_score': float(analysis['scores']['biodiversity_score']),
                    'risk_score': float(analysis['scores']['risk_score']),
                    'total_score': float(analysis['scores']['total_score']),
                    'traditional_wisdom': analysis.get('traditional_wisdom', '')
                }
                
                supabase_client.table('farm_plans').insert(db_record).execute()
                logger.info(f"Successfully saved plan {plan_id} to Supabase DB.")
            except Exception as db_err:
                logger.error(f"Failed to save plan to Supabase: {str(db_err)}")
                
        # Merge response payload matching Node's farmController structure
        response_payload = {
            **frontend_plan,
            'plan_id': plan_id,
            'farm_name': farm_name,
            'location': location.lower(),
            'state': state,
            'area_acres': num_area,
            'zones': [
                {
                    **(analysis['zones'][i] if i < len(analysis['zones']) else {}),
                    **fz,
                    'area': fz['area'],
                    'area_acres': fz['area']
                } for i, fz in enumerate(frontend_plan['zones'])
            ],
            'income_calendar': analysis['income_calendar'],
            'annual_income': analysis['annual_income'],
            'num_income_months': analysis['num_income_months'],
            'scores': {
                **frontend_plan['scores'],
                'total_score': analysis['scores']['total_score'],
                'stability_score': analysis['scores']['stability_score'],
                'sustainability_score': analysis['scores']['sustainability_score'],
                'biodiversity_score': analysis['scores']['biodiversity_score'],
                'risk_score': analysis['scores']['risk_score'],
                'profit_score': analysis['scores']['total_score']
            },
            'traditional_wisdom': analysis.get('traditional_wisdom', ''),
            'created_at': created_at
        }
        
        return {
            **response_payload,
            "success": True,
            "data": response_payload
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in analyze_farm: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze farm: {str(e)}")

@app.post("/api/pest-detect")
@app.post("/api/pest")
def detect_pest(request_data: PestDetectRequest):
    """Diagnose crop pests and generate organic treatments using NLP Cosine Similarity."""
    try:
        resolved_crop = request_data.crop_name or 'General'
        if not request_data.symptoms or len(request_data.symptoms) == 0:
            raise HTTPException(
                status_code=400,
                detail="Missing or empty field: symptoms must be a non-empty array of strings."
            )
            
        diagnosis = pest_classifier.classify_symptoms(resolved_crop, request_data.symptoms)
        
        response_payload = {
            "name": diagnosis['pest_name'],
            "confidence": diagnosis['confidence'],
            "traditional": diagnosis['traditional_remedy'],
            "chemical": diagnosis['chemical_option'],
            "prevention": diagnosis['prevention_tips'],
            "severity": diagnosis['severity'],
            "description": diagnosis['description']
        }
        
        return {
            **response_payload,
            "success": True,
            "data": {
                **diagnosis,
                **response_payload
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in /api/pest: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to detect pest.")

@app.get("/api/weather/{district}")
@app.get("/api/weather")
async def get_weather(district: Optional[str] = None):
    """Retrieve weather forecast parameters and customized agronomic indices."""
    if not district:
        raise HTTPException(status_code=400, detail="District parameter is required.")
        
    try:
        weather_data = await get_weather_data(district)
        
        weather_icons = {
            "sunny": "☀️", "clear sky": "☀️", "partly cloudy": "⛅",
            "few clouds": "⛅", "scattered clouds": "⛅", "broken clouds": "☁️",
            "cloudy": "☁️", "overcast clouds": "☁️", "light rain": "🌦️",
            "moderate rain": "🌦️", "heavy rain": "🌧️", "rain": "🌧️",
            "drizzle": "🌦️"
        }
        
        short_days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        # Python Monday is 0, Sunday is 6
        start_day_idx = (datetime.now().weekday() + 1) % 7
        
        mapped_weather = []
        for i, f in enumerate(weather_data['forecast']):
            day_name = short_days[(start_day_idx + i) % 7]
            cond_clean = f['condition'].lower()
            
            icon = "☀️"
            for key, val in weather_icons.items():
                if key in cond_clean:
                    icon = val
                    break
                    
            mapped_weather.append({
                'day': "Today" if i == 0 else "Tomorrow" if i == 1 else day_name,
                'temp': f['temp'],
                'rain': 10 if ('rain' in cond_clean or 'drizzle' in cond_clean) else 0,
                'icon': icon,
                'condition': f['condition']
            })
            
        response_payload = {
            'weather': mapped_weather,
            'advisory': weather_data['farming_advisory']
        }
        
        return {
            **response_payload,
            "success": True,
            "data": {
                **weather_data,
                **response_payload
            }
        }
    except Exception as e:
        logger.error(f"Error in /api/weather: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch weather forecast.")

@app.get("/api/plans")
def get_plans(user: dict = Depends(get_current_user)):
    """List previous plans saved under user profile."""
    if not supabase_client:
        return {"success": True, "message": "Supabase connection not configured.", "data": []}
        
    try:
        response = supabase_client.table('farm_plans') \
            .select('id, farm_name, location, state, area_acres, season, annual_income, total_score, stability_score, created_at') \
            .eq('user_id', user.id) \
            .order('created_at', desc=True) \
            .limit(20) \
            .execute()
            
        return {
            "success": True,
            "message": "Saved plans retrieved successfully.",
            "data": response.data or []
        }
    except Exception as e:
        logger.error(f"Error fetching saved plans: {str(e)}")
        return {"success": True, "message": "Failed to query database.", "data": []}

@app.get("/api/plans/{planId}")
def get_plan_by_id(planId: str, user: dict = Depends(get_current_user)):
    """Retrieve comprehensive plan details from DB and parse zone records."""
    if not supabase_client:
        raise HTTPException(status_code=404, detail="Database not configured.")
        
    try:
        # Validate UUID
        uuid.UUID(planId)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid plan ID format. Must be a valid UUID.")
        
    try:
        response = supabase_client.table('farm_plans') \
            .select('*') \
            .eq('id', planId) \
            .eq('user_id', user.id) \
            .execute()
            
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Farming plan was not found.")
            
        data = response.data[0]
        
        # Format response payload to frontend expectation contract
        # Check if plan_data json document is stored
        if 'plan_data' in data and data['plan_data']:
            plan_data = data['plan_data']
            # inject/verify fields
            plan_data['plan_id'] = data['id']
            return {
                "success": True,
                "message": "Farming plan details retrieved successfully.",
                "data": plan_data
            }
            
        # Re-construct if missing
        zones = data.get('zones', [])
        mapped_zones = []
        for idx, z in enumerate(zones):
            letter = ["A", "B", "C", "D", "E", "F"][idx] if idx < 6 else "A"
            seasons_mapped = {}
            if 'seasons' in z:
                for season_key, s in z['seasons'].items():
                    seasons_mapped[season_key] = {
                        'cropPair': s.get('cropPair', [s.get('crop', 'Crop'), 'Companion']),
                        'plantingMonth': (s.get('plantingMonth') or s.get('sowMonth') or 'June')[:3],
                        'harvestMonths': [m[:3] for m in s.get('harvestMonths', ['October'])],
                        'expectedIncome': s.get('expectedIncome') or s.get('netProfit') or 0,
                        'expectedRevenue': s.get('expectedRevenue') or s.get('grossRevenue') or 0,
                        'expectedExpense': s.get('expectedExpense') or s.get('inputCost') or s.get('expenses') or 0
                    }
            else:
                crop_pair = [z.get('primary_crop', 'Crop'), z.get('companion_crop', 'Companion')]
                plant_short = z.get('planting_month', 'June')[:3]
                harvest_short = z.get('harvest_month', 'October')[:3]
                income = z.get('expected_profit', 0)
                seasons_mapped = {
                    'kharif': {'cropPair': crop_pair, 'plantingMonth': plant_short, 'harvestMonths': [harvest_short], 'expectedIncome': income},
                    'rabi': {'cropPair': ["Chickpea", "Wheat Border"], 'plantingMonth': "Nov", 'harvestMonths': ["Jan"], 'expectedIncome': int(income * 0.6)},
                    'zaid': {'cropPair': ["Fodder Cowpea", "Organic Mulch"], 'plantingMonth': "Mar", 'harvestMonths': ["May"], 'expectedIncome': int(income * 0.2)}
                }
                
            mapped_zones.append({
                **z,
                'id': letter,
                'name': z.get('name', f"Zone {letter}"),
                'area': z.get('area_acres') or z.get('areaAcres') or (float(data['area_acres']) / len(zones)),
                'area_acres': z.get('area_acres') or z.get('areaAcres') or (float(data['area_acres']) / len(zones)),
                'color': z.get('color') or ["primary", "success", "accent"][idx % 3],
                'seasons': seasons_mapped
            })
            
        response_payload = {
            'plan_id': data['id'],
            'farm_name': data['farm_name'],
            'location': data['location'],
            'state': data['state'],
            'area_acres': float(data['area_acres']),
            'season': data['season'],
            'zones': mapped_zones,
            'income_calendar': data['income_calendar'],
            'annual_income': int(data['annual_income']),
            'num_income_months': int(data['num_income_months']),
            'scores': {
                'total_score': float(data['total_score']),
                'stability_score': float(data['stability_score']),
                'sustainability_score': float(data['sustainability_score']),
                'biodiversity_score': float(data['biodiversity_score']),
                'risk_score': float(data['risk_score']),
                'profit_score': float(data['total_score'])
            },
            'traditional_wisdom': data.get('traditional_wisdom', ''),
            'created_at': data['created_at']
        }
        
        return {
            "success": True,
            "message": "Farming plan details retrieved successfully.",
            "data": response_payload
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Crash in get_plan_by_id: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")

@app.get("/api/income-calendar/{planId}")
def get_income_calendar(planId: str, user: dict = Depends(get_current_user)):
    """Fetch calendar summary columns for a plan."""
    if not supabase_client:
        raise HTTPException(status_code=404, detail="Database not configured.")
        
    try:
        # Validate UUID
        uuid.UUID(planId)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid plan ID format. Must be a valid UUID.")
        
    try:
        response = supabase_client.table('farm_plans') \
            .select('income_calendar, annual_income, num_income_months') \
            .eq('id', planId) \
            .eq('user_id', user.id) \
            .execute()
            
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Farming calendar with plan ID not found.")
            
        data = response.data[0]
        return {
            "success": True,
            "message": "Income calendar retrieved successfully.",
            "data": {
                "income_calendar": data['income_calendar'],
                "annual_income": data['annual_income'],
                "num_income_months": data['num_income_months']
            }
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Crash in get_income_calendar: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error.")

if __name__ == "__main__":
    import uvicorn
    # Start uvicorn server on port 3001
    uvicorn.run("main:app", host="0.0.0.0", port=3001, reload=True)
