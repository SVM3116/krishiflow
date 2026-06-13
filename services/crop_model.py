import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import logging

logger = logging.getLogger(__name__)

# List of traditional crop pairs (mirrors JavaScript FALLBACK_CROP_PAIRS)
CROP_PAIRS = [
    {
        'crop_id': 'jowar_pigeon_pea',
        'primary_crop': 'Jowar (Sorghum)',
        'companion_crop': 'Pigeon Pea (Tur / Red Gram)',
        'suitable_soil': ['red', 'black', 'loam'],
        'water_requirement': 'low',
        'regions': ['belagavi', 'vijayapura', 'dharwad', 'raichur', 'bellary', 'bidar', 'koppal'],
        'seasons': ['kharif'],
        'duration_days': 120,
        'benefits': [
            'Pigeon Pea fixes atmospheric nitrogen, enriching soil for Jowar.',
            'Jowar stalks act as natural windbreaks and support structures.',
            'Drought tolerance ensures stability during erratic rainfalls.',
            'Combined yields provide a steady supply of fodder and high-protein grain.'
        ],
        'traditional_wisdom': 'Practiced across the Deccan Plateau for two millennia, Jowar and Pigeon Pea are the ultimate dryland survival pair. The deep-rooting pigeon pea breaks hard soil layers and accesses deep nutrients, while the shallow-rooting Jowar thrives on surface moisture, sharing space without crop competition.',
        'revenue_per_acre': 145000,
        'input_cost_per_acre': 30000,
        'biodiversity_score': 88,
        'sustainability_score': 92,
        'risk_level': 15
    },
    {
        'crop_id': 'groundnut_red_gram',
        'primary_crop': 'Groundnut',
        'companion_crop': 'Red Gram (Pigeon Pea)',
        'suitable_soil': ['red', 'sandy', 'loam'],
        'water_requirement': 'low',
        'regions': ['belagavi', 'haveri', 'dharwad', 'gadag', 'koppal'],
        'seasons': ['kharif'],
        'duration_days': 120,
        'benefits': [
            'Double nitrogen-fixing capability improves soil health rapidly.',
            'Groundnut foliage creates a dense canopy, retaining soil moisture.',
            'Varying root depths prevent competition for nutrients.',
            'Groundnut provides oilseed income while Red Gram acts as a buffer.'
        ],
        'traditional_wisdom': "In Karnataka's oilseed belt, groundnuts and pigeon peas form a crop partnership where groundnuts cover the ground like a protective blanket, reducing evaporation and weed growth, while the pigeon pea grows upright, utilizing higher airspace and solar radiation.",
        'revenue_per_acre': 155000,
        'input_cost_per_acre': 35000,
        'biodiversity_score': 85,
        'sustainability_score': 88,
        'risk_level': 20
    },
    {
        'crop_id': 'tomato_marigold',
        'primary_crop': 'Tomato',
        'companion_crop': 'Marigold',
        'suitable_soil': ['red', 'black', 'loam'],
        'water_requirement': 'medium',
        'regions': ['belagavi', 'kolar', 'chikkballapur', 'chikkaballapur', 'hassan', 'mandya'],
        'seasons': ['kharif', 'rabi'],
        'duration_days': 90,
        'benefits': [
            'Marigold roots release alpha-terthienyl, which kills harmful root nematodes.',
            'Bright flowers attract pollinators, increasing tomato fruit yields.',
            'Acts as a trap crop for whiteflies, aphids, and fruit borers.',
            'Marigold flowers can be sold separately in local markets for festivals.'
        ],
        'traditional_wisdom': 'South Indian farmers have long bordered tomato patches with vibrant marigold rows. Scientifically proven, the root exudates of marigold repel root-knot nematodes that devastate solanaceous crops like tomatoes, presenting a classic example of biological pest control.',
        'revenue_per_acre': 260000,
        'input_cost_per_acre': 50000,
        'biodiversity_score': 78,
        'sustainability_score': 80,
        'risk_level': 50
    },
    {
        'crop_id': 'ragi_horsegram',
        'primary_crop': 'Finger Millet (Ragi)',
        'companion_crop': 'Horsegram (Hurali)',
        'suitable_soil': ['red', 'sandy'],
        'water_requirement': 'low',
        'regions': ['belagavi', 'tumkur', 'hassan', 'chitradurga', 'mysore'],
        'seasons': ['kharif'],
        'duration_days': 90,
        'benefits': [
            'Backbone of dryland agriculture, requiring almost zero irrigation.',
            'Horsegram nitrogen-fixation supports Ragi\'s high silica and mineral uptake.',
            'Excellent nutritional profile for farm families (calcium + protein).',
            'Provides high-quality fodder for cattle post-harvest.'
        ],
        'traditional_wisdom': "Documented in ancient Kannada agricultural lore, Ragi and Hurali are the twin pillars of food security. If the monsoons fail completely, the horsegram acts as an insurance crop, sustaining the family and livestock even under severe drought conditions.",
        'revenue_per_acre': 120000,
        'input_cost_per_acre': 20000,
        'biodiversity_score': 90,
        'sustainability_score': 95,
        'risk_level': 12
    },
    {
        'crop_id': 'cotton_moong',
        'primary_crop': 'Cotton',
        'companion_crop': 'Moong (Green Gram)',
        'suitable_soil': ['black', 'loam'],
        'water_requirement': 'medium',
        'regions': ['belagavi', 'dharwad', 'haveri', 'davangere', 'gadag'],
        'seasons': ['kharif'],
        'duration_days': 150,
        'benefits': [
            'Moong provides a critical early income stream at 60 days.',
            'Nitrogen fixed by Moong is immediately used by Cotton during its bolling stage.',
            'Intercropping disrupts the lifecycle of sucking pests.',
            'Reduces the acreage of exposed black soil, minimizing erosion.'
        ],
        'traditional_wisdom': 'Cotton is a heavy-feeding crop with a long maturation cycle. By sowing fast-growing Green Gram (Moong) in the spaces between cotton rows, farmers generate early season cash flow to pay for labor and management, while fertilizing the cotton crop organically.',
        'revenue_per_acre': 195000,
        'input_cost_per_acre': 45000,
        'biodiversity_score': 75,
        'sustainability_score': 72,
        'risk_level': 40
    },
    {
        'crop_id': 'sunflower_coriander',
        'primary_crop': 'Sunflower',
        'companion_crop': 'Coriander',
        'suitable_soil': ['loam', 'red', 'black'],
        'water_requirement': 'medium',
        'regions': ['belagavi', 'bidar', 'gulbarga', 'kalaburagi', 'raichur'],
        'seasons': ['kharif', 'rabi'],
        'duration_days': 90,
        'benefits': [
            'Coriander flowers attract honeybees, boosting sunflower pollination by 20%.',
            'Tall sunflowers shade delicate coriander, preventing heat bolting.',
            'Aromatic coriander oils confuse sucking pests, protecting the crop.',
            'Fast-growing coriander provides a quick yield and secondary income.'
        ],
        'traditional_wisdom': 'Bee activity is critical for sunflower seed filling. Coriander blooms early and emits strong floral signals that draw in wild honeybees. The bees, once present, actively cross-pollinate the sunflowers, resulting in fewer empty seeds and higher oil percentage.',
        'revenue_per_acre': 170000,
        'input_cost_per_acre': 35000,
        'biodiversity_score': 82,
        'sustainability_score': 84,
        'risk_level': 28
    },
    {
        'crop_id': 'chilli_onion',
        'primary_crop': 'Chilli',
        'companion_crop': 'Onion',
        'suitable_soil': ['red', 'loam', 'black'],
        'water_requirement': 'medium',
        'regions': ['belagavi', 'dharwad', 'haveri', 'bijapur', 'vijayapura'],
        'seasons': ['rabi', 'kharif'],
        'duration_days': 120,
        'benefits': [
            'Onion sulfur compounds act as a natural repellant against thrips.',
            'High cash value crop pairing with very strong local APMC demand.',
            'Deep root systems of Chilli do not compete with shallow onion roots.',
            'Can be staggered to harvest green chillies and dried onions sequentially.'
        ],
        'traditional_wisdom': 'In Dharwad and Belagavi districts, the Chilli-Onion intercrop is renowned. The pungent sulfur volatile compounds released by onions form an invisible shield around the chilli plants, keeping pests like thrips at bay and reducing chemical spray costs.',
        'revenue_per_acre': 280000,
        'input_cost_per_acre': 60000,
        'biodiversity_score': 75,
        'sustainability_score': 70,
        'risk_level': 55
    },
    {
        'crop_id': 'maize_beans',
        'primary_crop': 'Maize',
        'companion_crop': 'French Beans',
        'suitable_soil': ['loam', 'red', 'black'],
        'water_requirement': 'medium',
        'regions': ['belagavi', 'dharwad', 'haveri', 'shimoga', 'hassan'],
        'seasons': ['kharif'],
        'duration_days': 90,
        'benefits': [
            'Beans climb the sturdy maize stalks, saving trellis costs.',
            'Beans fix nitrogen, feeding the highly nutrient-intensive maize.',
            'Dense foliage acts as a living mulch, choking out weeds.',
            'Provides human diets with balanced carbohydrates and protein.'
        ],
        'traditional_wisdom': 'This pairing adapts the ancient global Mesoamerican "Three Sisters" framework. Sown together, the beans utilize the vertical space of maize, while providing it with nitrogen. It creates a microclimate that prevents soil erosion and maintains high soil moisture.',
        'revenue_per_acre': 185000,
        'input_cost_per_acre': 40000,
        'biodiversity_score': 80,
        'sustainability_score': 82,
        'risk_level': 30
    }
]

