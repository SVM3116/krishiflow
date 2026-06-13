const { supabase } = require('./supabaseClient');

// Scaled crop yields to ensure 1-acre staggered plans achieve between ₹1,00,000 and ₹1,60,000 annual profit
const FALLBACK_CROP_PAIRS = [
  {
    crop_id: 'jowar_pigeon_pea',
    primary_crop: 'Jowar (Sorghum)',
    companion_crop: 'Pigeon Pea (Tur / Red Gram)',
    suitable_soil: ['red', 'black', 'loam'],
    water_requirement: 'low',
    regions: ['belagavi', 'vijayapura', 'dharwad', 'raichur', 'bellary', 'bidar', 'koppal'],
    seasons: ['kharif'],
    duration_days: 120, // Adjusted to 120 days so planting in June harvests in October, and July in November
    benefits: [
      'Pigeon Pea fixes atmospheric nitrogen, enriching soil for Jowar.',
      'Jowar stalks act as natural windbreaks and support structures.',
      'Drought tolerance ensures stability during erratic rainfalls.',
      'Combined yields provide a steady supply of fodder and high-protein grain.'
    ],
    traditional_wisdom: 'Practiced across the Deccan Plateau for two millennia, Jowar and Pigeon Pea are the ultimate dryland survival pair. The deep-rooting pigeon pea breaks hard soil layers and accesses deep nutrients, while the shallow-rooting Jowar thrives on surface moisture, sharing space without crop competition.',
    revenue_per_acre: 145000,
    input_cost_per_acre: 30000,
    biodiversity_score: 88,
    sustainability_score: 92,
    risk_level: 15
  },
  {
    crop_id: 'groundnut_red_gram',
    primary_crop: 'Groundnut',
    companion_crop: 'Red Gram (Pigeon Pea)',
    suitable_soil: ['red', 'sandy', 'loam'],
    water_requirement: 'low',
    regions: ['belagavi', 'haveri', 'dharwad', 'gadag', 'koppal'],
    seasons: ['kharif'],
    duration_days: 120,
    benefits: [
      'Double nitrogen-fixing capability improves soil health rapidly.',
      'Groundnut foliage creates a dense canopy, retaining soil moisture.',
      'Varying root depths prevent competition for nutrients.',
      'Groundnut provides oilseed income while Red Gram acts as a buffer.'
    ],
    traditional_wisdom: 'In Karnataka\'s oilseed belt, groundnuts and pigeon peas form a crop partnership where groundnuts cover the ground like a protective blanket, reducing evaporation and weed growth, while the pigeon pea grows upright, utilizing higher airspace and solar radiation.',
    revenue_per_acre: 155000,
    input_cost_per_acre: 35000,
    biodiversity_score: 85,
    sustainability_score: 88,
    risk_level: 20
  },
  {
    crop_id: 'tomato_marigold',
    primary_crop: 'Tomato',
    companion_crop: 'Marigold',
    suitable_soil: ['red', 'black', 'loam'],
    water_requirement: 'medium',
    regions: ['belagavi', 'kolar', 'chikkballapur', 'chikkaballapur', 'hassan', 'mandya'],
    seasons: ['kharif', 'rabi'],
    duration_days: 90, // Adjusted to 90 days so planting in August harvests in November
    benefits: [
      'Marigold roots release alpha-terthienyl, which kills harmful root nematodes.',
      'Bright flowers attract pollinators, increasing tomato fruit yields.',
      'Acts as a trap crop for whiteflies, aphids, and fruit borers.',
      'Marigold flowers can be sold separately in local markets for festivals.'
    ],
    traditional_wisdom: 'South Indian farmers have long bordered tomato patches with vibrant marigold rows. Scientifically proven, the root exudates of marigold repel root-knot nematodes that devastate solanaceous crops like tomatoes, presenting a classic example of biological pest control.',
    revenue_per_acre: 260000,
    input_cost_per_acre: 50000,
    biodiversity_score: 78,
    sustainability_score: 80,
    risk_level: 50
  },
  {
    crop_id: 'ragi_horsegram',
    primary_crop: 'Finger Millet (Ragi)',
    companion_crop: 'Horsegram (Hurali)',
    suitable_soil: ['red', 'sandy'],
    water_requirement: 'low',
    regions: ['belagavi', 'tumkur', 'hassan', 'chitradurga', 'mysore'],
    seasons: ['kharif'],
    duration_days: 90,
    benefits: [
      'Backbone of dryland agriculture, requiring almost zero irrigation.',
      'Horsegram nitrogen-fixation supports Ragi\'s high silica and mineral uptake.',
      'Excellent nutritional profile for farm families (calcium + protein).',
      'Provides high-quality fodder for cattle post-harvest.'
    ],
    traditional_wisdom: 'Documented in ancient Kannada agricultural lore, Ragi and Hurali are the twin pillars of food security. If the monsoons fail completely, the horsegram acts as an insurance crop, sustaining the family and livestock even under severe drought conditions.',
    revenue_per_acre: 120000,
    input_cost_per_acre: 20000,
    biodiversity_score: 90,
    sustainability_score: 95,
    risk_level: 12
  },
  {
    crop_id: 'cotton_moong',
    primary_crop: 'Cotton',
    companion_crop: 'Moong (Green Gram)',
    suitable_soil: ['black', 'loam'],
    water_requirement: 'medium',
    regions: ['belagavi', 'dharwad', 'haveri', 'davangere', 'gadag'],
    seasons: ['kharif'],
    duration_days: 150,
    benefits: [
      'Moong provides a critical early income stream at 60 days.',
      'Nitrogen fixed by Moong is immediately used by Cotton during its bolling stage.',
      'Intercropping disrupts the lifecycle of sucking pests.',
      'Reduces the acreage of exposed black soil, minimizing erosion.'
    ],
    traditional_wisdom: 'Cotton is a heavy-feeding crop with a long maturation cycle. By sowing fast-growing Green Gram (Moong) in the spaces between cotton rows, farmers generate early season cash flow to pay for labor and management, while fertilizing the cotton crop organically.',
    revenue_per_acre: 195000,
    input_cost_per_acre: 45000,
    biodiversity_score: 75,
    sustainability_score: 72,
    risk_level: 40
  },
  {
    crop_id: 'sunflower_coriander',
    primary_crop: 'Sunflower',
    companion_crop: 'Coriander',
    suitable_soil: ['loam', 'red', 'black'],
    water_requirement: 'medium',
    regions: ['belagavi', 'bidar', 'gulbarga', 'kalaburagi', 'raichur'],
    seasons: ['kharif', 'rabi'],
    duration_days: 90,
    benefits: [
      'Coriander flowers attract honeybees, boosting sunflower pollination by 20%.',
      'Tall sunflowers shade delicate coriander, preventing heat bolting.',
      'Aromatic coriander oils confuse sucking pests, protecting the crop.',
      'Fast-growing coriander provides a quick yield and secondary income.'
    ],
    traditional_wisdom: 'Bee activity is critical for sunflower seed filling. Coriander blooms early and emits strong floral signals that draw in wild honeybees. The bees, once present, actively cross-pollinate the sunflowers, resulting in fewer empty seeds and higher oil percentage.',
    revenue_per_acre: 170000,
    input_cost_per_acre: 35000,
    biodiversity_score: 82,
    sustainability_score: 84,
    risk_level: 28
  },
  {
    crop_id: 'chilli_onion',
    primary_crop: 'Chilli',
    companion_crop: 'Onion',
    suitable_soil: ['red', 'loam', 'black'],
    water_requirement: 'medium',
    regions: ['belagavi', 'dharwad', 'haveri', 'bijapur', 'vijayapura'],
    seasons: ['rabi', 'kharif'],
    duration_days: 120,
    benefits: [
      'Onion sulfur compounds act as a natural repellant against thrips.',
      'High cash value crop pairing with very strong local APMC demand.',
      'Deep root systems of Chilli do not compete with shallow onion roots.',
      'Can be staggered to harvest green chillies and dried onions sequentially.'
    ],
    traditional_wisdom: 'In Dharwad and Belagavi districts, the Chilli-Onion intercrop is renowned. The pungent sulfur volatile compounds released by onions form an invisible shield around the chilli plants, keeping pests like thrips at bay and reducing chemical spray costs.',
    revenue_per_acre: 280000,
    input_cost_per_acre: 60000,
    biodiversity_score: 75,
    sustainability_score: 70,
    risk_level: 55
  },
  {
    crop_id: 'maize_beans',
    primary_crop: 'Maize',
    companion_crop: 'French Beans',
    suitable_soil: ['loam', 'red', 'black'],
    water_requirement: 'medium',
    regions: ['belagavi', 'dharwad', 'haveri', 'shimoga', 'hassan'],
    seasons: ['kharif'],
    duration_days: 90,
    benefits: [
      'Beans climb the sturdy maize stalks, saving trellis costs.',
      'Beans fix nitrogen, feeding the highly nutrient-intensive maize.',
      'Dense foliage acts as a living mulch, choking out weeds.',
      'Provides human diets with balanced carbohydrates and protein.'
    ],
    traditional_wisdom: 'This pairing adapts the ancient global Mesoamerican "Three Sisters" framework. Sown together, the beans utilize the vertical space of maize, while providing it with nitrogen. It creates a microclimate that prevents soil erosion and maintains high soil moisture.',
    revenue_per_acre: 185000,
    input_cost_per_acre: 40000,
    biodiversity_score: 80,
    sustainability_score: 82,
    risk_level: 30
  }
];

