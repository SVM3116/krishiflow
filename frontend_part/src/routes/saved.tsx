import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listPlans, deletePlan } from "../lib/krishi-storage";
import { supabase } from "../lib/supabase";
import type { FarmPlan } from "../lib/krishi-types";
import { Sprout, Calendar, MapPin, ArrowRight, Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved plans — KrishiFlow Insights" }] }),
  component: SavedPage,
});

function SavedPage() {
  const [plans, setPlans] = useState<FarmPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        nav({ to: "/login", search: { redirect: window.location.pathname } });
        return;
      }

      // Load local plans first, strictly filtered to only show plans matching the logged-in user
      const localPlans = listPlans().filter(p => p.user_id === session.user.id);
      setPlans(localPlans);

      supabase
        .from("farm_plans")
        .select("plan_data")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50)
        .then(({ data, error }) => {
          setLoading(false);
          if (error) {
            console.error("Error fetching plans from Supabase:", error);
            return;
          }
          if (data) {
            const remotePlans = data
              .map(d => d.plan_data as any as FarmPlan)
              .filter(Boolean);
            
            // Set plans strictly to remote plans (active database records for this user)
            setPlans(remotePlans);
          }
        })
        .catch(() => setLoading(false));
    });
  }, []);

  const handleDeletePlan = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      const success = await deletePlan(id);
      if (success) {
        setPlans(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete plan. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm font-semibold">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Workspace</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mt-1">Saved plans</h1>
          <p className="text-sm text-muted-foreground mt-1">{plans.length} {plans.length === 1 ? "plan" : "plans"} saved in your library</p>
        </div>
        <Link to="/analyze" className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow">
          + Create plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center shadow-soft">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary mb-4">
            <Sprout className="h-6 w-6" />
          </div>
          <p className="font-display font-bold text-foreground text-lg">No saved plans yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create your first optimization plan to see it here.</p>
          <Link to="/analyze" className="inline-flex items-center gap-1.5 mt-5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow">
            Analyze my farm <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.id} onClick={() => nav({ to: "/results", search: { id: p.id } })}
              className="group rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5 cursor-pointer relative">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">{p.input?.farmName || "Unnamed Farm"}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>{p.input?.district || "Unknown"}, {p.input?.state || ""}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block rounded-full bg-success/10 text-success text-[10px] font-bold px-2.5 py-0.5 shrink-0 border border-success/25">
                    {p.scores?.incomeStability || p.scores?.total_score || 0} Score
                  </span>
                  <button 
                    onClick={(e) => handleDeletePlan(e, p.id)}
                    className="h-7 w-7 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 grid place-items-center transition-all cursor-pointer shadow-sm shrink-0"
                    title="Delete this plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-1.5">
                {(p.zones || []).map(z => {
                  const cropName = z.seasons
                    ? (z.seasons.kharif?.cropPair?.[0] || "Unknown")
                    : (z.cropPair?.[0] || z.cropPair || "Unknown");
                  return (
                    <div key={z.id} className="rounded-lg bg-muted px-2 py-1.5 text-center">
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">{z.name}</p>
                      <p className="text-[10px] font-semibold text-foreground truncate">{cropName}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Est. Annual Revenue</span>
                <span className="font-display font-bold text-primary text-sm">₹{((p.totals?.annualRevenue || 0)/1000).toFixed(0)}k</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