# Numerical encodings for Categorical features
SOIL_MAP = {'red': 0, 'black': 1, 'loam': 2, 'sandy': 3, 'clay': 4}
WATER_MAP = {'low': 0, 'medium': 1, 'high': 2}
SEASON_MAP = {'kharif': 0, 'rabi': 1, 'zaid': 2}
REGION_MAP = {
    'belagavi': 0, 'bengaluru': 1, 'shivamogga': 2, 'kalaburagi': 3,
    'dharwad': 4, 'haveri': 5, 'gadag': 6, 'vijayapura': 7,
    'raichur': 8, 'bellary': 9, 'koppal': 10, 'other': 11
}

def encode_features(soil, water, region, season):
    """Convert input string parameters to a numerical numpy array."""
    soil_val = SOIL_MAP.get(soil.lower().replace(" cotton", ""), 2) # default loam
    water_val = WATER_MAP.get(water.lower(), 1) # default medium
    season_val = SEASON_MAP.get(season.lower(), 0) # default kharif
    
    # Try finding district matching keys
    clean_reg = region.lower().strip()
    reg_val = REGION_MAP.get('other')
    for k, v in REGION_MAP.items():
        if k in clean_reg:
            reg_val = v
            break
            
    return np.array([[soil_val, water_val, reg_val, season_val]])

