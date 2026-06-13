const crypto = require('crypto');
const farmAnalysisService = require('../services/farmAnalysisService');
const { supabase } = require('../services/supabaseClient');
const responseUtils = require('../utils/responseUtils');

/**
 * Maps the backend's rich analysis output into the exact FarmPlan JSON structure expected by the React frontend.
 * This ensures the frontend's Recharts graphs, Sowing Maps, Timelines, and scorecards load perfectly.
 */
const mapToFrontendPlan = (analysis, planId, createdAt) => {
  const shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const fullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  const dateObj = new Date(createdAt);
  const startMonthIdx = dateObj.getMonth(); // 0 for Jan, 5 for Jun, etc.

  // Rotate shortMonths and fullMonths so they start from the registration month
  const orderedShortMonths = [];
  const orderedFullMonths = [];
  for (let i = 0; i < 12; i++) {
    const idx = (startMonthIdx + i) % 12;
    orderedShortMonths.push(shortMonths[idx]);
    orderedFullMonths.push(fullMonths[idx]);
  }

  // Map zones to frontend schema
  const mappedZones = analysis.zones.map((z, idx) => {
    const letters = ["A", "B", "C", "D", "E", "F"];
    const letter = letters[idx] || "A";
    const colors = { A: "primary", B: "success", C: "accent", D: "primary", E: "success", F: "accent" };

    let seasonsMapped = {};
    if (z.seasons) {
      // Belagavi NTZ nested case
      Object.keys(z.seasons).forEach(seasonKey => {
        const s = z.seasons[seasonKey];
        seasonsMapped[seasonKey] = {
          cropPair: s.cropPair,
          plantingMonth: s.plantingMonth.slice(0, 3),
          harvestMonths: s.harvestMonths.map(m => m.slice(0, 3)),
          expectedIncome: s.expectedIncome
        };
      });
    } else {
      // Fallback flat case: construct seasons from the flat properties of old/standard layout
      const cropPair = [z.primary_crop || "Crop", z.companion_crop || "Companion"];
      const plantShort = (z.planting_month || "June").slice(0, 3);
      const harvestShort = (z.harvest_month || "October").slice(0, 3);
      const income = z.expected_profit || 0;

      seasonsMapped = {
        kharif: { cropPair, plantingMonth: plantShort, harvestMonths: [harvestShort], expectedIncome: income },
        rabi: { cropPair: ["Chickpea", "Wheat Border"], plantingMonth: "Nov", harvestMonths: ["Jan"], expectedIncome: Math.round(income * 0.6) },
        zaid: { cropPair: ["Fodder Cowpea", "Organic Mulch"], plantingMonth: "Mar", harvestMonths: ["May"], expectedIncome: Math.round(income * 0.2) }
      };
    }

    return {
      id: letter,
      name: z.name || `Zone ${letter}`,
      area: z.area_acres || z.areaAcres || 0.33,
      color: colors[letter] || "primary",
      seasons: seasonsMapped
    };
  });

  // Calculate traditional monoculture comparison for Recharts graph comparison
  // Traditional puts 85% of income in November and 15% in December (monoculture harvest)
  const traditionalTotal = analysis.annual_income * 0.7;
  const monthly = orderedShortMonths.map((m, idx) => {
    const fullMonthName = orderedFullMonths[idx];
    const calendarMonth = analysis.income_calendar.find(cm => cm.month === fullMonthName);
    const krishiflowIncome = calendarMonth ? calendarMonth.income : 0;
    
    let traditionalIncome = 0;
    if (m === "Nov") {
      traditionalIncome = Math.round(traditionalTotal * 0.85);
    } else if (m === "Dec") {
      traditionalIncome = Math.round(traditionalTotal * 0.15);
    }
    
    return {
      month: m,
      traditional: traditionalIncome,
      krishiflow: krishiflowIncome,
      revenue: calendarMonth ? calendarMonth.revenue : 0,
      expenses: calendarMonth ? calendarMonth.expenses : 0,
      zoneBreakdown: calendarMonth ? calendarMonth.zoneBreakdown : {
        "Zone A": { revenue: 0, expenses: 0, netProfit: 0 },
        "Zone B": { revenue: 0, expenses: 0, netProfit: 0 },
        "Zone C": { revenue: 0, expenses: 0, netProfit: 0 }
      }
    };
  });

  // Map crop recommendations for details and wisdom sections
  const seenCrops = new Set();
  const recommendations = [];
  
  analysis.zones.forEach(z => {
    const cropsToProcess = [];
    if (z.seasons) {
      Object.keys(z.seasons).forEach(sKey => {
        const s = z.seasons[sKey];
        cropsToProcess.push({
          primary: s.cropPair[0],
          companion: s.cropPair[1],
          why: s.benefits ? s.benefits[0] : 'Complementary crop pairing optimized for Belagavi Northern Transitional Zone.',
          wisdom: s.traditional_wisdom || 'Traditional heritage practice native to northern Karnataka.'
        });
      });
    } else {
      cropsToProcess.push({
        primary: z.primary_crop || "Crop",
        companion: z.companion_crop || "Companion",
        why: z.benefits ? z.benefits[0] : 'Complementary crop pairing for Belagavi Transitional Zone.',
        wisdom: z.traditional_wisdom || 'Traditional heritage practice native to northern Karnataka.'
      });
    }

    cropsToProcess.forEach(crop => {
      const cropKey = `${crop.primary}_${crop.companion}`;
      if (!seenCrops.has(cropKey)) {
        seenCrops.add(cropKey);
        
        const cropYields = {
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
        };
        
        const cropPrices = {
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
        };
        
        const keyStr = crop.primary.toLowerCase().replace(/[^a-z]/g, "") + "_" + crop.companion.toLowerCase().replace(/[^a-z]/g, "");
        const matchedKey = Object.keys(cropYields).find(k => keyStr.includes(k) || k.includes(keyStr)) || "jowar_pigeon_pea";
        
        recommendations.push({
          crop: crop.primary,
          partner: crop.companion,
          why: crop.why || 'Complementary crop pairing for Belagavi Transitional Zone.',
          traditionalWisdom: crop.wisdom || 'Traditional heritage practice native to northern Karnataka.',
          yieldPerAcre: cropYields[matchedKey] || "Varies by zone.",
          marketPrice: cropPrices[matchedKey] || "Varies by zone."
        });
      }
    });
  });

  // Build timeline items chronologically.
  // Rule: the farm starts EMPTY on the plan-start date.
  //   - A season is "future" if its sow month appears at position > 0 in the rotated calendar
  //     (position 0 = this month, which is a valid starting point).
  //   - Skip the sow entry for any season whose harvestIdx <= sowIdx
  //     (harvest falls in the same month as sow OR before sow — impossible for a freshly planted crop).
  //   - Only push the harvest entry when harvestIdx > sowIdx (strictly later).
  const timeline = [];
  analysis.zones.forEach((z, zIdx) => {
    const zoneEvents = [];
    const zoneName = z.name || `Zone ${["A", "B", "C", "D", "E", "F"][zIdx] || "A"}`;

    if (z.seasons) {
      Object.keys(z.seasons).forEach(sKey => {
        const s = z.seasons[sKey];
        const shortPlant   = s.plantingMonth.slice(0, 3);
        const shortHarvest = s.harvestMonths[0].slice(0, 3);

        const sowIdx     = (shortMonths.indexOf(shortPlant)   - startMonthIdx + 12) % 12;
        const harvestIdx = (shortMonths.indexOf(shortHarvest) - startMonthIdx + 12) % 12;

        if (harvestIdx <= sowIdx) return;

        zoneEvents.push({
          month: shortPlant,
          monthIdx: sowIdx,
          type: "sow",
          zone: zoneName,
          action: `Sow ${s.cropPair[0]} + ${s.cropPair[1]}`,
          detail: `Prepare soil rows, apply organic manure and seed treatments.`
        });

        zoneEvents.push({
          month: shortHarvest,
          monthIdx: harvestIdx,
          type: "harvest",
          zone: zoneName,
          action: `Harvest crops`,
          detail: `Harvest at maturity, sun-dry before packaging.`
        });
      });
    } else {
      const shortPlant   = (z.planting_month || 'Jun').slice(0, 3);
      const shortHarvest = (z.harvest_month  || 'Oct').slice(0, 3);

      const sowIdx     = (shortMonths.indexOf(shortPlant)   - startMonthIdx + 12) % 12;
      const harvestIdx = (shortMonths.indexOf(shortHarvest) - startMonthIdx + 12) % 12;

      if (harvestIdx <= sowIdx) return;

      zoneEvents.push({
        month: shortPlant,
        monthIdx: sowIdx,
        type: "sow",
        zone: zoneName,
        action: `Sow ${z.primary_crop} + ${z.companion_crop}`,
        detail: `Prepare soil rows, apply organic manure and seed treatments.`
      });

      zoneEvents.push({
        month: shortHarvest,
        monthIdx: harvestIdx,
        type: "harvest",
        zone: zoneName,
        action: `Harvest crops`,
        detail: `Harvest at maturity, sun-dry before packaging.`
      });
    }

    // Sort this zone's events chronologically by monthIdx
    zoneEvents.sort((a, b) => a.monthIdx - b.monthIdx);

    // Scan for gaps and push to timeline
    for (let i = 0; i < zoneEvents.length; i++) {
      const currentEvent = zoneEvents[i];
      timeline.push({
        month: currentEvent.month,
        zone: currentEvent.zone,
        action: currentEvent.action,
        detail: currentEvent.detail
      });

      const nextEvent = zoneEvents[(i + 1) % zoneEvents.length];
      if (currentEvent.type === "harvest" && nextEvent.type === "sow") {
        const gapMonths = (nextEvent.monthIdx - currentEvent.monthIdx + 12) % 12;
        if (gapMonths >= 2) {
          const coverSowIdx = (currentEvent.monthIdx + 1) % 12;
          const coverIncIdx = (nextEvent.monthIdx - 1 + 12) % 12;
          let detailText = `Broadcast Sunnhemp/Dhaincha seeds post-harvest to prevent weed growth, protect soil organic carbon, and fix nitrogen.`;

          if (coverIncIdx === coverSowIdx) {
            detailText += ` Plow back into soil before the next crop cycle.`;
          }

          timeline.push({
            month: shortMonths[(startMonthIdx + coverSowIdx) % 12],
            zone: zoneName,
            action: `Sow Green Manure (Sunnhemp/Dhaincha)`,
            detail: detailText
          });

          if (coverIncIdx !== coverSowIdx) {
            timeline.push({
              month: shortMonths[(startMonthIdx + coverIncIdx) % 12],
              zone: zoneName,
              action: `Incorporate Green Manure into soil`,
              detail: `Plow the green cover crop back into the soil to decompose, enriching it with organic matter and nitrogen.`
            });
          }
        }
      }
    }
  });

  
  // Sort timeline chronologically starting from registration month
  timeline.sort((a, b) => {
    const aIdx = (shortMonths.indexOf(a.month) - startMonthIdx + 12) % 12;
    const bIdx = (shortMonths.indexOf(b.month) - startMonthIdx + 12) % 12;
    return aIdx - bIdx;
  });

  // Build mock 5-day weather
  const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weatherIcons = { sunny: "☀️", rain: "🌦️", cloudy: "☁️" };
  const startDayIdx = new Date().getDay();
  const weather = [];
  
  for (let i = 0; i < 5; i++) {
    const dayName = shortDays[(startDayIdx + i) % 7];
    const cond = i === 2 ? "rain" : "sunny";
    weather.push({
      day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayName,
      temp: 27 + (i % 3),
      rain: i === 2 ? 12 : 0,
      icon: weatherIcons[cond],
      condition: cond === "rain" ? "Light rain" : "Sunny"
    });
  }

  // Final mapped structure
  return {
    id: planId,
    createdAt: createdAt || new Date().toISOString(),
    input: {
      farmName: analysis.farm_name,
      landArea: parseFloat(analysis.area_acres),
      district: analysis.location.charAt(0).toUpperCase() + analysis.location.slice(1),
      state: analysis.state,
      soilType: analysis.soil_type.charAt(0).toUpperCase() + analysis.soil_type.slice(1),
      water: analysis.water_level.charAt(0).toUpperCase() + analysis.water_level.slice(1),
      season: analysis.season.charAt(0).toUpperCase() + analysis.season.slice(1),
      budget: analysis.budget || 50000
    },
    zones: mappedZones,
    monthly: monthly,
    recommendations: recommendations,
    scores: {
      incomeStability: Math.round(analysis.scores.stability_score),
      sustainability: Math.round(analysis.scores.sustainability_score),
      biodiversity: Math.round(analysis.scores.biodiversity_score),
      riskMitigation: Math.round(analysis.scores.risk_score)
    },
    weather: weather,
    advisory: "Favorable conditions for agricultural operations. Ensure staggered schedules are monitored.",
    timeline: timeline,
    totals: {
      annualRevenue: analysis.zones.reduce((sum, z) => {
        if (z.seasons) {
          const zoneRev = Object.values(z.seasons).reduce((s, season) => s + (season.expectedRevenue || 0), 0);
          return sum + zoneRev;
        }
        return sum + (z.expected_revenue || 0);
      }, 0),
      netProfit: analysis.annual_income,
      activeMonths: analysis.num_income_months
    }
  };
};

