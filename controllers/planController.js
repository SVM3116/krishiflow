const { supabase } = require('../services/supabaseClient');
const responseUtils = require('../utils/responseUtils');

/**
 * Helper to validate UUID format
 */
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Handle GET /api/plans requests (List plan summaries)
 */
const getPlans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('farm_plans')
      .select('id, farm_name, location, state, area_acres, season, annual_income, total_score, stability_score, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching plans from Supabase:', error.message);
      // Fallback: return empty array so the frontend doesn't crash, it just displays an empty list
      return responseUtils.success(res, [], 'No saved plans could be retrieved (Database connection not configured).');
    }

    return responseUtils.success(res, data || [], 'Saved plans retrieved successfully.');
  } catch (error) {
    console.error('Crash in planController.getPlans:', error);
    return responseUtils.success(res, [], 'No saved plans could be retrieved.');
  }
};

/**
 * Handle GET /api/plans/:planId requests (Get complete plan details)
 */
const getPlanById = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      return responseUtils.error(res, 'planId path parameter is required.', 400);
    }

    // Return 400 immediately if parameter is not a valid UUID format to avoid DB queries throwing error
    if (!isValidUUID(planId)) {
      return responseUtils.error(res, 'Invalid plan ID format. Must be a valid UUID.', 400);
    }

    const { data, error } = await supabase
      .from('farm_plans')
      .select('*')
      .eq('id', planId)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      console.error(`Error fetching plan ${planId} from Supabase:`, error.message);
      return responseUtils.error(res, `Farming plan with ID ${planId} was not found.`, 404);
    }

    // Remap score fields to match the frontend contract if needed
    const responsePayload = {
      plan_id: data.id,
      farm_name: data.farm_name,
      location: data.location,
      state: data.state,
      area_acres: parseFloat(data.area_acres),
      season: data.season,
      zones: (data.zones || []).map((z, idx) => {
        const letter = ["A", "B", "C", "D", "E", "F"][idx] || "A";
        
        let seasonsMapped = {};
        if (z.seasons) {
          Object.keys(z.seasons).forEach(seasonKey => {
            const s = z.seasons[seasonKey];
            seasonsMapped[seasonKey] = {
              cropPair: s.cropPair || [s.crop, "Companion"],
              plantingMonth: (s.plantingMonth || s.sowMonth || "June").slice(0, 3),
              harvestMonths: (s.harvestMonths || [s.harvestMonth || "October"]).map(m => m.slice(0, 3)),
              expectedIncome: s.expectedIncome || s.netProfit || 0,
              expectedRevenue: s.expectedRevenue || s.grossRevenue || 0,
              expectedExpense: s.expectedExpense || s.inputCost || s.expenses || 0
            };
          });
        } else {
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
          ...z,
          id: letter,
          name: z.name || `Zone ${letter}`,
          area: z.area_acres || z.areaAcres || (parseFloat(data.area_acres) / (data.zones || []).length),
          area_acres: z.area_acres || z.areaAcres || (parseFloat(data.area_acres) / (data.zones || []).length),
          color: z.color || ["primary", "success", "accent"][idx % 3] || "primary",
          seasons: seasonsMapped
        };
      }),
      income_calendar: data.income_calendar,
      annual_income: data.annual_income,
      num_income_months: data.num_income_months,
      scores: {
        total_score: parseFloat(data.total_score),
        stability_score: parseFloat(data.stability_score),
        sustainability_score: parseFloat(data.sustainability_score),
        biodiversity_score: parseFloat(data.biodiversity_score),
        risk_score: parseFloat(data.risk_score),
        profit_score: parseFloat(data.total_score) // Profit score isn't stored separately, but we calculate it or return total
      },
      traditional_wisdom: data.traditional_wisdom,
      created_at: data.created_at
    };

    return responseUtils.success(res, responsePayload, 'Farming plan details retrieved successfully.');
  } catch (error) {
    console.error(`Crash in planController.getPlanById for ${req.params.planId}:`, error);
    return responseUtils.error(res, 'Internal server error while searching for farming plan.', 500);
  }
};

/**
 * Handle GET /api/income-calendar/:planId requests (Get calendar summary only)
 */
const getIncomeCalendar = async (req, res) => {
  try {
    const { planId } = req.params;

    if (!planId) {
      return responseUtils.error(res, 'planId path parameter is required.', 400);
    }

    if (!isValidUUID(planId)) {
      return responseUtils.error(res, 'Invalid plan ID format. Must be a valid UUID.', 400);
    }

    const { data, error } = await supabase
      .from('farm_plans')
      .select('income_calendar, annual_income, num_income_months')
      .eq('id', planId)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      console.error(`Error fetching calendar for ${planId} from Supabase:`, error.message);
      return responseUtils.error(res, `Farming calendar with plan ID ${planId} was not found.`, 404);
    }

    return responseUtils.success(res, {
      income_calendar: data.income_calendar,
      annual_income: data.annual_income,
      num_income_months: data.num_income_months
    }, 'Income calendar retrieved successfully.');
  } catch (error) {
    console.error(`Crash in planController.getIncomeCalendar for ${req.params.planId}:`, error);
    return responseUtils.error(res, 'Internal server error while searching for farming calendar.', 500);
  }
};

module.exports = {
  getPlans,
  getPlanById,
  getIncomeCalendar
};
