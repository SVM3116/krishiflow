import { s as supabase } from "./router-DCDgEq5b.mjs";
const KEY = "krishiflow.plans.v1";
const CURRENT = "krishiflow.current.v1";
function isBrowser() {
  return typeof window !== "undefined";
}
function listPlans() {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function savePlan(plan) {
  if (!isBrowser()) return;
  const saveLocalAndRemote = (userId) => {
    const planToSave = { ...plan };
    if (userId) {
      planToSave.user_id = userId;
    }
    const plans = listPlans().filter((p) => p.id !== plan.id);
    plans.unshift(planToSave);
    localStorage.setItem(KEY, JSON.stringify(plans.slice(0, 50)));
    if (supabase) {
      const row = {
        id: plan.id,
        created_at: plan.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
        farm_name: plan.input.farmName,
        location: plan.input.district,
        state: plan.input.state,
        area_acres: plan.input.landArea,
        soil_type: plan.input.soilType,
        water_level: plan.input.water,
        budget: plan.input.budget,
        season: plan.input.season,
        zones: plan.zones,
        income_calendar: plan.monthly,
        annual_income: plan.totals.annualRevenue,
        num_income_months: plan.totals.activeMonths,
        stability_score: plan.scores.incomeStability,
        sustainability_score: plan.scores.sustainability,
        biodiversity_score: plan.scores.biodiversity,
        risk_score: plan.scores.riskMitigation,
        total_score: Math.round(
          (plan.scores.incomeStability + plan.scores.sustainability + plan.scores.biodiversity + plan.scores.riskMitigation) / 4
        ),
        traditional_wisdom: plan.recommendations?.[0]?.traditionalWisdom || null,
        plan_data: planToSave
      };
      if (userId) {
        row.user_id = userId;
      }
      supabase.from("farm_plans").upsert(row).then(({ error }) => {
        if (error) {
          console.error("Error saving plan to Supabase:", error);
        }
      });
    }
  };
  if (supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      saveLocalAndRemote(session ? session.user.id : null);
    }).catch(() => {
      saveLocalAndRemote(null);
    });
  } else {
    saveLocalAndRemote(null);
  }
}
function setCurrentPlan(plan) {
  if (!isBrowser()) return;
  localStorage.setItem(CURRENT, JSON.stringify(plan));
}
function getCurrentPlan() {
  if (!isBrowser()) return null;
  try {
    const v = localStorage.getItem(CURRENT);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
function getPlan(id) {
  if (!id) return null;
  const local = listPlans().find((p) => p.id === id);
  if (local) return local;
  const current = getCurrentPlan();
  if (current && current.id === id) return current;
  return null;
}
function deletePlan(id) {
  if (!isBrowser()) return Promise.resolve(false);
  try {
    const plans = listPlans().filter((p) => p.id !== id);
    localStorage.setItem(KEY, JSON.stringify(plans));
    const current = getCurrentPlan();
    if (current && current.id === id) {
      localStorage.removeItem(CURRENT);
    }
    if (supabase) {
      return supabase.from("farm_plans").delete().eq("id", id).then(({ error }) => {
        if (error) {
          console.error("Error deleting plan from Supabase:", error);
          return false;
        }
        return true;
      }).catch(() => false);
    }
    return Promise.resolve(true);
  } catch (err) {
    console.error("Error deleting plan:", err);
    return Promise.resolve(false);
  }
}
export {
  setCurrentPlan as a,
  deletePlan as d,
  getPlan as g,
  listPlans as l,
  savePlan as s
};
