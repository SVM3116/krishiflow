import type { FarmPlan } from "./krishi-types";
import { supabase } from "./supabase";

const KEY = "krishiflow.plans.v1";
const CURRENT = "krishiflow.current.v1";

function isBrowser() { return typeof window !== "undefined"; }

export function listPlans(): FarmPlan[] {
  if (!isBrowser()) return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function savePlan(plan: FarmPlan) {
  if (!isBrowser()) return;

  const saveLocalAndRemote = (userId: string | null) => {
    const planToSave = { ...plan };
    if (userId) {
      planToSave.user_id = userId;
    }

    // Save to local storage
    const plans = listPlans().filter(p => p.id !== plan.id);
    plans.unshift(planToSave);
    localStorage.setItem(KEY, JSON.stringify(plans.slice(0, 50)));

    // Save to Supabase
    if (supabase) {
      const row: Record<string, any> = {
        id: plan.id,
        created_at: plan.createdAt || new Date().toISOString(),
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
          (plan.scores.incomeStability +
            plan.scores.sustainability +
            plan.scores.biodiversity +
            plan.scores.riskMitigation) /
            4
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

export function setCurrentPlan(plan: FarmPlan) {
  if (!isBrowser()) return;
  localStorage.setItem(CURRENT, JSON.stringify(plan));
}

export function getCurrentPlan(): FarmPlan | null {
  if (!isBrowser()) return null;
  try { const v = localStorage.getItem(CURRENT); return v ? JSON.parse(v) : null; } catch { return null; }
}

export function getPlan(id: string): FarmPlan | null {
  if (!id) return null;
  const local = listPlans().find(p => p.id === id);
  if (local) return local;
  const current = getCurrentPlan();
  if (current && current.id === id) return current;
  return null;
}

export function deletePlan(id: string): Promise<boolean> {
  if (!isBrowser()) return Promise.resolve(false);
  try {
    // 1. Remove from local storage list
    const plans = listPlans().filter(p => p.id !== id);
    localStorage.setItem(KEY, JSON.stringify(plans));

    // 2. Clear current plan if it matches
    const current = getCurrentPlan();
    if (current && current.id === id) {
      localStorage.removeItem(CURRENT);
    }

    // 3. Remove from Supabase if connected
    if (supabase) {
      return supabase
        .from("farm_plans")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) {
            console.error("Error deleting plan from Supabase:", error);
            return false;
          }
          return true;
        })
        .catch(() => false);
    }
    return Promise.resolve(true);
  } catch (err) {
    console.error("Error deleting plan:", err);
    return Promise.resolve(false);
  }
}