/**
 * Handle POST /api/analyze-farm and POST /api/analyze requests
 */
const analyzeFarm = async (req, res) => {
  try {
    const {
      farm_name,
      location,
      state,
      area_acres,
      soil_type,
      water_level,
      budget,
      season,
      // Handle frontend camelCase naming if passed directly
      farmName,
      landArea,
      district,
      soilType,
      water
    } = req.body;

    // Resolve naming differences between backend and frontend
    const resolvedFarmName = farm_name || farmName || 'My Farm';
    const resolvedLocation = location || district || 'belagavi';
    const resolvedState = state || 'Karnataka';
    const resolvedArea = area_acres || landArea;
    const resolvedSoil = soil_type || soilType;
    const resolvedWater = water_level || water;
    const resolvedSeason = season || 'kharif';

    // 1. Validate Required Fields
    if (!resolvedLocation || !resolvedState || !resolvedArea || !resolvedSoil || !resolvedWater || !resolvedSeason) {
      return responseUtils.error(
        res,
        'Missing required fields: location, state, area, soil, water, and season are required.',
        400
      );
    }

    const numArea = parseFloat(resolvedArea);
    if (isNaN(numArea) || numArea <= 0) {
      return responseUtils.error(res, 'Area must be a positive number.', 400);
    }

    // 2. Execute Farm Analysis Algorithm
    const analysis = await farmAnalysisService.generateFarmPlan({
      farm_name: resolvedFarmName,
      location: resolvedLocation,
      state: resolvedState,
      area_acres: numArea,
      soil_type: resolvedSoil,
      water_level: resolvedWater,
      budget: budget || 50000,
      season: resolvedSeason
    });

    // 3. Map to frontend expected FarmPlan JSON format
    const planId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const frontendPlan = mapToFrontendPlan(analysis, planId, createdAt);

    // 3.5 Optional Authentication: Link generated plan to user if authenticated
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token) {
          const { data: { user }, error: authError } = await supabase.auth.getUser(token);
          if (!authError && user) {
            userId = user.id;
          }
        }
      }
    } catch (authErr) {
      console.warn('Optional auth check failed in farmController:', authErr.message || authErr);
    }

    // 4. Persist to Supabase Database
    let savedPlan = null;
    try {
      // Create unified database record supporting both frontend and backend fields
      const dbRecord = {
        id: planId,
        user_id: userId,
        created_at: createdAt,
        farm_name: resolvedFarmName,
        land_area: numArea,
        district: resolvedLocation,
        state: resolvedState,
        soil_type: resolvedSoil,
        water_availability: resolvedWater,
        season: resolvedSeason,
        budget: budget || 50000,
        plan_data: {
          ...frontendPlan,
          user_id: userId
        }, // JSONB structure read by frontend
        
        // Backend specific metric columns
        location: resolvedLocation.toLowerCase(),
        area_acres: numArea,
        water_level: resolvedWater.toLowerCase(),
        zones: analysis.zones,
        income_calendar: analysis.income_calendar,
        annual_income: analysis.annual_income,
        num_income_months: analysis.num_income_months,
        stability_score: analysis.scores.stability_score,
        sustainability_score: analysis.scores.sustainability_score,
        biodiversity_score: analysis.scores.biodiversity_score,
        risk_score: analysis.scores.risk_score,
        total_score: analysis.scores.total_score,
        traditional_wisdom: analysis.traditional_wisdom
      };

      const { data, error } = await supabase
        .from('farm_plans')
        .insert(dbRecord)
        .select()
        .single();

      if (error) {
        console.error('Failed to save plan to Supabase, fallback to returning in-memory plan:', error.message);
      } else {
        savedPlan = data;
      }
    } catch (dbErr) {
      console.error('Database insertion crashed, using in-memory plan:', dbErr.message || dbErr);
    }

    // 5. Construct response containing BOTH backend contract and frontend FarmPlan fields merged
    const responsePayload = {
      ...frontendPlan, // All frontend expected fields (id, createdAt, input, zones, monthly, totals, scores, recommendations, weather, advisory, timeline)
      plan_id: planId, // Backend expected field
      farm_name: resolvedFarmName,
      location: resolvedLocation.toLowerCase(),
      state: resolvedState,
      area_acres: numArea,
      zones: frontendPlan.zones.map((fz, idx) => {
        const bz = analysis.zones[idx] || {};
        return {
          ...bz,
          ...fz,
          area: fz.area || bz.area_acres || bz.areaAcres || (numArea / frontendPlan.zones.length),
          area_acres: bz.area_acres || bz.areaAcres || fz.area || (numArea / frontendPlan.zones.length)
        };
      }),
      income_calendar: analysis.income_calendar,
      annual_income: analysis.annual_income,
      num_income_months: analysis.num_income_months,
      scores: {
        ...frontendPlan.scores,
        total_score: analysis.scores.total_score,
        stability_score: analysis.scores.stability_score,
        sustainability_score: analysis.scores.sustainability_score,
        biodiversity_score: analysis.scores.biodiversity_score,
        risk_score: analysis.scores.risk_score,
        profit_score: analysis.scores.profit_score
      },
      traditional_wisdom: analysis.traditional_wisdom,
      created_at: createdAt
    };

    return res.status(201).json({
      ...responsePayload,
      success: true,
      data: responsePayload
    });
  } catch (error) {
    console.error('Error in farmController.analyzeFarm:', error);
    return responseUtils.error(res, error.message || 'Failed to analyze farm details. Internal Server Error.', 500);
  }
};

module.exports = {
  analyzeFarm
};
