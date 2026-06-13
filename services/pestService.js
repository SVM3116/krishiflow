const { supabase } = require('./supabaseClient');
const LOCAL_PEST_RULES = require('../data/pestRules');

/**
 * Fetch pest rules from database, falling back to local dataset on failure
 */
const getPestRulesFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('pest_rules')
      .select('*');
      
    if (error) {
      console.error('Error fetching pest rules from database, using local fallback:', error.message);
      return LOCAL_PEST_RULES;
    }
    
    if (!data || data.length === 0) {
      console.warn('pest_rules table is empty, using local fallback.');
      return LOCAL_PEST_RULES;
    }
    
    return data;
  } catch (err) {
    console.error('Pest rules database query crashed, using local fallback:', err);
    return LOCAL_PEST_RULES;
  }
};

/**
 * Match crop and symptoms to diagnose pests and suggest remedies
 * @param {object} params - { cropName, symptoms }
 * @returns {Promise<object>} Diagnosis details
 */
const detectPest = async ({ cropName, symptoms }) => {
  const allRules = await getPestRulesFromDB();
  
  if (!cropName || !symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    throw new Error('Invalid request parameters. crop_name and symptoms array are required.');
  }

  const cleanCrop = cropName.toLowerCase().trim();

  // 1. Filter rules matching the crop (case-insensitive match on crop_name or crop_keywords array)
  const cropRules = allRules.filter(rule => {
    const nameMatch = rule.crop_name.toLowerCase() === cleanCrop || rule.crop_name.toLowerCase() === 'general';
    const keywordsMatch = Array.isArray(rule.crop_keywords) && 
      rule.crop_keywords.some(k => k.toLowerCase() === cleanCrop);
    return nameMatch || keywordsMatch;
  });

  if (cropRules.length === 0) {
    // If no rules for specific crop, fallback to general rules
    const generalRules = allRules.filter(rule => rule.crop_name.toLowerCase() === 'general');
    if (generalRules.length === 0) {
      return makeDefaultResponse(cropName, symptoms);
    }
    return runSymptomMatching(cropName, symptoms, generalRules);
  }

  return runSymptomMatching(cropName, symptoms, cropRules);
};

/**
 * Run fuzzy keyword matching algorithm on rules
 */
const runSymptomMatching = (cropName, symptoms, rules) => {
  const scoredMatches = rules.map(rule => {
    let matchedCount = 0;
    
    rule.symptom_keywords.forEach(keyword => {
      const kw = keyword.toLowerCase().trim();
      // Check if this keyword is contained in any user symptom, or vice versa
      const isMatched = symptoms.some(userSymptom => {
        const us = userSymptom.toLowerCase().trim();
        return us.includes(kw) || kw.includes(us);
      });
      
      if (isMatched) {
        matchedCount++;
      }
    });

    const confidence = rule.symptom_keywords.length > 0
      ? (matchedCount / rule.symptom_keywords.length) * 100
      : 0;

    return {
      rule,
      confidence: parseFloat(confidence.toFixed(2))
    };
  });

  // Sort matches by confidence descending
  const sortedMatches = scoredMatches.sort((a, b) => b.confidence - a.confidence);
  const bestMatch = sortedMatches[0];

  // If best match confidence is below 30%, return default response
  if (!bestMatch || bestMatch.confidence < 30) {
    return makeDefaultResponse(cropName, symptoms);
  }

  // Determine confidence label
  let confidenceLabel = 'Possible Match';
  if (bestMatch.confidence > 80) {
    confidenceLabel = 'High Confidence Match';
  } else if (bestMatch.confidence > 60) {
    confidenceLabel = 'Likely Match';
  }

  const { rule, confidence } = bestMatch;

  return {
    crop_name: cropName,
    symptoms_provided: symptoms,
    pest_name: rule.pest_name,
    pest_type: rule.pest_type || 'unknown',
    severity: rule.severity || 'medium',
    confidence,
    confidence_label: confidenceLabel,
    description: rule.description,
    traditional_remedy: rule.traditional_remedy,
    chemical_option: rule.chemical_option || 'None recommended.',
    prevention_tips: rule.prevention_tips || 'Practice regular farm monitoring.',
    disclaimer: 'Disclaimer: This is an AI-assisted diagnostic match. We recommend obtaining an on-site confirmation from a qualified local agricultural extension officer before applying chemical treatments.'
  };
};

/**
 * Build the fallback advisory response when confidence is too low
 */
const makeDefaultResponse = (cropName, symptoms) => {
  return {
    crop_name: cropName,
    symptoms_provided: symptoms,
    pest_name: 'Undetermined Disease/Pest',
    pest_type: 'unknown',
    severity: 'low',
    confidence: 0,
    confidence_label: 'No Match Found',
    description: 'The symptoms described do not closely match a specific pest in our database.',
    traditional_remedy: 'We recommend consulting your local Krishi Vigyan Kendra (KVK) agricultural officer with a sample of the affected plant for accurate local diagnosis.',
    chemical_option: 'Avoid applying general chemical sprays without positive identification, as it may kill beneficial insects and worsen infestations.',
    prevention_tips: 'Keep the field clear of weed hosts and dispose of affected plant material immediately to prevent spread.',
    disclaimer: 'Disclaimer: On-site inspection by an agronomist is recommended for confirmation.'
  };
};

module.exports = {
  detectPest
};