class CropSuitabilityClassifier:
    def __init__(self):
        self.models = {}
        self._train_models()

    def _calculate_base_score(self, crop, soil, water, region, season):
        """Standard agronomic logic to build training dataset labels."""
        score = 0.0
        
        # 1. Soil Match (+30)
        if any(s.lower() in soil.lower() for s in crop['suitable_soil']):
            score += 30.0
            
        # 2. Water Match (+25 or +10)
        c_water = crop['water_requirement'].lower()
        u_water = water.lower()
        
        if c_water == u_water:
            score += 25.0
        elif c_water == 'low' and u_water == 'medium':
            score += 25.0
        elif c_water == 'medium' and u_water == 'high':
            score += 25.0
        elif c_water == 'low' and u_water == 'high':
            score += 25.0
        elif (c_water == 'medium' and u_water == 'low') or (c_water == 'high' and u_water == 'medium'):
            score += 10.0 # Stress condition
            
        # 3. Region Match (+25)
        if any(r.lower() in region.lower() for r in crop['regions']):
            score += 25.0
            
        # 4. Season Match (+20)
        if any(s.lower() in season.lower() for s in crop['seasons']):
            score += 20.0
            
        # 5. Risk Penalty
        score -= (crop['risk_level'] * 0.1)
        
        return max(0.0, score)

    def _train_models(self):
        """Train a RandomForestRegressor for each crop pair on synthetic combinations."""
        logger.info("Training machine learning crop suitability models...")
        
        # Build training grid
        records = []
        for s_name, s_idx in SOIL_MAP.items():
            for w_name, w_idx in WATER_MAP.items():
                for r_name, r_idx in REGION_MAP.items():
                    for se_name, se_idx in SEASON_MAP.items():
                        records.append({
                            'soil': s_idx,
                            'water': w_idx,
                            'region': r_idx,
                            'season': se_idx,
                            'soil_name': s_name,
                            'water_name': w_name,
                            'region_name': r_name,
                            'season_name': se_name
                        })
                        
        df_train = pd.DataFrame(records)
        X = df_train[['soil', 'water', 'region', 'season']].values
        
        # Train a model for each crop pair
        for crop in CROP_PAIRS:
            crop_id = crop['crop_id']
            # Calculate suitability label for each synthetic state
            y = np.array([
                self._calculate_base_score(
                    crop, 
                    row['soil_name'], 
                    row['water_name'], 
                    row['region_name'], 
                    row['season_name']
                ) for _, row in df_train.iterrows()
            ])
            
            # Fit Random Forest Regressor
            model = RandomForestRegressor(n_estimators=30, random_state=42, max_depth=6)
            model.fit(X, y)
            self.models[crop_id] = model
            
        logger.info("Successfully trained 8 crop suitability Random Forest regressors.")

    def get_ranked_crops(self, soil, water, region, season):
        """Predict crop scores using Random Forest regressor and sort them."""
        features = encode_features(soil, water, region, season)
        
        scored_crops = []
        for crop in CROP_PAIRS:
            crop_id = crop['crop_id']
            model = self.models.get(crop_id)
            if model:
                # Predict matching score using ML
                predicted_score = float(model.predict(features)[0])
                predicted_score = max(0.0, min(100.0, predicted_score))
            else:
                predicted_score = 0.0
                
            crop_copy = crop.copy()
            crop_copy['match_score'] = round(predicted_score, 2)
            # Add calculated field net_profit_per_acre
            crop_copy['net_profit_per_acre'] = crop_copy['revenue_per_acre'] - crop_copy['input_cost_per_acre']
            scored_crops.append(crop_copy)
            
        # Sort by match score descending
        return sorted(scored_crops, key=lambda c: c['match_score'], reverse=True)

# Initialize single instance
crop_suitability_model = CropSuitabilityClassifier()