/**
 * Determine if water requirements are compatible.
 * Returns true if the crop requires less or equal water than what is available.
 */
const isWaterSufficient = (cropWater, userWater) => {
  const levels = { low: 1, medium: 2, high: 3 };
  const cropVal = levels[cropWater.toLowerCase()] || 1;
  const userVal = levels[userWater.toLowerCase()] || 2;
  return cropVal <= userVal;
};

/**
 * Determine if two water requirements are adjacent
 */
const areWaterLevelsAdjacent = (w1, w2) => {
  if (!w1 || !w2) return false;
  const val1 = w1.toLowerCase();
  const val2 = w2.toLowerCase();
  if (val1 === val2) return false;
  
  if (val1 === 'low' && val2 === 'medium') return true;
  if (val1 === 'medium' && (val2 === 'low' || val2 === 'high')) return true;
  if (val1 === 'high' && val2 === 'medium') return true;
  
  return false;
};

/**
 * Get all crop pairs from Supabase or use fallback list
 */
const getCropPairsFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('crop_pairs')
      .select('*');
      
    if (error) {
      console.error('Error fetching crop pairs from database, using fallback data:', error.message);
      return FALLBACK_CROP_PAIRS;
    }
    
    if (!data || data.length === 0) {
      console.warn('crop_pairs table is empty, using fallback data.');
      return FALLBACK_CROP_PAIRS;
    }
    
    return data;
  } catch (err) {
    console.error('Database query crashed, using fallback data:', err);
    return FALLBACK_CROP_PAIRS;
  }
};

