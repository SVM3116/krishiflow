const PEST_RULES = [
  // Tomato Pests
  {
    crop_name: 'Tomato',
    crop_keywords: ['tomato', 'tomatoes'],
    symptom_keywords: ['yellowing', 'sticky', 'honeydew', 'small insects', 'curling', 'leaves yellowing'],
    pest_name: 'Aphids',
    pest_type: 'insect',
    severity: 'medium',
    description: 'Small, soft-bodied insects that suck sap from tomato leaves and stems, secreting a sticky substance called honeydew which attracts sooty mold.',
    traditional_remedy: 'Spray a diluted neem oil solution (1-2% concentration) with a few drops of liquid dish soap. Apply early in the morning every 3 days until controlled.',
    chemical_option: 'Spray systemic insecticides like imidacloprid (0.5 ml/L) or thiamethoxam (0.2 g/L).',
    prevention_tips: 'Avoid excessive application of nitrogen fertilizers which promotes tender, aphid-attracting leaf growth. Encourage ladybugs and lacewings.'
  },
  {
    crop_name: 'Tomato',
    crop_keywords: ['tomato', 'tomatoes'],
    symptom_keywords: ['holes in fruit', 'caterpillar', 'damaged tomato', 'bore', 'fruit damage'],
    pest_name: 'Tomato Fruit Borer (Helicoverpa)',
    pest_type: 'insect',
    severity: 'high',
    description: 'A destructive caterpillar that bores into tomato fruits, making them unfit for consumption and creating access for bacterial rot.',
    traditional_remedy: 'Hand-pick larvae in small farms. Spray neem seed kernel extract (NSKE 5%) or Bacillus thuringiensis (Bt) formulation during early larval stages.',
    chemical_option: 'Apply newer generation insecticides like spinosad (0.3 ml/L) or chlorantraniliprole (0.3 ml/L) under high infestation.',
    prevention_tips: 'Plant Marigold borders (1 row of marigold for every 10 rows of tomato) as a trap crop. Set up pheromone traps to monitor adult moth activity.'
  },
  {
    crop_name: 'Tomato',
    crop_keywords: ['tomato', 'tomatoes'],
    symptom_keywords: ['white powder', 'white coating', 'dusty', 'fungal', 'powder on leaves'],
    pest_name: 'Powdery Mildew',
    pest_type: 'fungal',
    severity: 'medium',
    description: 'A fungal disease characterized by white, powdery patches appearing on the leaf surfaces, causing leaves to dry up and drop.',
    traditional_remedy: 'Spray diluted milk solution (1 part milk to 9 parts water) or spray potassium bicarbonate solution (3g/L) to alter leaf pH.',
    chemical_option: 'Apply wettable sulfur fungicide (2g/L) or hexaconazole (1 ml/L) at first sign of spots.',
    prevention_tips: 'Maintain proper plant spacing for air circulation. Avoid overhead watering to reduce foliage moisture.'
  },
  {
    crop_name: 'Tomato',
    crop_keywords: ['tomato', 'tomatoes'],
    symptom_keywords: ['brown spots', 'dark spots', 'yellow halo', 'wilting', 'blight', 'target spots'],
    pest_name: 'Early Blight (Alternaria)',
    pest_type: 'fungal',
    severity: 'high',
    description: 'A common fungal infection causing concentric "target-like" brown spots on older leaves, eventually leading to defoliation and yield loss.',
    traditional_remedy: 'Spray copper-based organic formulations or home-made Bordeaux mixture. Immediately prune and burn infected lower leaves.',
    chemical_option: 'Foliar spray of mancozeb (2g/L) or chlorothalonil (2g/L) on weekly intervals.',
    prevention_tips: 'Practice 3-year crop rotation (avoiding potatoes/peppers). Mulch the base of the tomato plants to prevent soil-borne spores from splashing onto leaves.'
  },

  // Jowar / Sorghum Pests
  {
    crop_name: 'Jowar',
    crop_keywords: ['jowar', 'sorghum', 'millet', 'millets'],
    symptom_keywords: ['stunted', 'yellowing', 'dead shoot', 'central shoot dead', 'early stage'],
    pest_name: 'Sorghum Shoot Fly',
    pest_type: 'insect',
    severity: 'high',
    description: 'A major pest in early stages of Sorghum growth. The maggot crawls down the leaf sheath and cuts the growing point, causing a characteristic "dead heart" symptom.',
    traditional_remedy: 'Sow crops early (within 7-10 days of monsoon onset) to avoid fly peaks. Dust the field with wood ash or spray neem seed kernel extract.',
    chemical_option: 'Seed treatment with imidacloprid or apply granular carbofuran (3G) in the soil whorl.',
    prevention_tips: 'Use fly-resistant sorghum cultivars. Increase seed rate slightly and remove/burn infected seedlings during thinning.'
  },
  {
    crop_name: 'Jowar',
    crop_keywords: ['jowar', 'sorghum', 'millet', 'millets'],
    symptom_keywords: ['holes in stem', 'dead heart', 'stem damage', 'bore hole', 'frass'],
    pest_name: 'Spotted Stem Borer',
    pest_type: 'insect',
    severity: 'high',
    description: 'Caterpillars bore into the stem, feeding internally, which weakens the stalk, reduces grain output, and causes late-stage dead hearts.',
    traditional_remedy: 'Insert Trichogramma chilonis egg cards (biocontrol cards). Remove and destroy dead hearts. Dust whorls with fine sand and neem oil mix.',
    chemical_option: 'Whorl application of chlorpyrifos granules (10G) or carbofuran (3G) at 2-3 kg per acre.',
    prevention_tips: 'Deep ploughing after harvest to expose hibernating larvae. Intercrop with cowpea or pigeon pea to reduce infestation rates.'
  },

  // Groundnut Pests
  {
    crop_name: 'Groundnut',
    crop_keywords: ['groundnut', 'peanut', 'groundnuts'],
    symptom_keywords: ['tunnels in leaves', 'mining', 'serpentine', 'leaf curling', 'yellowing trails'],
    pest_name: 'Groundnut Leaf Miner',
    pest_type: 'insect',
    severity: 'medium',
    description: 'Larvae mine inside the leaves creating white, serpentine tunnels. Leaves dry up, roll, and drop, reducing photosynthetic area.',
    traditional_remedy: 'Spray neem oil (2%) or NSKE (5%). Install light traps to attract and kill adult moths. Use silver-colored reflective mulches.',
    chemical_option: 'Spray dimethoate (30 EC) at 2 ml/L or monocrotophos (1.5 ml/L).',
    prevention_tips: 'Intercrop with pearl millet or cowpea. Avoid crop water stress which makes leaves brittle and more vulnerable.'
  },
  {
    crop_name: 'Groundnut',
    crop_keywords: ['groundnut', 'peanut', 'groundnuts'],
    symptom_keywords: ['brown spots', 'circular spots', 'leaf spot', 'tikka', 'defoliation'],
    pest_name: 'Tikka Leaf Spot (Cercospora)',
    pest_type: 'fungal',
    severity: 'high',
    description: 'A notorious fungal disease in Karnataka causing dark, circular spots on both leaf surfaces, leading to premature leaf drop and weak pods.',
    traditional_remedy: 'Foliar spray of garlic-bulb extract or cow-dung filtrate. Burn plant debris immediately after harvest.',
    chemical_option: 'Spray carbendazim (1g/L) or mancozeb (2g/L) as soon as early spots are spotted.',
    prevention_tips: 'Perform seed treatment with Trichoderma viride (4g/kg seed). Maintain crop rotation and remove self-sown groundnut plants.'
  },

  // Maize Pests
  {
    crop_name: 'Maize',
    crop_keywords: ['maize', 'corn'],
    symptom_keywords: ['ragged leaves', 'holes', 'frass', 'worm', 'armyworm', 'late whorl'],
    pest_name: 'Fall Armyworm (FAW)',
    pest_type: 'insect',
    severity: 'high',
    description: 'Highly invasive pest. Larvae feed deep inside the maize whorl, causing large, ragged feeding holes and leaving moist sawdust-like waste (frass).',
    traditional_remedy: 'Pour sand or dry wood ash mixed with neem powder (9:1 ratio) directly into the crop whorls. Encourage predatory birds by placing bird perches.',
    chemical_option: 'Spray chlorantraniliprole (18.5 SC) at 0.4 ml/L or spinetoram (11.7 SC) at 0.5 ml/L directly into the whorl.',
    prevention_tips: 'Sow early and uniformly. Monitor crop weekly from germination. Intercrop maize with non-hosts like pigeon pea or black gram.'
  },
  {
    crop_name: 'Maize',
    crop_keywords: ['maize', 'corn'],
    symptom_keywords: ['yellow streaks', 'streak', 'viral', 'stunted maize', 'chlorotic stripes'],
    pest_name: 'Maize Streak Virus',
    pest_type: 'viral',
    severity: 'high',
    description: 'A viral disease transmitted by leafhoppers. Causes thin, continuous, yellow-to-white streaks parallel to leaf veins, leading to severe stunting.',
    traditional_remedy: 'No cure exists for virus-infected plants. Pull out and burn infected plants immediately. Control the leafhopper vector using neem leaf extract.',
    chemical_option: 'Control the vector (Cicadulina leafhoppers) by spraying imidacloprid (0.3 ml/L) or thiamethoxam (0.25 g/L).',
    prevention_tips: 'Use virus-resistant maize seeds. Avoid planting maize near older, infected cereal crop fields.'
  },

  // General Pests (Applies to multiple crops)
  {
    crop_name: 'General',
    crop_keywords: ['tomato', 'cotton', 'chilli', 'vegetable', 'vegetables', 'chilli', 'onion'],
    symptom_keywords: ['white insects', 'tiny white', 'flying insects', 'sticky leaves', 'sooty mold', 'whiteflies'],
    pest_name: 'Whitefly',
    pest_type: 'insect',
    severity: 'medium',
    description: 'Tiny, sap-sucking insects that gather on leaf undersides, draining plant energy and acting as vectors for major plant viruses.',
    traditional_remedy: 'Install bright yellow sticky traps at crop canopy level. Spray starch-based solutions or neem oil (2%).',
    chemical_option: 'Spray imidacloprid (0.5 ml/L) or spiromesifen (1 ml/L) in case of severe outbreaks.',
    prevention_tips: 'Border fields with tall crops like maize or sorghum to block whitefly wind drift. Clear weed hosts around the farm.'
  },
  {
    crop_name: 'General',
    crop_keywords: ['tomato', 'cotton', 'chilli', 'beans', 'groundnut'],
    symptom_keywords: ['fine webbing', 'web', 'tiny red spots', 'stippling', 'mite', 'bronze leaves'],
    pest_name: 'Red Spider Mite',
    pest_type: 'insect',
    severity: 'medium',
    description: 'Microscopic arachnids that colonize leaf undersides, sucking cell contents and spinning fine protective webs, causing leaves to turn bronze.',
    traditional_remedy: 'Spray a strong jet of water to wash off webs and mites. Spray neem oil (2%) or wettable sulfur (3g/L) which acts as a mild miticide.',
    chemical_option: 'Apply specialized acaricides like abamectin (0.5 ml/L) or spiromesifen (0.8 ml/L).',
    prevention_tips: 'Ensure crops are not water-stressed, as dry and dusty conditions encourage rapid spider mite breeding cycles.'
  }
];

module.exports = PEST_RULES;
