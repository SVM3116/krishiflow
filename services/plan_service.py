import os
import math
import uuid
import logging
from datetime import datetime
from services.crop_model import crop_suitability_model
from services.weather_service import get_weather_data
from utils.monthUtils import MONTHS, get_month_name, get_base_month_index, get_planting_month, get_harvest_month

logger = logging.getLogger(__name__)

# Constants matching JS month configurations
ALL_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

REGIONAL_CATALOGS = {
    'belagavi': {
        'Black': {
            'ZoneA': {
                'kharif': {'crop': "Sugarcane + Soyabean (Intercrop)", 'baseRevenuePerAcre': 140000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Rabi Ratoon + Wheat", 'baseRevenuePerAcre': 90000, 'sow': "November", 'harvest': "February"},
                'zaid': {'crop': "Green Gram + Cover Crop", 'baseRevenuePerAcre': 30000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Jowar + Pigeon Pea", 'baseRevenuePerAcre': 65000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Chickpea + Linseed", 'baseRevenuePerAcre': 40000, 'sow': "November", 'harvest': "January"},
                'zaid': {'crop': "Fodder Maize + Cowpea", 'baseRevenuePerAcre': 25000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Cotton + Groundnut", 'baseRevenuePerAcre': 95000, 'sow': "June", 'harvest': "August"},
                'rabi': {'crop': "Wheat + Mustard", 'baseRevenuePerAcre': 45000, 'sow': "November", 'harvest': "December"},
                'zaid': {'crop': "Sunflower + Sesame", 'baseRevenuePerAcre': 35000, 'sow': "March", 'harvest': "May"}
            }
        },
        'Red': {
            'ZoneA': {
                'kharif': {'crop': "Bajra + Pigeon Pea", 'baseRevenuePerAcre': 50000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Horse Gram + Cover Crop", 'baseRevenuePerAcre': 28000, 'sow': "November", 'harvest': "February"},
                'zaid': {'crop': "Cowpea + Sunnhemp", 'baseRevenuePerAcre': 22000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Maize + Field Beans", 'baseRevenuePerAcre': 70000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Safflower + Organic Cover", 'baseRevenuePerAcre': 32000, 'sow': "November", 'harvest': "January"},
                'zaid': {'crop': "Vegetables (Coriander/Mint)", 'baseRevenuePerAcre': 45000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Groundnut + Sesame", 'baseRevenuePerAcre': 60000, 'sow': "June", 'harvest': "August"},
                'rabi': {'crop': "Finger Millet (Ragi)", 'baseRevenuePerAcre': 38000, 'sow': "November", 'harvest': "December"},
                'zaid': {'crop': "Summer Cover + Dhaincha", 'baseRevenuePerAcre': 20000, 'sow': "March", 'harvest': "May"}
            }
        }
    },
    'bengaluru': {
        'Black': {
            'ZoneA': {
                'kharif': {'crop': "Maize + Field Beans", 'baseRevenuePerAcre': 75000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Potato + Tomato", 'baseRevenuePerAcre': 95000, 'sow': "November", 'harvest': "February"},
                'zaid': {'crop': "Watermelon + Bhendi", 'baseRevenuePerAcre': 60000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Soybean + Cowpea", 'baseRevenuePerAcre': 65000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Sunflower + Mustard", 'baseRevenuePerAcre': 48000, 'sow': "November", 'harvest': "January"},
                'zaid': {'crop': "Cluster Beans + Amaranth", 'baseRevenuePerAcre': 40000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Groundnut + Niger Seed", 'baseRevenuePerAcre': 58000, 'sow': "June", 'harvest': "August"},
                'rabi': {'crop': "Onion + Garlic", 'baseRevenuePerAcre': 80000, 'sow': "November", 'harvest': "December"},
                'zaid': {'crop': "Summer Vegetables (Gourd)", 'baseRevenuePerAcre': 45000, 'sow': "March", 'harvest': "May"}
            }
        },
        'Red': {
            'ZoneA': {
                'kharif': {'crop': "Ragi + Cowpea", 'baseRevenuePerAcre': 38000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Potato + Tomato", 'baseRevenuePerAcre': 85000, 'sow': "November", 'harvest': "February"},
                'zaid': {'crop': "Watermelon + Bhendi", 'baseRevenuePerAcre': 55000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Maize + Field Beans", 'baseRevenuePerAcre': 68000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Sunflower + Mustard", 'baseRevenuePerAcre': 42000, 'sow': "November", 'harvest': "January"},
                'zaid': {'crop': "Cluster Beans + Amaranth", 'baseRevenuePerAcre': 38000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Groundnut + Castor", 'baseRevenuePerAcre': 55000, 'sow': "June", 'harvest': "August"},
                'rabi': {'crop': "Onion + Garlic", 'baseRevenuePerAcre': 72000, 'sow': "November", 'harvest': "December"},
                'zaid': {'crop': "Summer Vegetables (Gourd)", 'baseRevenuePerAcre': 40000, 'sow': "March", 'harvest': "May"}
            }
        }
    },
    'shivamogga': {
        'Black': {
            'ZoneA': {
                'kharif': {'crop': "Paddy (Sona Masuri) + Sesamum", 'baseRevenuePerAcre': 65000, 'sow': "June", 'harvest': "November"},
                'rabi': {'crop': "Potato + Tomato", 'baseRevenuePerAcre': 90000, 'sow': "December", 'harvest': "February"},
                'zaid': {'crop': "Banana + Turmeric", 'baseRevenuePerAcre': 80000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Maize + Cowpea", 'baseRevenuePerAcre': 70000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Ginger + Turmeric", 'baseRevenuePerAcre': 110000, 'sow': "December", 'harvest': "February"},
                'zaid': {'crop': "Groundnut + Summer Vegetables", 'baseRevenuePerAcre': 55000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Groundnut + Niger Seed", 'baseRevenuePerAcre': 58000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Ragi + Horsegram", 'baseRevenuePerAcre': 40000, 'sow': "December", 'harvest': "January"},
                'zaid': {'crop': "Summer Paddy + Vegetables", 'baseRevenuePerAcre': 60000, 'sow': "March", 'harvest': "May"}
            }
        },
        'Red': {
            'ZoneA': {
                'kharif': {'crop': "Paddy (Sona Masuri) + Sesamum", 'baseRevenuePerAcre': 60000, 'sow': "June", 'harvest': "November"},
                'rabi': {'crop': "Arecanut Maint. + Black Pepper", 'baseRevenuePerAcre': 140000, 'sow': "December", 'harvest': "February"},
                'zaid': {'crop': "Banana + Turmeric", 'baseRevenuePerAcre': 75000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Maize + Cowpea", 'baseRevenuePerAcre': 62000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Ginger + Turmeric", 'baseRevenuePerAcre': 105000, 'sow': "December", 'harvest': "February"},
                'zaid': {'crop': "Groundnut + Summer Vegetables", 'baseRevenuePerAcre': 50000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Groundnut + Niger Seed", 'baseRevenuePerAcre': 52000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Ragi + Horsegram", 'baseRevenuePerAcre': 36000, 'sow': "December", 'harvest': "January"},
                'zaid': {'crop': "Summer Paddy + Vegetables", 'baseRevenuePerAcre': 55000, 'sow': "March", 'harvest': "May"}
            }
        }
    },
    'kalaburagi': {
        'Black': {
            'ZoneA': {
                'kharif': {'crop': "Tur Dal (Pigeon Pea) + Cotton", 'baseRevenuePerAcre': 110000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Chickpea + Linseed", 'baseRevenuePerAcre': 55000, 'sow': "October", 'harvest': "January"},
                'zaid': {'crop': "Sunflower + Sesame", 'baseRevenuePerAcre': 38000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Jowar + Green Gram", 'baseRevenuePerAcre': 60000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Safflower + Wheat", 'baseRevenuePerAcre': 45000, 'sow': "October", 'harvest': "December"},
                'zaid': {'crop': "Fodder Sorghum + Cowpea", 'baseRevenuePerAcre': 28000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Soybean + Sesame", 'baseRevenuePerAcre': 72000, 'sow': "June", 'harvest': "August"},
                'rabi': {'crop': "Rabi Jowar + Mustard", 'baseRevenuePerAcre': 40000, 'sow': "October", 'harvest': "November"},
                'zaid': {'crop': "Groundnut + Summer Vegetables", 'baseRevenuePerAcre': 35000, 'sow': "March", 'harvest': "May"}
            }
        },
        'Red': {
            'ZoneA': {
                'kharif': {'crop': "Tur Dal (Pigeon Pea) + Bajra", 'baseRevenuePerAcre': 55000, 'sow': "June", 'harvest': "October"},
                'rabi': {'crop': "Chickpea + Coriander", 'baseRevenuePerAcre': 42000, 'sow': "October", 'harvest': "January"},
                'zaid': {'crop': "Sunflower + Sesame", 'baseRevenuePerAcre': 32000, 'sow': "March", 'harvest': "May"}
            },
            'ZoneB': {
                'kharif': {'crop': "Jowar + Horsegram", 'baseRevenuePerAcre': 45000, 'sow': "June", 'harvest': "September"},
                'rabi': {'crop': "Safflower + Linseed", 'baseRevenuePerAcre': 32000, 'sow': "October", 'harvest': "December"},
                'zaid': {'crop': "Fodder Sorghum + Cowpea", 'baseRevenuePerAcre': 22000, 'sow': "March", 'harvest': "April"}
            },
            'ZoneC': {
                'kharif': {'crop': "Groundnut + Sesame", 'baseRevenuePerAcre': 50000, 'sow': "June", 'harvest': "August"},
                'rabi': {'crop': "Rabi Jowar + Mustard", 'baseRevenuePerAcre': 32000, 'sow': "October", 'harvest': "November"},
                'zaid': {'crop': "Summer Vegetables + Cover Crop", 'baseRevenuePerAcre': 28000, 'sow': "March", 'harvest': "May"}
            }
        }
    }
}

def determine_num_zones(area: float) -> int:
    if area <= 1.0:
        return 3
    if area < 2.0:
        return 4
    if area < 5.0:
        return 5
    return 6

def detect_region(location: str) -> str:
    loc = (location or '').lower()
    if 'belagavi' in loc or 'belgavi' in loc or 'belgaum' in loc:
        return 'belagavi'
    if 'bengaluru' in loc or 'bangalore' in loc or 'bangaluru' in loc:
        return 'bengaluru'
    if 'shivamogga' in loc or 'shimoga' in loc or 'shivamoga' in loc:
        return 'shivamogga'
    if 'kalaburagi' in loc or 'gulbarga' in loc or 'kalburgi' in loc or 'kalaburgi' in loc:
        return 'kalaburagi'
    return None

def calculate_scores(annual_income: float, num_income_months: int, assigned_crops: list) -> dict:
    if not assigned_crops:
        return {
            'profit_score': 0.0,
            'stability_score': 0.0,
            'sustainability_score': 0.0,
            'biodiversity_score': 0.0,
            'risk_score': 0.0,
            'total_score': 0.0
        }
        
    profit_score = min((annual_income / 100000.0) * 70.0, 100.0)
    
    # Stability Score
    stability_score = min((num_income_months / 6.0) * 80.0 + 20.0, 100.0)
    if len(assigned_crops) <= 3 and num_income_months >= 2:
        stability_score = min((num_income_months / len(assigned_crops)) * 80.0 + 20.0, 100.0)
        
    # Average scores
    sustainability_score = sum(c.get('sustainability_score', 0) for c in assigned_crops) / len(assigned_crops)
    biodiversity_score = sum(c.get('biodiversity_score', 0) for c in assigned_crops) / len(assigned_crops)
    
    avg_risk_level = sum(c.get('risk_level', 0) for c in assigned_crops) / len(assigned_crops)
    risk_score = 100.0 - avg_risk_level
    
    # Weighted composite total
    total_score = (profit_score * 0.35) + \
                  (stability_score * 0.25) + \
                  (sustainability_score * 0.20) + \
                  (biodiversity_score * 0.10) + \
                  (risk_score * 0.10)
                  
    return {
        'profit_score': round(profit_score, 2),
        'stability_score': round(stability_score, 2),
        'sustainability_score': round(sustainability_score, 2),
        'biodiversity_score': round(biodiversity_score, 2),
        'risk_score': round(risk_score, 2),
        'total_score': round(total_score, 2)
    }

async def generate_farm_plan(farm_details: dict) -> dict:
    farm_name = farm_details.get('farm_name', 'My Farm')
    location = farm_details.get('location', 'belagavi').lower()
    state = farm_details.get('state', 'Karnataka')
    area_acres = float(farm_details.get('area_acres', 1.0))
    soil_type = farm_details.get('soil_type', 'Red').lower()
    water_level = farm_details.get('water_level', 'Medium').lower()
    budget = farm_details.get('budget', 50000)
    season = farm_details.get('season', 'kharif').lower()
    
    detected_reg = detect_region(location)
    num_zones = determine_num_zones(area_acres)
    zone_area = round(area_acres / num_zones, 2)
    
    # ── CASE 1: Specialized Regional cropEngine ──
    if detected_reg:
        normalized_soil = "Black" if "black" in soil_type else "Red"
        normalized_water = "Low" if "low" in water_level else "High"
        
        region_cat = REGIONAL_CATALOGS.get(detected_reg, REGIONAL_CATALOGS['belagavi'])
        soil_cat = region_cat.get(normalized_soil)
        
        water_factor = 1.0 if normalized_water == "High" else 0.70
        
        expense_ratio = 0.40
        if normalized_soil == "Red":
            expense_ratio += 0.02
        if normalized_water == "Low":
            expense_ratio += 0.03
        expense_ratio = max(0.40, min(0.45, expense_ratio))
        
        zones = []
        total_gross_revenue = 0.0
        total_expenses = 0.0
        
        zone_letters = ["A", "B", "C", "D", "E", "F"]
        for idx in range(num_zones):
            letter = zone_letters[idx] if idx < len(zone_letters) else "A"
            base_zone_id = f"Zone{['A', 'B', 'C'][idx % 3]}"
            
            # Deep clone the crop template configurations
            zone_conf = dict(soil_cat[base_zone_id])
            
            # Repetitive zone variation (Zones D, E, F)
            if idx >= 3:
                companion_replacements = {
                    "Soyabean (Intercrop)": "Cowpea (Intercrop)", "Soyabean": "Cowpea",
                    "Wheat": "Chickpea", "Cover Crop": "Sunnhemp", "Pigeon Pea": "Horsegram",
                    "Linseed": "Mustard", "Cowpea": "Organic Mulch", "Groundnut": "Sesame",
                    "Mustard": "Coriander", "Sesame": "Niger Seed", "Tomato": "Chilli",
                    "Amaranth": "Spinach", "Garlic": "Coriander"
                }
                
                new_zone_conf = {}
                for season_key, season_val in zone_conf.items():
                    s_data = dict(season_val)
                    variation_factor = 0.92 + ((idx * 7 + s_data['baseRevenuePerAcre']) % 15) / 100.0
                    s_data['baseRevenuePerAcre'] = int(s_data['baseRevenuePerAcre'] * variation_factor)
                    
                    for original, repl in companion_replacements.items():
                        if original in s_data['crop']:
                            s_data['crop'] = s_data['crop'].replace(original, repl)
                    new_zone_conf[season_key] = s_data
                zone_conf = new_zone_conf
                
            seasons_info = {}
            for season_key in ['kharif', 'rabi', 'zaid']:
                crop_info = zone_conf[season_key]
                gross_rev = round(crop_info['baseRevenuePerAcre'] * zone_area * water_factor, 2)
                exp = round(gross_rev * expense_ratio, 2)
                profit = round(gross_rev - exp, 2)
                
                # floor margin (minimum 15% net profit)
                min_profit = round(gross_rev * 0.15, 2)
                if profit < min_profit:
                    profit = min_profit
                    exp = round(gross_rev - profit, 2)
                    
                # Split primary / companion
                primary = crop_info['crop']
                companion = "Companion"
                if " + " in crop_info['crop']:
                    parts = crop_info['crop'].split(" + ")
                    primary, companion = parts[0], parts[1]
                elif " (" in crop_info['crop']:
                    parts = crop_info['crop'].split(" (")
                    primary = parts[0]
                    companion = parts[1].replace(")", "")
                else:
                    if crop_info['crop'] == "Rabi Ratoon":
                        companion = "Sugarcane Stubble"
                    elif crop_info['crop'] == "Green Gram Cover":
                        companion = "Organic Mulch"
                    elif crop_info['crop'] == "Chickpea (Chana)":
                        primary = "Chickpea"
                        companion = "Chana"
                    elif crop_info['crop'] == "Fodder Maize":
                        companion = "Fodder Cowpea"
                    elif crop_info['crop'] == "Wheat":
                        companion = "Mustard Border"
                    elif crop_info['crop'] == "Sunflower":
                        companion = "Coriander Border"
                    elif crop_info['crop'] == "Horse Gram":
                        companion = "Cover Crop"
                    elif crop_info['crop'] == "Cowpea":
                        companion = "Organic Mulch"
                    elif crop_info['crop'] == "Safflower":
                        companion = "Organic Cover"
                    elif crop_info['crop'] == "Vegetables (Mint/Coriander)":
                        primary = "Vegetables"
                        companion = "Mint/Coriander"
                    elif crop_info['crop'] == "Finger Millet (Ragi)":
                        primary = "Finger Millet"
                        companion = "Ragi"
                    elif crop_info['crop'] == "Summer Cover Crops":
                        companion = "Sunnhemp"
                        
                seasons_info[season_key] = {
                    'cropPair': [primary, companion],
                    'plantingMonth': crop_info['sow'],
                    'harvestMonths': [crop_info['harvest']],
                    'expectedIncome': int(profit),
                    'expectedRevenue': int(gross_rev),
                    'inputCost': int(exp),
                    'benefits': [
                        "Ensures living canopy cover during summer (Zaid) to protect SOC.",
                        "Increases soil biodiversity and prevents monoculture pest carryover.",
                        "Staggers harvest cycles to maintain a continuous income calendar."
                    ]
                }
                total_gross_revenue += gross_rev
                total_expenses += exp
                
            zones.append({
                'zone_id': f"Zone_{letter}",
                'name': f"Zone {letter}",
                'area_acres': zone_area,
                'color': ["primary", "success", "accent"][idx % 3],
                'seasons': seasons_info
            })
            
        # Rotate starting month dynamically from registration month
        curr_month_idx = datetime.now().month - 1 # 0-11
        ordered_months = [ALL_MONTHS[(curr_month_idx + m) % 12] for m in range(12)]
        
        # Build Cashflow Matrix
        income_calendar = []
        for m_name in ordered_months:
            m_revenue = 0.0
            m_expenses = 0.0
            m_harvests = []
            m_breakdown = {}
            
            for zone in zones:
                z_id = zone['name']
                m_breakdown[z_id] = {'revenue': 0, 'expenses': 0, 'netProfit': 0}
                
                for season_key, s_data in zone['seasons'].items():
                    sow_m = s_data['plantingMonth']
                    har_m = s_data['harvestMonths'][0]
                    
                    sow_idx = ordered_months.index(sow_m) if sow_m in ordered_months else -1
                    har_idx = ordered_months.index(har_m) if har_m in ordered_months else -1
                    
                    skip_harvest = sow_idx == -1 or (har_idx != -1 and har_idx < sow_idx)
                    
                    # 30% of expenses in planting month
                    if sow_m == m_name:
                        exp_val = int(s_data['inputCost'] * 0.30)
                        m_expenses += exp_val
                        m_breakdown[z_id]['expenses'] += exp_val
                        
                    # 10% in mid-season month (sow month + 1)
                    if sow_idx != -1 and ordered_months[(sow_idx + 1) % 12] == m_name:
                        exp_val = int(s_data['inputCost'] * 0.10)
                        m_expenses += exp_val
                        m_breakdown[z_id]['expenses'] += exp_val
                        
                    # 60% of expenses + 100% revenue in harvest month
                    if not skip_harvest and har_m == m_name:
                        exp_val = int(s_data['inputCost'] * 0.60)
                        m_revenue += s_data['expectedRevenue']
                        m_expenses += exp_val
                        crop_pair = s_data['cropPair']
                        m_harvests.append(f"{z_id} ({crop_pair[0]} + {crop_pair[1]})")
                        m_breakdown[z_id]['revenue'] += s_data['expectedRevenue']
                        m_breakdown[z_id]['expenses'] += exp_val
                        
            for z_id in m_breakdown:
                m_breakdown[z_id]['netProfit'] = m_breakdown[z_id]['revenue'] - m_breakdown[z_id]['expenses']
                
            income_calendar.append({
                'month': m_name,
                'income': int(m_revenue - m_expenses),
                'revenue': int(m_revenue),
                'expenses': int(m_expenses),
                'zones_harvesting': m_harvests,
                'zoneBreakdown': m_breakdown
            })
            
        annual_income = sum(item['income'] for item in income_calendar)
        num_inc_months = sum(1 for item in income_calendar if item['income'] > 0)
        
        # Calculate composite ML/agronomic scores
        # We can construct assigned crop objects for scoring
        assigned_crops = []
        for zone in zones:
            for s_data in zone['seasons'].values():
                c_name = s_data['cropPair'][0].lower()
                # Find matching static crop configuration
                matched_crop = next((c for c in crop_suitability_model.models.keys() if c in c_name), None)
                assigned_crops.append({
                    'biodiversity_score': 85 if normalized_soil == 'Black' else 80,
                    'sustainability_score': 88 if normalized_soil == 'Black' else 82,
                    'risk_level': 25
                })
                
        scores_res = calculate_scores(annual_income, num_inc_months, assigned_crops)
        
        return {
            'farm_name': farm_name,
            'location': location,
            'state': state,
            'area_acres': area_acres,
            'soil_type': soil_type,
            'water_level': water_level,
            'budget': budget,
            'season': season,
            'zones': zones,
            'income_calendar': income_calendar,
            'annual_income': int(annual_income),
            'num_income_months': num_inc_months,
            'scores': {
                'stability_score': scores_res['stability_score'],
                'sustainability_score': scores_res['sustainability_score'],
                'biodiversity_score': scores_res['biodiversity_score'],
                'risk_score': scores_res['risk_score'],
                'total_score': scores_res['total_score']
            }
        }
        
    # ── CASE 2: Fallback Machine Learning zoning ──
    else:
        # Get ML predicted crops
        suitable_crops = crop_suitability_model.get_ranked_crops(soil_type, water_level, location, season)
        
        if not suitable_crops:
            raise Exception("No suitable crop combinations found for specified conditions.")
            
        base_month_idx = get_base_month_index(season)
        is_demo = (
            location == 'belagavi' and
            soil_type == 'red' and
            water_level == 'medium' and
            season == 'kharif' and
            area_acres == 1.0
        )
        
        zones = []
        assigned_crops = []
        zone_letters = ['A', 'B', 'C', 'D', 'E', 'F']
        
        for i in range(num_zones):
            if is_demo:
                # Force specific crops for demo
                if i in [0, 1]:
                    crop = next((c for c in suitable_crops if c['crop_id'] == 'jowar_pigeon_pea'), suitable_crops[0])
                else:
                    crop = next((c for c in suitable_crops if c['crop_id'] == 'tomato_marigold'), suitable_crops[1] if len(suitable_crops) > 1 else suitable_crops[0])
            else:
                crop = suitable_crops[i % len(suitable_crops)]
                
            assigned_crops.append(crop)
            
            planting_month = get_planting_month(base_month_idx, i)
            harvest_month = get_harvest_month(base_month_idx, i, crop['duration_days'])
            
            # Scaled financials
            expected_revenue = int(crop['revenue_per_acre'] * zone_area)
            input_cost = int(crop['input_cost_per_acre'] * zone_area)
            expected_profit = expected_revenue - input_cost
            
            zones.append({
                'zone_id': f"Z{zone_letters[i]}",
                'name': f"Zone {zone_letters[i]}",
                'area_acres': zone_area,
                'crop_id': crop['crop_id'],
                'primary_crop': crop['primary_crop'],
                'companion_crop': crop['companion_crop'],
                'planting_month': planting_month,
                'harvest_month': harvest_month,
                'expected_revenue': expected_revenue,
                'input_cost': input_cost,
                'expected_profit': expected_profit,
                'benefits': crop.get('benefits', []),
                'traditional_wisdom': crop.get('traditional_wisdom', '')
            })
            
        # 12-Month Calendar
        income_calendar = []
        for m_name in ALL_MONTHS:
            m_income = 0
            m_harvests = []
            
            for zone in zones:
                if zone['harvest_month'] == m_name:
                    m_income += zone['expected_profit']
                    m_harvests.append(zone['zone_id'])
                    
            income_calendar.append({
                'month': m_name,
                'income': m_income,
                'zones_harvesting': m_harvests
            })
            
        annual_income = sum(item['income'] for item in income_calendar)
        num_inc_months = sum(1 for item in income_calendar if item['income'] > 0)
        
        scores_res = calculate_scores(annual_income, num_inc_months, assigned_crops)
        
        return {
            'farm_name': farm_name,
            'location': location,
            'state': state,
            'area_acres': area_acres,
            'soil_type': soil_type,
            'water_level': water_level,
            'budget': budget,
            'season': season,
            'zones': zones,
            'income_calendar': income_calendar,
            'annual_income': int(annual_income),
            'num_income_months': num_inc_months,
            'scores': {
                'stability_score': scores_res['stability_score'],
                'sustainability_score': scores_res['sustainability_score'],
                'biodiversity_score': scores_res['biodiversity_score'],
                'risk_score': scores_res['risk_score'],
                'total_score': scores_res['total_score']
            }
        }

def map_to_frontend_plan(analysis, plan_id, created_at):
    short_months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    full_months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    
    # Parse date
    date_obj = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
    start_month_idx = date_obj.month - 1 # 0-11
    
    ordered_short_months = []
    ordered_full_months = []
    for i in range(12):
        idx = (start_month_idx + i) % 12
        ordered_short_months.append(short_months[idx])
        ordered_full_months.append(full_months[idx])
        
    mapped_zones = []
    letters = ["A", "B", "C", "D", "E", "F"]
    colors = { "A": "primary", "B": "success", "C": "accent", "D": "primary", "E": "success", "F": "accent" }
    
    for idx, z in enumerate(analysis['zones']):
        letter = letters[idx] if idx < len(letters) else "A"
        
        seasons_mapped = {}
        if 'seasons' in z:
            # Belagavi NTZ nested case
            for season_key, s in z['seasons'].items():
                seasons_mapped[season_key] = {
                    'cropPair': s['cropPair'],
                    'plantingMonth': s['plantingMonth'][:3],
                    'harvestMonths': [m[:3] for m in s['harvestMonths']],
                    'expectedIncome': s['expectedIncome']
                }
        else:
            # Fallback flat case
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
            'id': letter,
            'name': z.get('name', f"Zone {letter}"),
            'area': z.get('area_acres', z.get('areaAcres', 0.33)),
            'color': colors.get(letter, "primary"),
            'seasons': seasons_mapped
        })
        
    # Traditional monoculture comparison
    traditional_total = analysis['annual_income'] * 0.7
    monthly = []
    
    for idx, m in enumerate(ordered_short_months):
        full_month_name = ordered_full_months[idx]
        calendar_month = next((cm for cm in analysis['income_calendar'] if cm['month'] == full_month_name), None)
        krishiflow_income = calendar_month['income'] if calendar_month else 0
        
        traditional_income = 0
        if m == "Nov":
            traditional_income = int(traditional_total * 0.85)
        elif m == "Dec":
            traditional_income = int(traditional_total * 0.15)
            
        monthly.append({
            'month': m,
            'traditional': traditional_income,
            'krishiflow': krishiflow_income,
            'revenue': calendar_month['revenue'] if calendar_month and 'revenue' in calendar_month else 0,
            'expenses': calendar_month['expenses'] if calendar_month and 'expenses' in calendar_month else 0,
            'zoneBreakdown': calendar_month['zoneBreakdown'] if calendar_month and 'zoneBreakdown' in calendar_month else {
                "Zone A": {"revenue": 0, "expenses": 0, "netProfit": 0},
                "Zone B": {"revenue": 0, "expenses": 0, "netProfit": 0},
                "Zone C": {"revenue": 0, "expenses": 0, "netProfit": 0}
            }
        })
        
    seen_crops = set()
    recommendations = []
    
    crop_yields = {
      "sugarcane_soyabean": "Sugarcane 35-40 tonnes, Soyabean 8-10 qtl",
      "jowar_pigeon_pea": "Jowar 8-10 qtl, Tur 3-4 qtl",
      "cotton_groundnut": "Cotton 6-8 qtl, Groundnut 6-8 qtl",
      "bajra_pigeon_pea": "Bajra 6-8 qtl, Tur 2-3 qtl",
      "maize_beans": "Maize 18-20 qtl, Beans 15-18 qtl",
      "groundnut_sesame": "Groundnut 8-10 qtl, Sesame 2-3 qtl",
      "rabi_ratoon": "Ratoon Sugarcane 30 tonnes",
      "chickpea": "Chickpea 5-6 qtl",
      "wheat": "Wheat 12-15 qtl",
      "horse_gram": "Horsegram 4-5 qtl",
      "safflower": "Safflower 4-5 qtl",
      "finger_millet": "Ragi 10-12 qtl",
      "green_gram": "Green Gram 3-4 qtl",
      "fodder_maize": "Fodder 150-180 qtl",
      "sunflower": "Sunflower 5-6 qtl",
      "cowpea": "Cowpea 3-4 qtl",
      "vegetables": "Mint/Coriander 40-50 qtl",
      "summer_cover": "Green biomass 8-10 tonnes"
    }
    
    crop_prices = {
      "sugarcane_soyabean": "₹3,150/tonne Sugarcane · ₹4,200/qtl Soyabean",
      "jowar_pigeon_pea": "₹2,800/qtl Jowar · ₹6,500/qtl Tur",
      "cotton_groundnut": "₹6,800/qtl Cotton · ₹5,800/qtl Groundnut",
      "bajra_pigeon_pea": "₹2,350/qtl Bajra · ₹6,500/qtl Tur",
      "maize_beans": "₹2,200/qtl Maize · ₹4,000/qtl Beans",
      "groundnut_sesame": "₹5,800/qtl Groundnut · ₹7,500/qtl Sesame",
      "rabi_ratoon": "₹3,150/tonne Sugarcane",
      "chickpea": "₹5,300/qtl Chickpea",
      "wheat": "₹2,400/qtl Wheat",
      "horse_gram": "₹4,200/qtl Horsegram",
      "safflower": "₹5,440/qtl Safflower",
      "finger_millet": "₹3,846/qtl Ragi",
      "green_gram": "₹7,200/qtl Green Gram",
      "fodder_maize": "₹250/qtl Fodder",
      "sunflower": "₹5,650/qtl Sunflower",
      "cowpea": "₹6,000/qtl Cowpea",
      "vegetables": "₹1,500/qtl Vegetables",
      "summer_cover": "Organic nitrogen credits"
    }
    
    for z in analysis['zones']:
        crops_to_process = []
        if 'seasons' in z:
            for s_key, s in z['seasons'].items():
                crops_to_process.append({
                    'primary': s['cropPair'][0],
                    'companion': s['cropPair'][1],
                    'why': s['benefits'][0] if 'benefits' in s and s['benefits'] else 'Complementary crop pairing optimized for Belagavi Northern Transitional Zone.',
                    'wisdom': z.get('traditional_wisdom', 'Traditional heritage practice native to northern Karnataka.')
                })
        else:
            crops_to_process.append({
                'primary': z.get('primary_crop', 'Crop'),
                'companion': z.get('companion_crop', 'Companion'),
                'why': z.get('benefits', ['Complementary crop pairing for Belagavi Transitional Zone.'])[0],
                'wisdom': z.get('traditional_wisdom', 'Traditional heritage practice native to northern Karnataka.')
            })
            
        for crop in crops_to_process:
            crop_key = f"{crop['primary']}_{crop['companion']}"
            if crop_key not in seen_crops:
                seen_crops.add(crop_key)
                
                key_str = (crop['primary'].lower().replace(" ", "") + "_" + crop['companion'].lower().replace(" ", ""))
                matched_key = "jowar_pigeon_pea"
                for k in crop_yields.keys():
                    if k in key_str or key_str in k:
                        matched_key = k
                        break
                        
                recommendations.append({
                    'crop': crop['primary'],
                    'partner': crop['companion'],
                    'why': crop['why'],
                    'traditionalWisdom': crop['wisdom'],
                    'yieldPerAcre': crop_yields.get(matched_key, "Varies by zone."),
                    'marketPrice': crop_prices.get(matched_key, "Varies by zone.")
                })
                
    # Chronological Timeline
    timeline = []
    for z_idx, z in enumerate(analysis['zones']):
        zone_events = []
        zone_name = z.get('name', f"Zone {letters[z_idx] if z_idx < len(letters) else 'A'}")
        
        if 'seasons' in z:
            for s_key, s in z['seasons'].items():
                short_plant = s['plantingMonth'][:3]
                short_harvest = s['harvestMonths'][0][:3]
                
                sow_idx = (short_months.index(short_plant) - start_month_idx + 12) % 12
                harvest_idx = (short_months.index(short_harvest) - start_month_idx + 12) % 12
                
                if harvest_idx <= sow_idx:
                    continue
                    
                zone_events.append({
                    'month': short_plant,
                    'monthIdx': sow_idx,
                    'type': "sow",
                    'zone': zone_name,
                    'action': f"Sow {s['cropPair'][0]} + {s['cropPair'][1]}",
                    'detail': "Prepare soil rows, apply organic manure and seed treatments."
                })
                
                zone_events.append({
                    'month': short_harvest,
                    'monthIdx': harvest_idx,
                    'type': "harvest",
                    'zone': zone_name,
                    'action': "Harvest crops",
                    'detail': "Harvest at maturity, sun-dry before packaging."
                })
        else:
            short_plant = z.get('planting_month', 'Jun')[:3]
            short_harvest = z.get('harvest_month', 'Oct')[:3]
            
            sow_idx = (short_months.index(short_plant) - start_month_idx + 12) % 12
            harvest_idx = (short_months.index(short_harvest) - start_month_idx + 12) % 12
            
            if harvest_idx <= sow_idx:
                continue
                
            zone_events.append({
                'month': short_plant,
                'monthIdx': sow_idx,
                'type': "sow",
                'zone': zone_name,
                'action': f"Sow {z['primary_crop']} + {z['companion_crop']}",
                'detail': "Prepare soil rows, apply organic manure and seed treatments."
            })
            
            zone_events.append({
                'month': short_harvest,
                'monthIdx': harvest_idx,
                'type': "harvest",
                'zone': zone_name,
                'action': "Harvest crops",
                'detail': "Harvest at maturity, sun-dry before packaging."
            })
            
        zone_events.sort(key=lambda e: e['monthIdx'])
        
        for i, current_event in enumerate(zone_events):
            timeline.append({
                'month': current_event['month'],
                'zone': current_event['zone'],
                'action': current_event['action'],
                'detail': current_event['detail']
            })
            
            next_event = zone_events[(i + 1) % len(zone_events)]
            if current_event['type'] == 'harvest' and next_event['type'] == 'sow':
                gap_months = (next_event['monthIdx'] - current_event['monthIdx'] + 12) % 12
                if gap_months >= 2:
                    cover_sow_idx = (current_event['monthIdx'] + 1) % 12
                    cover_inc_idx = (next_event['monthIdx'] - 1 + 12) % 12
                    detail_text = "Broadcast Sunnhemp/Dhaincha seeds post-harvest to prevent weed growth, protect soil organic carbon, and fix nitrogen."
                    
                    if cover_inc_idx == cover_sow_idx:
                        detail_text += " Plow back into soil before the next crop cycle."
                        
                    timeline.append({
                        'month': short_months[(start_month_idx + cover_sow_idx) % 12],
                        'zone': zone_name,
                        'action': "Sow Green Manure (Sunnhemp/Dhaincha)",
                        'detail': detail_text
                    })
                    
                    if cover_inc_idx != cover_sow_idx:
                        timeline.append({
                            'month': short_months[(start_month_idx + cover_inc_idx) % 12],
                            'zone': zone_name,
                            'action': "Incorporate Green Manure into soil",
                            'detail': "Plow the green cover crop back into the soil to decompose, enriching it with organic matter and nitrogen."
                        })
                        
    # Sort timeline chronologically
    timeline.sort(key=lambda e: (short_months.index(e['month']) - start_month_idx + 12) % 12)
    
    # 5-day Weather (Mock for frontend)
    short_days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    weather_icons = { "sunny": "☀️", "rain": "🌦️", "cloudy": "☁️" }
    start_day_idx = datetime.now().weekday()
    js_weekday = (start_day_idx + 1) % 7
    
    weather = []
    for i in range(5):
        day_name = short_days[(js_weekday + i) % 7]
        cond = "rain" if i == 2 else "sunny"
        weather.append({
            'day': "Today" if i == 0 else "Tomorrow" if i == 1 else day_name,
            'temp': 27 + (i % 3),
            'rain': 12 if i == 2 else 0,
            'icon': weather_icons[cond],
            'condition': "Light rain" if cond == "rain" else "Sunny"
        })
        
    totals_revenue = 0
    for z in analysis['zones']:
        if 'seasons' in z:
            totals_revenue += sum(s.get('expectedRevenue', 0) for s in z['seasons'].values())
        else:
            totals_revenue += z.get('expected_revenue', 0)
            
    return {
        'id': plan_id,
        'createdAt': created_at,
        'input': {
            'farmName': analysis['farm_name'],
            'landArea': float(analysis['area_acres']),
            'district': analysis['location'].capitalize(),
            'state': analysis['state'],
            'soilType': analysis['soil_type'].capitalize(),
            'water': analysis['water_level'].capitalize(),
            'season': analysis['season'].capitalize(),
            'budget': analysis['budget'] or 50000
        },
        'zones': mapped_zones,
        'monthly': monthly,
        'recommendations': recommendations,
        'scores': {
            'incomeStability': int(analysis['scores']['stability_score']),
            'sustainability': int(analysis['scores']['sustainability_score']),
            'biodiversity': int(analysis['scores']['biodiversity_score']),
            'riskMitigation': int(analysis['scores']['risk_score'])
        },
        'weather': weather,
        'advisory': "Favorable conditions for agricultural operations. Ensure staggered schedules are monitored.",
        'timeline': timeline,
        'totals': {
            'annualRevenue': int(totals_revenue),
            'netProfit': int(analysis['annual_income']),
            'activeMonths': int(analysis['num_income_months'])
        }
    }