/**
 * Filter and rank crop pairs based on farm parameters
 * @param {object} params - { soil, water, region, season }
 * @returns {Promise<Array>} Ranked crop pairs with suitability scores
 */
const getRankedCropPairs = async ({ soil, water, region, season }) => {
  const cropPairs = await getCropPairsFromDB();
  
  const scoredCrops = cropPairs.map(crop => {
    let matchScore = 0;
    
    // 1. Soil Type Match (+30 pts)
    if (soil && Array.isArray(crop.suitable_soil)) {
      const match = crop.suitable_soil.some(s => s.toLowerCase() === soil.toLowerCase());
      if (match) matchScore += 30;
    }
    
    // 2. Water Requirement Match (+25 pts if sufficient, +10 pts if adjacent and crop requires more)
    if (water && crop.water_requirement) {
      const cropReq = crop.water_requirement.toLowerCase();
      const userAvail = water.toLowerCase();
      
      if (cropReq === userAvail || isWaterSufficient(cropReq, userAvail)) {
        matchScore += 25; // Full compatibility points
      } else if (areWaterLevelsAdjacent(cropReq, userAvail)) {
        matchScore += 10; // Stress compatibility (crop needs slightly more than available)
      }
    }
    
    // 3. Region Match (+25 pts)
    if (region && Array.isArray(crop.regions)) {
      const match = crop.regions.some(r => r.toLowerCase() === region.toLowerCase());
      if (match) matchScore += 25;
    }
    
    // 4. Season Match (+20 pts)
    if (season && Array.isArray(crop.seasons)) {
      const match = crop.seasons.some(s => s.toLowerCase() === season.toLowerCase());
      if (match) matchScore += 20;
    }
    
    // 5. Risk Penalty (-risk_level * 0.1)
    if (typeof crop.risk_level === 'number') {
      matchScore -= (crop.risk_level * 0.1);
    }
    
    return {
      ...crop,
      match_score: parseFloat(matchScore.toFixed(2))
    };
  });
  
  return scoredCrops.sort((a, b) => b.match_score - a.match_score);
};

module.exports = {
  getRankedCropPairs,
  FALLBACK_CROP_PAIRS
};
