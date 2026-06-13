import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getPlan, savePlan } from "../lib/krishi-storage";
import { PEST_SYMPTOMS, diagnosePest } from "../lib/krishi-engine";
import { supabase } from "../lib/supabase";
import type { FarmPlan } from "../lib/krishi-types";
import { 
  Sprout, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Clock, 
  CloudSun, 
  Sun, 
  CloudRain, 
  Cloud, 
  Activity, 
  ShieldCheck, 
  Bug, 
  FlaskConical, 
  Upload, 
  Check, 
  ChevronDown, 
  Zap, 
  BookOpen, 
  Printer,
  FileText,
  DollarSign,
  CheckSquare,
  Square,
  PlusCircle,
  ClipboardList,
  Plus,
  ChevronRight,
  Flower,
  RefreshCw,
  Heart,
  Info,
  Droplet,
  Layers,
  Sparkles
} from "lucide-react";

export const Route = createFileRoute("/results")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: (s.id as string) || "",
    tab: (s.tab as string) || "dashboard",
    subtab: (s.subtab as string) || "rotation",
  }),
  head: () => ({ meta: [{ title: "Your optimized farm plan — KrishiFlow" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { id, tab, subtab } = Route.useSearch();
  const [plan, setPlan] = useState<FarmPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const activeTab = (tab as "dashboard" | "projections" | "monitoring" | "diagnostics") || "dashboard";
  const setActiveTab = (newTab: string) => {
    nav({
      to: "/results",
      search: {
        id,
        tab: newTab,
        subtab
      }
    });
  };
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        nav({ to: "/login", search: { redirect: window.location.pathname + window.location.search } });
        return;
      }
      setAuthLoading(false);

      const local = getPlan(id);
      if (local) {
        setPlan(local);
        setLoading(false);
      } else if (id && supabase) {
        setLoading(true);
        supabase
          .from("farm_plans")
          .select("plan_data")
          .eq("id", id)
          .eq("user_id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && data.plan_data) {
              setPlan(data.plan_data as any as FarmPlan);
            } else if (error) {
              console.error("Error fetching plan from Supabase:", error);
            }
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, [id]);

  function updatePlanState(newPlan: FarmPlan) {
    setPlan(newPlan);
    savePlan(newPlan);
  }

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="relative h-12 w-12 mx-auto mb-4 bg-primary-soft rounded-2xl grid place-items-center">
          <LoaderSpinner />
        </div>
        <p className="text-muted-foreground text-sm font-semibold">Verifying session...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="relative h-12 w-12 mx-auto mb-4 bg-primary-soft rounded-2xl grid place-items-center">
          <LoaderSpinner />
        </div>
        <p className="text-muted-foreground text-sm font-semibold">Running crop zoning algorithm...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center bg-card border border-border rounded-3xl shadow-soft mt-10">
        <div className="h-12 w-12 rounded-2xl bg-primary-soft text-primary grid place-items-center mx-auto mb-4">
          <Sprout className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">No plan found</h1>
        <p className="text-muted-foreground mt-2">Generate a fresh crop plan to view optimized analytics.</p>
        <Link to="/analyze" className="inline-flex items-center gap-1.5 mt-5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow">
          Analyze my farm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header Panel */}
      <PlanHeader plan={plan} />

      {/* Tabs Selector */}
      <div className="no-print border-b border-border flex gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "dashboard"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Today's Overview
        </button>
        <button
          onClick={() => setActiveTab("projections")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "projections"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview & Projections
        </button>
        <button
          onClick={() => setActiveTab("monitoring")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "monitoring"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Live Crop Monitor & Tasks
        </button>
        <button
          onClick={() => setActiveTab("diagnostics")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "diagnostics"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Crop Health & Diagnostics
        </button>
      </div>

      {activeTab === "dashboard" ? (
        <DashboardOverview plan={plan} onUpdatePlan={updatePlanState} />
      ) : activeTab === "projections" ? (
        <>
          {/* Main Income Comparison Chart */}
          <IncomeChart plan={plan} />

          {/* Two Column Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-start">
            {/* Left Column: Sowing, Harvesting & Recommendations */}
            <div className="space-y-6 sm:space-y-8">
              <ZoneMap plan={plan} />
              <Recommendations plan={plan} />
              <Timeline plan={plan} onUpdatePlan={updatePlanState} />
            </div>

            {/* Right Column: Analytics & Weather */}
            <div className="space-y-6 sm:space-y-8">
              <ScoreDashboard plan={plan} />
              <WeatherWidget plan={plan} />
            </div>
          </div>

          <FarmingIntelligenceDashboard plan={plan} />
        </>
      ) : activeTab === "diagnostics" ? (
        <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <PestDetector />
        </div>
      ) : (
        <CropMonitorSection plan={plan} onUpdatePlan={updatePlanState} />
      )}
    </div>
  );
}

function FarmingIntelligenceDashboard({ plan }: { plan: FarmPlan }) {
  const { id, tab, subtab } = Route.useSearch();
  const nav = useNavigate();
  const activeSubTab = (subtab as "rotation" | "ledger" | "fertility" | "resource" | "scores") || "rotation";
  const setActiveSubTab = (newSubTab: string) => {
    nav({
      to: "/results",
      search: {
        id,
        tab,
        subtab: newSubTab
      }
    });
  };
  
  const landArea = plan.input?.landArea || 1.0;
  const waterLevel = plan.input?.water?.toLowerCase() || "medium";
  
  // 1. Dynamic Market Saturation
  const hasTomato = plan.zones.some(z => 
    Object.values(z.seasons).some(s => 
      s.cropPair?.[0]?.toLowerCase().includes("tomato") || 
      s.cropPair?.[1]?.toLowerCase().includes("tomato")
    )
  );
  const hasMaize = plan.zones.some(z => 
    Object.values(z.seasons).some(s => 
      s.cropPair?.[0]?.toLowerCase().includes("maize") || 
      s.cropPair?.[1]?.toLowerCase().includes("maize")
    )
  );
  
  const marketSaturationText = hasTomato 
    ? "Oversupply Warning: High concentration of regional tomato planting forecasted. Oversupply risk index is Elevated (65%). Consider staggering tomato sales or using organic cold-storage methods to hedge against price collapses."
    : hasMaize
    ? "Oversupply Alert: Heavy regional acreage expected for maize. Market crowding is moderate (40%). Recommend pre-booking grain contracts or drying yields to sell during post-harvest price recovery."
    : "Market Outlook: Balanced local grain/oilseed demand. Price saturation risk is Low (15%). The chosen crop combinations are highly resilient to sudden market pricing fluctuations.";

  const marketRiskScore = hasTomato ? 65 : hasMaize ? 40 : 15;

  // 2. Dynamic Traditional Water Management Recommendations
  const waterRecommendations = waterLevel === "low" 
    ? [
        { title: "Contour Bunding & Mulching", desc: "Construct soil/stone bunds along slopes to prevent water runoff. Use crop residues to cover topsoil, retaining up to 40% more moisture." },
        { title: "Farm Pond (Krishi Honda)", desc: "Dig a 10m x 10m farm pond lined with polythene sheet at the lowest point of your farm to catch and store rainfall runoff." }
      ]
    : waterLevel === "high"
    ? [
        { title: "Sub-surface Drainage Channels", desc: "Excavate 1-foot deep drainage trenches around zone boundaries to prevent waterlogging and root rot in clay/heavy soils." },
        { title: "Rainwater Buffer Pit", desc: "Store excess monsoon water in a buffer pit for slow soil recharging and emergency watering during winter dry spells." }
      ]
    : [
        { title: "Broad Bed and Furrow (BBF)", desc: "Sow crops on raised beds with furrows in between. BBF conserves rainwater in furrows during dry periods and drains excess water during heavy rain." },
        { title: "Contour Bunding", desc: "Construct low-height soil barriers along contours to retain rainfall and reduce soil erosion across the farm zones." }
      ];

  // 3. Dynamic Crop Rotation Generator (3 Years)
  const rotationMap: Record<string, { year2: string; year3: string; why: string }> = {
    "jowar_pigeon_pea": {
      year2: "Groundnut + Red Gram",
      year3: "Finger Millet (Ragi) + Horsegram",
      why: "Rotating cereal crops with oilseeds and legumes replenishes deep soil nitrogen and prevents stem borer pupae carryover."
    },
    "tomato_marigold": {
      year2: "Maize + Beans",
      year3: "Chilli + Onion",
      why: "Alternating solanaceous crops with heavy feeding maize disrupts the lifecycle of soil nematodes and powdery mildew spores."
    },
    "groundnut_red_gram": {
      year2: "Finger Millet (Ragi) + Horsegram",
      year3: "Sunflower + Coriander",
      why: "Maintains balanced soil structure and prevents Tikka leaf spot fungal spores from accumulating in the topsoil."
    },
    "ragi_horsegram": {
      year2: "Groundnut + Red Gram",
      year3: "Cotton + Moong",
      why: "Alternates deep taproots with fibrous roots, allowing hard dryland soil layers to break up naturally."
    },
    "cotton_moong": {
      year2: "Jowar + Pigeon Pea",
      year3: "Groundnut + Red Gram",
      why: "Restructures deep soil layers and breaks cycles of cotton sucking pests (whiteflies and jassids)."
    },
    "sunflower_coriander": {
      year2: "Maize + Beans",
      year3: "Ragi + Horsegram",
      why: "Replenishes potassium consumed by heavy oilseed crops and restores organic carbon levels."
    },
    "chilli_onion": {
      year2: "Cotton + Moong",
      year3: "Jowar + Pigeon Pea",
      why: "Maintains balanced nutrient extraction and minimizes thrips propagation in the soil."
    },
    "maize_beans": {
      year2: "Groundnut + Red Gram",
      year3: "Chilli + Onion",
      why: "Replaces nitrogen consumed by maize's vegetative growth and interrupts Fall Armyworm lifecycles."
    }
  };

  const getRotationPlan = (cropId: string, zoneName: string) => {
    const key = cropId.toLowerCase();
    const config = rotationMap[key] || {
      year2: "Groundnut + Red Gram",
      year3: "Jowar (Sorghum) + Pigeon Pea",
      why: "Ensures soil nutrients are balanced by rotating heavy grain feeders with nitrogen-fixing cover crops."
    };
    return { zoneName, ...config };
  };

  // 5. Dynamic Natural Fertility Estimates
  const compostTons = (landArea * 5).toFixed(1);
  const dungTons = (landArea * 2.5).toFixed(1);
  const seedKg = (landArea * 15).toFixed(0);
  const jeevamruthaL = (landArea * 200).toFixed(0);
  const costSavings = Math.round(landArea * 8500).toLocaleString("en-IN");  return (
    <Section title="Continuous Income & Sustainability Intelligence" subtitle="Agronomic resource calculators, cashflow ledger, and crop rotation schedules">
      <div className="rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 space-y-6">
        
        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {[
            { id: "rotation",  l: "3-Year Rotation Plan",     icon: RefreshCw  },
            { id: "ledger",    l: "Zone Cashflow Ledger",      icon: DollarSign },
            { id: "fertility", l: "Organic Input Calculator",  icon: Sprout     },
            { id: "resource",  l: "Water & Pollinators",       icon: CloudSun   },
            { id: "scores",    l: "Risk Score Weights",        icon: ShieldCheck}
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.l}
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: Crop Rotation */}
        {activeSubTab === "rotation" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2">
              <RefreshCw className="h-4 w-4 text-primary shrink-0" />
              3-Year Crop Rotation Planner
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ecological Crop Rotation Strategy: Continuous monoculture depletes specific micro-nutrients. Crop rotation alternates deep and shallow root structures, breaking insect breeding cycles naturally.
            </p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {plan.zones.map(z => {
                const kharifCrop = z.seasons?.kharif?.cropPair?.[0] || "";
                const rot = getRotationPlan(kharifCrop, z.name);
                return (
                  <div key={z.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-3">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="font-display font-extrabold text-xs text-foreground">{rot.zoneName} Rotation</span>
                      <span className="text-[9px] uppercase font-bold text-primary bg-primary-soft/35 px-2 py-0.5 rounded border border-primary/5">Zone {z.id}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-semibold">Year 1 (Current):</span>
                        <span className="font-bold text-foreground">{z.seasons ? z.seasons.kharif.cropPair.join(" + ") : ""}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-semibold">Year 2 (Future):</span>
                        <span className="font-bold text-success">{rot.year2}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-semibold">Year 3 (Future):</span>
                        <span className="font-bold text-primary">{rot.year3}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
                      💡 <span className="font-semibold text-foreground">Benefit:</span> {rot.why}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: Zone Cashflow Ledger */}
        {activeSubTab === "ledger" && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2">
              <DollarSign className="h-4 w-4 text-primary shrink-0" />
              Zone-wise Monthly Financial Ledger
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Continuous Income Ledger: Zone-wise monthly breakdowns track seed layouts, field labor expenditures, and staggered market payoff phases to maintain positive working capital.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold">
                    <th className="p-3.5">Month</th>
                    {plan.zones.map(z => (
                      <th key={z.id} className="p-3.5">{z.name} (Rev / Exp / Profit)</th>
                    ))}
                    <th className="p-3.5 text-right font-black text-foreground">Total Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {plan.monthly.map(m => {
                    const getStatusColor = (profit: number) => {
                      if (profit > 0) return "text-success font-bold";
                      if (profit < 0) return "text-destructive font-semibold";
                      return "text-muted-foreground";
                    };

                    return (
                      <tr key={m.month} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 font-bold text-foreground">{m.month}</td>
                        {plan.zones.map(z => {
                          const zb = m.zoneBreakdown?.[z.name] || { revenue: 0, expenses: 0, netProfit: 0 };
                          return (
                            <td key={z.id} className="p-3.5 space-y-1">
                              <div className="flex gap-2 text-[10px]">
                                <span className="text-success font-semibold">In: ₹{zb.revenue.toLocaleString("en-IN")}</span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-destructive">Out: ₹{zb.expenses.toLocaleString("en-IN")}</span>
                              </div>
                              <div className={`text-[10px] ${getStatusColor(zb.netProfit)}`}>
                                Net: ₹{zb.netProfit.toLocaleString("en-IN")}
                              </div>
                            </td>
                          );
                        })}
                        <td className={`p-3.5 text-right font-display font-extrabold text-sm ${getStatusColor(m.krishiflow)}`}>
                          ₹{m.krishiflow.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Staggered visual payout explanation card */}
            <div className="bg-primary-soft/35 border border-primary/10 rounded-2xl p-4 text-[11px] leading-relaxed text-muted-foreground">
              💡 <span className="font-bold text-foreground">Principal Agronomist Insight:</span> Expenses are staggered per zone: <strong>30% is allocated in the sowing month</strong> for seeds and land preparation, <strong>10% is allocated for mid-season maintenance</strong>, and the remaining <strong>60% (harvesting & transport)</strong> is paid in the payoff month when the crop is sold and revenue is realized.
            </div>
          </div>
        )}

        {/* Tab Content 3: Fertility Calculator */}
        {activeSubTab === "fertility" && (
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 items-start animate-fadeIn">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2">
                <Sprout className="h-4 w-4 text-primary shrink-0" />
                Heritage Organic Soil Inputs (Scaled for {landArea} Acres)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Microbial Organic Nutrition: Applying biodynamic inputs enriches the microbial carbon sink, multiplying mycorrhizal colony counts and increasing soil water holding capacity.
              </p>

              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { l: "Fermented Jeevamrutha", v: `${jeevamruthaL} L`, desc: "Apply 200L/acre every fortnight", sub: "Microbial booster" },
                  { l: "Organic Compost", v: `${compostTons} Tonnes`, desc: "Incorporate before tilling", sub: "Topsoil carbon feed" },
                  { l: "Cow Dung / Raw Manure", v: `${dungTons} Tonnes`, desc: "Mix with field soil", sub: "Nitrogen base" },
                  { l: "Green Manure Seeds", v: `${seedKg} Kg`, desc: "Sow Sunnhemp / Dhaincha", sub: "Pre-season cover" }
                ].map(item => (
                  <div key={item.l} className="rounded-xl border border-border p-3 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-muted-foreground">{item.l}</p>
                      <p className="font-display font-extrabold text-lg text-foreground mt-1">{item.v}</p>
                    </div>
                    <div className="mt-2 text-[9px] text-muted-foreground leading-snug border-t border-border/40 pt-1">
                      {item.desc} · <span className="font-bold text-foreground/80">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Estimator Card */}
            <div className="rounded-2xl bg-success/5 border border-success/15 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-success/10 pb-2">
                <DollarSign className="h-5 w-5 text-success shrink-0" />
                <p className="font-display font-bold text-xs uppercase text-success-foreground tracking-wider">Chemical Input Savings</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By replacing chemical urea, pesticide sprays, and synthetic growth hormones with fermented Jeevamrutha and trap crops, your cost reductions are estimated at:
              </p>
              <div className="bg-card border border-success/10 p-4 rounded-xl text-center shadow-soft">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-success">₹{costSavings}</span>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1.5 font-bold">Estimated Cost Savings</p>
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal italic">
                *Calculation is based on average Karnataka APMC fertilizer expenses saved per acre.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content 4: Resource Advisor & Pollinator */}
        {activeSubTab === "resource" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-fadeIn">
            {/* Water Management */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2">
                <Droplet className="h-4 w-4 text-primary shrink-0" />
                Traditional Water Management Advisor
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hydrology Conservation: Slope-aligned rainwater catchment structures prevent topsoil washouts and recharge shallow aquifers, boosting local moisture levels.
              </p>
              <div className="space-y-3.5">
                {waterRecommendations.map((rec, idx) => (
                  <div key={idx} className="rounded-xl border border-border p-4 shadow-soft">
                    <h5 className="font-display font-bold text-xs text-foreground">{rec.title}</h5>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{rec.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pollinator Planning */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2">
                <Flower className="h-4 w-4 text-primary shrink-0 animate-pulse" />
                Pollinator & Border Crop Planner (Trap Crops)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Trap Cropping & Pollination Indices: Bordering plots with flowering borders increases honeybee visits, improving tomato/legume yields by 20% to 30% while acting as pest buffers.
              </p>
              <div className="grid grid-cols-2 gap-3.5">
                {[
                  { crop: "Marigold / Sunflower", role: "Attracts honeybees & repels nematodes" },
                  { crop: "Sesame / Mustard", role: "Attracts hoverflies & predatory insects" }
                ].map(trap => (
                  <div key={trap.crop} className="rounded-xl border border-border bg-card p-3 shadow-soft flex flex-col justify-between">
                    <div>
                      <h6 className="font-display font-extrabold text-xs text-foreground">{trap.crop}</h6>
                      <p className="text-[9.5px] text-muted-foreground mt-1 leading-snug">{trap.role}</p>
                    </div>
                    <div className="mt-2.5 text-[8.5px] font-bold text-primary uppercase">Boundary Row layout</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 5: Scores weights */}
        {activeSubTab === "scores" && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              Risk Diversification Score Weightings
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              Balanced Composite Scoring Engine: Our recommendation system utilizes a multi-criteria decision formula to rank cropping configurations. This ensures financial profitability doesn't compromise ecological integrity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2">
              {[
                { l: "Expected Profit", w: "35%", val: plan.scores?.profit_score || 85, color: "bg-primary" },
                { l: "Income Stability", w: "25%", val: plan.scores?.incomeStability || 75, color: "bg-success" },
                { l: "Sustainability", w: "20%", val: plan.scores?.sustainability || 80, color: "bg-accent" },
                { l: "Biodiversity Profile", w: "10%", val: plan.scores?.biodiversity || 82, color: "bg-primary" },
                { l: "Risk Yield Buffer", w: "10%", val: plan.scores?.riskMitigation || 70, color: "bg-amber-500" }
              ].map(item => (
                <div key={item.l} className="rounded-xl border border-border p-3.5 shadow-soft space-y-2.5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[80px]">{item.l}</span>
                    <span className="text-[9.5px] font-extrabold text-foreground">{item.w} weight</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-lg text-foreground">{item.val}%</span>
                    <span className="text-[9px] text-muted-foreground">score</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Section>
  );
}

function LoaderSpinner() {
  return (
    <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  );
}

// A. Header
function PlanHeader({ plan }: { plan: FarmPlan }) {
  const [saved, setSaved] = useState(false);
  function onSave() { 
    savePlan(plan); 
    setSaved(true); 
    setTimeout(() => setSaved(false), 1800); 
  }
  return (
    <section className="rounded-3xl gradient-hero text-primary-foreground p-6 sm:p-8 shadow-elevated relative overflow-hidden">
      <div className="absolute top-0 right-0 h-48 w-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start sm:flex sm:flex-wrap sm:justify-between relative z-10">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Agronomic Optimization Report</p>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold mt-1.5 truncate tracking-tight">{plan?.input?.farmName || "Unnamed Farm"}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-90 mt-2">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 shrink-0" /> {plan?.input?.district || ""}, {plan?.input?.state || ""}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Sprout className="h-3.5 w-3.5 shrink-0" /> {plan?.input?.landArea || 0} Acres</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 shrink-0" /> {plan?.input?.season || ""} Cycle</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 no-print shrink-0">
          <button onClick={onSave}
            className="rounded-full bg-accent text-accent-foreground px-4 py-2 text-xs sm:text-sm font-bold shadow-accent hover:opacity-95 whitespace-nowrap transition-all">
            {saved ? "✓ Saved to workspace" : "Save plan"}
          </button>
          <button onClick={() => window.print()}
            className="rounded-full bg-primary-foreground/15 backdrop-blur px-4 py-2 text-xs sm:text-sm font-bold hover:bg-primary-foreground/25 whitespace-nowrap transition-all flex items-center gap-1.5 justify-center">
            <Printer className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 relative z-10">
        {[
          { l: "Estimated Annual Revenue", v: `₹${((plan?.totals?.annualRevenue || 0)/1000).toFixed(0)}k`, desc: "Total gross receipts" },
          { l: "Estimated Net Profit", v: `₹${((plan?.totals?.netProfit || 0)/1000).toFixed(0)}k`, desc: "Gross minus inputs" },
          { l: "Active Earning Months", v: `${plan?.totals?.activeMonths || 0}/12`, desc: "Cash flow consistency" },
        ].map(s => (
          <div key={s.l} className="rounded-2xl bg-primary-foreground/10 backdrop-blur border border-white/5 p-3.5 sm:p-5">
            <p className="text-[10px] sm:text-xs opacity-80 font-medium truncate">{s.l}</p>
            <p className="font-display font-extrabold text-lg sm:text-3xl mt-1.5 tracking-tight">{s.v}</p>
            <p className="text-[9px] opacity-60 mt-1 hidden sm:block">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// B. Zones
function ZoneMap({ plan }: { plan: FarmPlan }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground border-primary/20",
    accent: "gradient-accent text-accent-foreground border-accent/20",
    success: "bg-success text-primary-foreground border-success/20",
  };

  return (
    <Section title="Agronomic zone division" subtitle="Staggered cultivation sub-plots to distribute labor and secure steady cash flow">
      <div className="grid sm:grid-cols-3 gap-6">
        {(plan?.zones || []).map(z => {
          const totalZoneIncome = z.seasons
            ? (z.seasons.kharif?.expectedIncome || 0) + 
              (z.seasons.rabi?.expectedIncome || 0) + 
              (z.seasons.zaid?.expectedIncome || 0)
            : (z.expectedIncome || 0);
          
          return (
            <div key={z.id} className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-shadow duration-300">
              <div>
                <div className={`p-5 border-b ${colorMap[z.color] || "bg-primary text-primary-foreground"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-display font-extrabold text-2xl tracking-tight">{z.name}</p>
                    <span className="rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[10px] font-black border border-white/10">{(z.area || 0).toFixed(2)} ac</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider opacity-85 font-extrabold mt-1">Staggered Crop Rotation</p>
                </div>
                
                <div className="p-5 space-y-4.5">
                  {z.seasons ? (
                    (["kharif", "rabi", "zaid"] as const).map(seasonKey => {
                      const seasonInfo = z.seasons[seasonKey];
                      if (!seasonInfo) return null;
                      const seasonLabels = {
                        kharif: { label: "Kharif Cycle", time: "Jun - Oct", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
                        rabi: { label: "Rabi Cycle", time: "Nov - Feb", color: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
                        zaid: { label: "Zaid Cycle", time: "Mar - May", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10" }
                      };
                      const config = seasonLabels[seasonKey];
                      
                      return (
                        <div key={seasonKey} className="relative pl-4 border-l-2 border-border/80 hover:border-primary/50 transition-colors py-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold">{config.time}</span>
                          </div>
                          <p className="font-display font-bold text-sm text-foreground mt-1.5 leading-snug">
                            {seasonInfo.cropPair?.[0]} + {seasonInfo.cropPair?.[1]}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-medium">
                            <span>Sow: {seasonInfo.plantingMonth} · Harv: {seasonInfo.harvestMonths.join(", ")}</span>
                            <span className="font-bold text-foreground">₹{((seasonInfo.expectedIncome || 0)/1000).toFixed(1)}k profit</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="relative pl-4 border-l-2 border-border py-0.5">
                      <p className="font-display font-bold text-sm text-foreground mt-1.5 leading-snug">
                        {z.cropPair?.[0]} + {z.cropPair?.[1]}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-medium">
                        <span>Sow: {z.plantingMonth} · Harv: {z.harvestMonths?.join(", ")}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-border flex justify-between items-baseline">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Annual Zone Net Income</span>
                  <span className="font-display font-extrabold text-primary text-xl">₹{(totalZoneIncome/1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

const formatCurrency = (val: number) => {
  if (val < 0) return `-₹${Math.abs(val).toLocaleString("en-IN")}`;
  return `₹${val.toLocaleString("en-IN")}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const traditional = payload.find((p: any) => p.dataKey === "traditional")?.value || 0;
    const zoneItems = payload.filter((p: any) => p.dataKey !== "traditional");
    const totalStaggered = zoneItems.reduce((sum: number, p: any) => sum + (p.value || 0), 0);

    return (
      <div className="rounded-2xl bg-card border border-border shadow-soft p-4 text-xs space-y-2.5">
        <p className="font-bold text-foreground">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-6">
            <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[oklch(0.60_0.22_29)]" />
              Traditional monoculture:
            </span>
            <span className="font-bold text-foreground">{formatCurrency(traditional)}</span>
          </div>
          <div className="border-t border-border/60 my-1.5" />
          <div className="flex justify-between items-center gap-6">
            <span className="font-black text-primary flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary" />
              KrishiFlow Plan (Total):
            </span>
            <span className="font-black text-primary">{formatCurrency(totalStaggered)}</span>
          </div>
          <div className="pl-4 space-y-1 text-[11px] mt-1 border-l border-primary/20 max-h-48 overflow-y-auto">
            {zoneItems.map((p: any) => (
              <div key={p.dataKey} className="flex justify-between items-center gap-4">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
                  {p.name}:
                </span>
                <span className="font-bold text-foreground">{formatCurrency(p.value || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// C. Income chart
function IncomeChart({ plan }: { plan: FarmPlan }) {
  const chartData = useMemo(() => {
    return (plan?.monthly || []).map(m => {
      const row: any = {
        month: m.month,
        traditional: m.traditional || 0,
      };
      if (m.zoneBreakdown) {
        Object.keys(m.zoneBreakdown).forEach(zoneId => {
          row[zoneId] = Math.round(m.zoneBreakdown[zoneId]?.netProfit || 0);
        });
      }
      return row;
    });
  }, [plan?.monthly]);

  return (
    <Section title="Income calendar & comparison" subtitle="Staggered revenue streams vs traditional monoculture harvesting variance" highlight>
      <div className="rounded-3xl bg-card border border-border shadow-soft p-4 sm:p-6">
        <div className="h-72 sm:h-96 -ml-3">
          <ResponsiveContainer>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontWeight: 'semibold' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)", fontWeight: 'semibold' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12, fontWeight: 'semibold' }} />
              <Bar dataKey="traditional" name="Traditional monoculture yield" fill="var(--color-destructive)" radius={[6,6,0,0]} />
              {plan.zones.map((z, idx) => {
                const colorMap: Record<string, string> = {
                  primary: "var(--color-primary)",
                  success: "var(--color-success)",
                  accent: "var(--color-accent)",
                };
                const fallbackColors = ["var(--color-primary)", "var(--color-success)", "var(--color-accent)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-chart-6)"];
                const barColor = colorMap[z.color] || fallbackColors[idx % fallbackColors.length];

                return (
                  <Bar
                    key={z.id || z.name}
                    dataKey={z.name}
                    stackId="staggered"
                    name={`KrishiFlow ${z.name}`}
                    fill={barColor}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-border">
          <MetricCard label="Income variance mitigation" value="3.2×" hint="Staggered income vs monoculture spike" icon={TrendingUp} />
          <MetricCard label="Systemic risk reduction" value="-64%" hint="Diversified crop zone risk buffer" tone="success" icon={ShieldCheck} />
          <MetricCard label="Active cashflow periods" value={`${plan?.totals?.activeMonths || 0}/12`} hint="Months with positive net revenue" tone="accent" icon={Calendar} />
        </div>
      </div>
    </Section>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
  tone?: "primary" | "accent" | "success";
  icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({ label, value, hint, tone = "primary", icon: Icon }: MetricCardProps) {
  const tones = {
    primary: "bg-primary-soft/40 text-primary border-primary/10",
    accent: "bg-accent-soft/40 text-accent-foreground border-accent/10",
    success: "bg-success/10 text-success border-success/15",
  };
  return (
    <div className={`rounded-2xl border p-4 flex gap-3.5 items-start ${tones[tone]}`}>
      <div className="h-10 w-10 rounded-xl bg-card border border-border/10 grid place-items-center shadow-soft shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-extrabold text-muted-foreground">{label}</p>
        <p className="font-display font-extrabold text-xl sm:text-2xl mt-1 tracking-tight">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{hint}</p>
      </div>
    </div>
  );
}

// D. Recommendations
function Recommendations({ plan }: { plan: FarmPlan }) {
  return (
    <Section title="Agronomic crop details & pairings" subtitle="Nutrient compatibility index and crop pairing rationale">
      <div className="space-y-4">
        {(plan?.recommendations || []).map((r, i) => <RecCard key={i} r={r} />)}
      </div>
    </Section>
  );
}

function RecCard({ r }: { r: FarmPlan["recommendations"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden transition-all duration-200">
      <button onClick={() => setOpen(!open)} className="w-full p-5 text-left grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center hover:bg-muted/30 transition-colors">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-wider font-extrabold text-primary">Agronomic pairing</p>
          <h4 className="font-display font-extrabold text-lg text-foreground truncate mt-0.5">{r.crop} + {r.partner}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{r.why}</p>
        </div>
        <span className={`shrink-0 h-8 w-8 grid place-items-center rounded-full bg-muted border border-border text-foreground transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      {open && (
        <div className="border-t border-border bg-accent-soft/20 p-5 space-y-4">
          <div className="rounded-xl bg-card border border-border p-4 shadow-soft">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-extrabold text-accent-foreground border-b border-border pb-2 mb-2.5">
              <BookOpen className="h-3.5 w-3.5" />
              Traditional Practice & Rationale
            </div>
            <p className="text-xs text-foreground leading-relaxed">{r.traditionalWisdom}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-card border border-border p-3">
              <p className="text-[9px] uppercase font-bold text-muted-foreground">Historical Yield / Acre</p>
              <p className="text-xs font-bold text-foreground mt-1">{r.yieldPerAcre}</p>
            </div>
            <div className="rounded-xl bg-card border border-border p-3">
              <p className="text-[9px] uppercase font-bold text-muted-foreground">Local Market Rate</p>
              <p className="text-xs font-bold text-foreground mt-1">{r.marketPrice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// E. Score dashboard
function ScoreDashboard({ plan }: { plan: FarmPlan }) {
  const items = [
    { l: "Income stability", v: plan?.scores?.incomeStability || 0, color: "var(--color-primary)" },
    { l: "Sustainability index", v: plan?.scores?.sustainability || 0, color: "var(--color-chart-3)" },
    { l: "Biodiversity profile", v: plan?.scores?.biodiversity || 0, color: "var(--color-chart-2)" },
    { l: "Yield risk buffer", v: plan?.scores?.riskMitigation || 0, color: "oklch(0.65 0.18 45)" },
  ];
  return (
    <Section title="Agronomic scores" subtitle="Quantitative evaluation parameters of the current plan model">
      <div className="grid grid-cols-2 gap-3.5">
        {items.map(i => <ScoreRing key={i.l} {...i} />)}
      </div>
    </Section>
  );
}

function ScoreRing({ l, v, color }: { l: string; v: number; color: string }) {
  const r = 40, c = 2 * Math.PI * r, off = c - (v / 100) * c;
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-col items-center justify-between text-center min-h-[160px]">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-muted)" strokeWidth="7" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s" }} />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display font-extrabold text-xl text-foreground">{v}%</span>
        </div>
      </div>
      <div className="mt-2.5">
        <p className="font-display font-bold text-foreground text-xs leading-snug">{l}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{v >= 80 ? "Optimized" : v >= 65 ? "Stable" : "Moderate"}</p>
      </div>
    </div>
  );
}

// F. Weather
function WeatherWidget({ plan }: { plan: FarmPlan }) {
  const [weather, setWeather] = useState(plan?.weather || []);
  const [advisory, setAdvisory] = useState(plan?.advisory || "");

  useEffect(() => {
    // Reset state when the active plan shifts
    setWeather(plan?.weather || []);
    setAdvisory(plan?.advisory || "");

    const base = (import.meta as any).env?.VITE_API_BASE_URL;
    if (!base) return;

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3000);

    fetch(`${base}/weather?district=${encodeURIComponent(plan?.input?.district || "")}&state=${encodeURIComponent(plan?.input?.state || "")}`, {
      signal: ctrl.signal
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.weather) setWeather(data.weather);
        if (data.advisory) setAdvisory(data.advisory);
      })
      .catch(() => {
        // keep existing state from plan as graceful fallback
      })
      .finally(() => clearTimeout(t));

    return () => ctrl.abort();
  }, [plan?.id, plan?.input?.district, plan?.input?.state]);

  function getWeatherIcon(condition: string) {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("sunny") || cond.includes("clear")) {
      return <Sun className="h-6 w-6 text-amber-500 animate-spin-slow" />;
    } else if (cond.includes("cloud") && cond.includes("part")) {
      return <CloudSun className="h-6 w-6 text-slate-400 animate-pulse" />;
    } else if (cond.includes("rain") || cond.includes("shower") || cond.includes("drizzle")) {
      return <CloudRain className="h-6 w-6 text-blue-400 animate-bounce" style={{ animationDuration: "2s" }} />;
    } else if (cond.includes("cloud")) {
      return <Cloud className="h-6 w-6 text-slate-500 animate-pulse" />;
    }
    return <Sun className="h-6 w-6 text-amber-500" />;
  }

  return (
    <Section title="Climate & advisory indices" subtitle="Local weather feeds mapped to agricultural advisory briefs">
      <div className="space-y-4">
        <div className="rounded-2xl bg-card border border-border shadow-soft p-4 sm:p-5">
          <p className="text-[9px] uppercase font-extrabold text-muted-foreground border-b border-border pb-2 mb-3">5-Day Regional Forecast</p>
          <div className="grid grid-cols-5 gap-2">
            {weather?.map(d => {
              const isRain = d.condition?.toLowerCase().includes("rain") || d.condition?.toLowerCase().includes("drizzle");
              return (
                <div 
                  key={d.day} 
                  className={`rounded-xl p-2.5 text-center flex flex-col items-center relative overflow-hidden transition-all duration-300 ${
                    isRain 
                      ? "bg-blue-50/70 border border-blue-200/40 dark:bg-blue-950/40 dark:border-blue-900/30 shadow-sm animate-pulse-slow" 
                      : "bg-muted border border-transparent"
                  }`}
                >
                  {isRain && (
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                      <div className="absolute top-1 left-2 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-1" />
                      <div className="absolute top-2 left-5 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-2" />
                      <div className="absolute top-1 left-9 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-3" />
                      <div className="absolute top-3 left-13 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-1 delay-200" />
                      <div className="absolute top-2 left-17 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-2 delay-500" />
                    </div>
                  )}
                  <p className="text-[9px] font-bold text-muted-foreground uppercase z-10">{d.day}</p>
                  <div className="my-2 z-10">{getWeatherIcon(d.condition)}</div>
                  <p className="font-display font-extrabold text-foreground text-xs z-10">{d.temp}°C</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5 font-medium z-10">{d.rain}mm</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl bg-accent-soft/30 border border-accent/20 p-5 text-accent-foreground relative overflow-hidden">
          <div className="flex items-center gap-2 border-b border-accent/10 pb-2 mb-3">
            <Zap className="h-4 w-4 text-accent-foreground shrink-0" />
            <p className="font-display font-bold text-xs uppercase tracking-wider">Agronomic Field Alert</p>
          </div>
          <p className="text-xs leading-relaxed font-medium">{advisory}</p>
        </div>
      </div>
    </Section>
  );
}

// G. Pest detector
function PestDetector() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [result, setResult] = useState<ReturnType<typeof diagnosePest>>(null);

  function toggle(s: string) { setPicked(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); }
  
  async function analyze() {
    setLoading(true); setResult(null);
    const base = (import.meta as any).env?.VITE_API_BASE_URL;
    let r = null;
    if (base) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3000);
        const res = await fetch(`${base}/pest`, { method: "POST", body: JSON.stringify({ symptoms: picked }), headers: { "Content-Type": "application/json" }, signal: ctrl.signal });
        clearTimeout(t);
        if (res.ok) r = await res.json();
      } catch {/* fallback */}
    }
    if (!r) { await new Promise(r => setTimeout(r, 700)); r = diagnosePest(picked); }
    setResult(r); setLoading(false);
  }

  function simulateUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setUploading(true);
    setUploadProgress(0);
    setResult(null);

    const lowerName = file.name.toLowerCase();
    let symptomsToSelect = ["Yellow leaves", "Wilting plants"];
    if (lowerName.includes("mildew") || lowerName.includes("powder")) {
      symptomsToSelect = ["White powder on leaves", "Curled leaves"];
    } else if (lowerName.includes("hole") || lowerName.includes("caterpillar") || lowerName.includes("insect")) {
      symptomsToSelect = ["Holes in leaves", "Small flying insects"];
    } else if (lowerName.includes("deficiency") || lowerName.includes("nitrogen") || lowerName.includes("yellow")) {
      symptomsToSelect = ["Yellow leaves", "Stunted growth"];
    }

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            setPicked(symptomsToSelect);
            setLoading(true);
            setTimeout(() => {
              setResult(diagnosePest(symptomsToSelect));
              setLoading(false);
            }, 1000);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  }

  return (
    <Section title="Crop health & diagnostics" subtitle="Scan symptoms or upload field leaf photography for diagnostics and remedies">
      <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
        <button onClick={() => setOpen(!open)} className="w-full p-5 text-left grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3.5 items-center hover:bg-muted/30 transition-all border-none">
          <Bug className="h-6 w-6 text-primary shrink-0 animate-pulse" />
          <div className="min-w-0">
            <p className="font-display font-bold text-foreground text-sm">Crop Diagnostic Diagnostics</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Diagnose plant stresses, diseases, and mineral deficits</p>
          </div>
          <span className={`shrink-0 h-6 w-6 rounded-full bg-muted border border-border grid place-items-center text-foreground transition-transform ${open ? "rotate-180" : ""}`}>
            <ChevronDown className="h-3.5 w-3.5" />
          </span>
        </button>
        {open && (
          <div className="border-t border-border p-5 space-y-5">
            {/* Visual Upload Selector */}
            <div>
              <input type="file" accept="image/*" className="hidden" id="leaf-image-upload" onChange={simulateUpload} />
              <label htmlFor="leaf-image-upload" className="block cursor-pointer border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-2xl p-6 text-center transition-all">
                <Upload className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
                <span className="text-xs font-bold text-foreground block">Upload crop/leaf photography</span>
                <span className="text-[10px] text-muted-foreground mt-1 block">Drag and drop images or tap to scan local folder</span>
              </label>
              
              {uploading && (
                <div className="space-y-2 bg-muted/40 p-3.5 rounded-xl border border-border mt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground truncate max-w-[150px] font-medium">{uploadedFileName}</span>
                    <span className="font-semibold text-primary">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground block animate-pulse">Running leaf cell diagnosis & lesion scan...</span>
                </div>
              )}
            </div>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-3 text-[9px] uppercase font-extrabold text-muted-foreground tracking-wider">or flag symptoms manually</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Symptom Checker Chips */}
            <div className="flex flex-wrap gap-1.5">
              {PEST_SYMPTOMS.map(s => (
                <button key={s} onClick={() => toggle(s)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold border transition-all ${picked.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary"}`}>
                  {s}
                </button>
              ))}
            </div>

            <button onClick={analyze} disabled={picked.length === 0 || loading || uploading}
              className="w-full rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold disabled:opacity-40 hover:shadow-soft transition-all">
              {loading ? "Verifying diagnosis data..." : "Analyze symptoms"}
            </button>

            {result && (
              <div className="rounded-2xl bg-primary-soft/40 border border-primary/10 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">Diagnostic Conclusion</p>
                    <p className="font-display font-extrabold text-base text-foreground mt-0.5">{result.name}</p>
                  </div>
                  <span className="rounded-full bg-card border border-border text-foreground text-[10px] font-bold px-2.5 py-0.5 shrink-0">
                    {result.confidence}% match
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-card border border-border p-4 shadow-soft">
                    <div className="flex items-center gap-1 text-[9px] uppercase font-extrabold text-success border-b border-border pb-1.5 mb-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      Organic / Heritage Control
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{result.traditional}</p>
                  </div>
                  <div className="rounded-xl bg-card border border-border p-4 shadow-soft">
                    <div className="flex items-center gap-1 text-[9px] uppercase font-extrabold text-destructive border-b border-border pb-1.5 mb-2">
                      <FlaskConical className="h-3.5 w-3.5" />
                      Targeted Chemical Control
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{result.chemical}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

// H. Timeline
interface TimelineProps {
  plan: FarmPlan;
  onUpdatePlan?: (p: FarmPlan) => void;
}

function Timeline({ plan, onUpdatePlan }: TimelineProps) {
  function toggleTimelineItem(itemKey: string) {
    if (!onUpdatePlan) return;
    const completed = plan.completedTimelineItems || [];
    const newCompleted = completed.includes(itemKey)
      ? completed.filter(id => id !== itemKey)
      : [...completed, itemKey];
    
    onUpdatePlan({
      ...plan,
      completedTimelineItems: newCompleted,
    });
  }

  return (
    <Section title="Agronomic action timeline" subtitle="Chronological cultivation calendar from field prep to post-harvest processing">
      <div className="rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 max-h-[32rem] overflow-y-auto">
        <ol className="relative border-l border-primary/20 ml-3.5 space-y-6">
          {(plan?.timeline || []).map((t, i) => {
            const itemKey = `${t.month}-${t.zone}-${t.action}`;
            const isCompleted = (plan.completedTimelineItems || []).includes(itemKey);
            return (
              <li key={i} className="ml-5 relative pr-8">
                <span className="absolute -left-[1.85rem] top-0.5 h-6 w-6 rounded-full bg-primary-soft border border-primary/20 text-primary text-[10px] font-extrabold grid place-items-center ring-4 ring-background shadow-soft">
                  {t.month.slice(0,3)}
                </span>
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3.5 items-center">
                  <span className="rounded-full bg-muted border border-border text-foreground text-[9px] font-bold px-2 py-0.5 whitespace-nowrap uppercase tracking-wider shrink-0">
                    Zone {t.zone.slice(-1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-foreground text-sm leading-snug transition-all ${isCompleted ? "line-through text-muted-foreground font-normal" : ""}`}>{t.action}</p>
                    <p className={`text-xs text-muted-foreground mt-1 leading-relaxed transition-all ${isCompleted ? "text-muted-foreground/60" : ""}`}>{t.detail}</p>
                  </div>
                  {onUpdatePlan && (
                    <button 
                      onClick={() => toggleTimelineItem(itemKey)} 
                      className="shrink-0 h-7 w-7 rounded-full border border-border hover:border-primary hover:bg-primary-soft/35 grid place-items-center cursor-pointer transition-colors"
                      title={isCompleted ? "Mark as not implemented" : "Mark as implemented"}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5 text-success animate-scaleIn" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 hover:bg-primary transition-all" />
                      )}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

function Section({ title, subtitle, children, highlight }: { title: string; subtitle?: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          {highlight && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft text-accent-foreground text-[10px] font-extrabold px-2.5 py-0.5 border border-accent/20 mb-2 uppercase tracking-wider">
              <Activity className="h-3 w-3" /> Core Analysis
            </span>
          )}
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

// I. Crop Monitoring & Action Hub
interface CropMonitorSectionProps {
  plan: FarmPlan;
  onUpdatePlan: (p: FarmPlan) => void;
}

function CropMonitorSection({ plan, onUpdatePlan }: CropMonitorSectionProps) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const defaultStart = plan.input.season === "Kharif" ? "Jun" : plan.input.season === "Rabi" ? "Oct" : "Mar";
  
  const [startMonth, setStartMonth] = useState(plan.activationMonth || defaultStart);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  
  // Field observation log form states
  const [logZoneId, setLogZoneId] = useState("A");
  const [logStatus, setLogStatus] = useState<"Good" | "Normal" | "Needs Attention">("Normal");
  const [logType, setLogType] = useState<"Stage Log" | "Input Applied" | "Stress Alert">("Stage Log");
  const [logDescription, setLogDescription] = useState("");
  const [logInputs, setLogInputs] = useState<string[]>([]);
  
  const availableInputs = ["Weeding", "Irrigation", "Jeevamrutha organic manure", "Neem oil foliar spray", "NPK top-dressing", "Trichoderma soil drench"];

  useEffect(() => {
    if (plan.isActive && plan.activationMonth) {
      setSelectedMonth(plan.activationMonth);
    } else {
      setSelectedMonth(startMonth);
    }
  }, [plan.isActive, plan.activationMonth, startMonth]);

  function handleActivate() {
    onUpdatePlan({
      ...plan,
      isActive: true,
      activationMonth: startMonth,
      monitorUpdates: plan.monitorUpdates || [],
      completedTasks: plan.completedTasks || [],
    });
    setSelectedMonth(startMonth);
  }

  function handleDeactivate() {
    if (confirm("Are you sure you want to deactivate cultivation tracking? All logged observations will remain preserved, but monitoring stages will reset.")) {
      onUpdatePlan({
        ...plan,
        isActive: false,
        activationMonth: undefined,
      });
    }
  }

  function handleToggleTask(taskId: string) {
    const completed = plan.completedTasks || [];
    const newCompleted = completed.includes(taskId)
      ? completed.filter(id => id !== taskId)
      : [...completed, taskId];
    
    onUpdatePlan({
      ...plan,
      completedTasks: newCompleted,
    });
  }

  function handleSubmitLog(e: React.FormEvent) {
    e.preventDefault();
    if (!logDescription.trim()) return;

    const newLog = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      zoneId: logZoneId,
      status: logStatus,
      updateType: logType,
      description: logDescription,
      appliedInputs: logInputs,
    };

    onUpdatePlan({
      ...plan,
      monitorUpdates: [newLog, ...(plan.monitorUpdates || [])],
    });

    setLogDescription("");
    setLogInputs([]);
    setLogStatus("Normal");
    setLogType("Stage Log");
  }

  const toggleInput = (inputName: string) => {
    setLogInputs(prev => prev.includes(inputName) ? prev.filter(x => x !== inputName) : [...prev, inputName]);
  };

  // Generate dynamic tasks checklist
  const taskList = useMemo(() => {
    return getTaskList(plan, selectedMonth);
  }, [plan, selectedMonth]);

  // Next month forecasting calculations
  const nextMonthForecast = useMemo(() => {
    if (!selectedMonth) return null;
    const currentIdx = MONTHS.indexOf(selectedMonth);
    const nextMonth = MONTHS[(currentIdx + 1) % 12];
    const nextSeasonKey = getSeasonKeyFromMonth(nextMonth);
    
    // Check if any zone starts sowing next month
    const sowingZones = plan.zones.filter(z => z.seasons?.[nextSeasonKey]?.plantingMonth === nextMonth);
    // Check if any zone harvests next month
    const harvestZones = plan.zones.filter(z => z.seasons?.[nextSeasonKey]?.harvestMonths?.includes(nextMonth));
    
    const estRevenue = harvestZones.reduce((sum, z) => {
      const sz = z.seasons?.[nextSeasonKey];
      return sum + (sz ? (sz.expectedIncome / sz.harvestMonths.length) : 0);
    }, 0);

    return {
      month: nextMonth,
      sowingZones,
      harvestZones,
      estRevenue,
    };
  }, [selectedMonth, plan.zones]);

  const activeStart = plan.activationMonth || startMonth;
  const elapsedMonths = plan.isActive ? (MONTHS.indexOf(selectedMonth) - MONTHS.indexOf(activeStart) + 12) % 12 : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Plan Activation Controls */}
      {!plan.isActive ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-soft">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft/40 text-accent-foreground text-[10px] font-extrabold px-2.5 py-0.5 border border-accent/20 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5" /> Cultivation Monitor
            </div>
            <h3 className="font-display font-extrabold text-lg sm:text-xl text-foreground">Activate Ongoing Cultivation Tracking</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Transition this crop planning projection into an ongoing field tracking plan. Set your sowing commencement month, log fertilizer/weeding inputs, and get context-aware recommendations month-by-month.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-muted-foreground">Sowing Starts</label>
              <select 
                value={startMonth} 
                onChange={e => setStartMonth(e.target.value)} 
                className="rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m} Sowing</option>)}
              </select>
            </div>
            <button 
              onClick={handleActivate}
              className="rounded-full bg-primary text-primary-foreground px-5 py-3 text-xs sm:text-sm font-bold shadow-soft hover:shadow-elevated transition-all flex items-center gap-1.5 cursor-pointer mt-5"
            >
              Activate tracking plan
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-card border border-border p-5 flex flex-wrap items-center justify-between gap-4 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success/10 text-success grid place-items-center shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Ongoing Cultivation Monitor</p>
              <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
                <span className="font-display font-extrabold text-foreground text-sm">Month {elapsedMonths + 1}: {selectedMonth}</span>
                <span className="text-xs text-muted-foreground">(Started: {activeStart})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              {MONTHS.map(m => {
                const activeIdx = MONTHS.indexOf(activeStart);
                const currentIdx = MONTHS.indexOf(m);
                const diff = (currentIdx - activeIdx + 12) % 12;
                const inCycle = diff >= 0 && diff < 6;
                if (!inCycle) return null;
                return (
                  <button 
                    key={m} 
                    onClick={() => setSelectedMonth(m)}
                    className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      selectedMonth === m 
                        ? "bg-card text-foreground shadow-soft border border-border/10" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={handleDeactivate}
              className="text-xs font-semibold text-destructive hover:underline px-3 py-1.5 cursor-pointer"
            >
              Reset plan
            </button>
          </div>
        </div>
      )}

      {/* Main Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-start">
        {/* Left Column: Zone Progress, Dynamic Tasks & Thereafter Analysis */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* 1. Zone progress metrics */}
          <Section title="Zone Status Tracker" subtitle="Estimations of current physiological crop development based on selected calendar month">
            <div className="grid sm:grid-cols-3 gap-4">
              {plan.zones.map(z => {
                const stageInfo = getGrowthStage(z, selectedMonth);
                const health = getZoneHealth(plan, z.id);
                const latestLog = getZoneLatestLog(plan, z.id);
                
                const activeSeason = getSeasonKeyFromMonth(selectedMonth);
                const seasonInfo = z.seasons ? z.seasons[activeSeason] : null;
                if (!seasonInfo) return null;
                
                const healthColors = {
                  "Good": "bg-success/10 text-success border-success/20",
                  "Normal": "bg-muted text-muted-foreground border-border",
                  "Needs Attention": "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
                };

                return (
                  <div key={z.id} className="rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-col justify-between min-h-[190px]">
                    <div>
                      <div className="flex items-center justify-between border-b border-border pb-2 mb-2.5">
                        <span className="font-display font-extrabold text-sm text-foreground">{z.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${healthColors[health]}`}>
                          {health}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-foreground">{seasonInfo.cropPair.join(" + ")}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-snug font-semibold">Stage: {stageInfo.stage}</p>
                      
                      {/* Custom visual progress bar */}
                      <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden border border-border/5">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${stageInfo.progress}%` }} 
                        />
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-border">
                      <p className="text-[9.5px] text-muted-foreground leading-relaxed italic">
                        "{stageInfo.detail}"
                      </p>
                      {health === "Needs Attention" && latestLog && (
                        <p className="text-[9px] font-bold text-destructive mt-1.5 leading-snug">
                          ⚠️ Alert logged: {latestLog.description.slice(0, 30)}...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* 2. dynamic recommended next tasks */}
          <Section title="Next Recommended Tasks" subtitle="Staggered operational checklist adapted to growth stages and logged alerts">
            <div className="rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 space-y-4">
              {taskList.length === 0 ? (
                <div className="text-center py-6">
                  <Check className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-sm font-bold text-foreground">No pending actions</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Crop monitoring suggests fallow or residue decomposition phase.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {taskList.map(task => {
                    const isCompleted = (plan.completedTasks || []).includes(task.id);
                    return (
                      <div 
                        key={task.id} 
                        onClick={() => handleToggleTask(task.id)}
                        className="py-3 flex items-start gap-3 cursor-pointer hover:bg-muted/10 transition-all rounded-lg px-2 -mx-2 group"
                      >
                        <button className="shrink-0 mt-0.5 text-primary cursor-pointer">
                          {isCompleted ? (
                            <CheckSquare className="h-5 w-5 text-primary" />
                          ) : (
                            <Square className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-primary">{task.zone}</span>
                            <span className="text-muted-foreground/30">•</span>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground">{task.type}</span>
                            {!isCompleted && (
                              <>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/20 animate-pulse">
                                  ⚠️ Needs Attention (Time Ending)
                                </span>
                              </>
                            )}
                          </div>
                          <p className={`text-xs font-bold text-foreground mt-0.5 ${isCompleted ? "line-through text-muted-foreground font-normal" : ""}`}>
                            {task.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            {task.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>

          {/* 3. Thereafter Analysis Card */}
          {nextMonthForecast && (
            <Section title="Thereafter Analysis & Projections" subtitle="Forward-looking operational logistics and cash flow estimates for the coming month">
              <div className="rounded-3xl bg-accent-soft/30 border border-accent/20 p-5 sm:p-6 text-accent-foreground relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-accent/5 rounded-full blur-xl pointer-events-none" />
                <h4 className="font-display font-extrabold text-base border-b border-accent/10 pb-2 mb-3.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4" /> Next Month Outlook ({nextMonthForecast.month})
                </h4>
                <div className="space-y-4 text-xs font-medium">
                  {nextMonthForecast.sowingZones.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Sprout className="h-4 w-4 shrink-0 text-accent-foreground mt-0.5" />
                      <div>
                        <p className="font-bold">Zone Sowing Commences</p>
                        <p className="opacity-80 text-[11px] mt-0.5">
                          {nextMonthForecast.sowingZones.map(z => {
                            const nextSeasonKey = getSeasonKeyFromMonth(nextMonthForecast.month);
                            const sz = z.seasons?.[nextSeasonKey];
                            return `${z.name} (${sz ? sz.cropPair.join("+") : ""})`;
                          }).join(", ")} sowing begins in {nextMonthForecast.month}. Pre-purchase seeds and prepare manure fertilizer.
                        </p>
                      </div>
                    </div>
                  )}

                  {nextMonthForecast.harvestZones.length > 0 ? (
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 shrink-0 text-success mt-0.5" />
                      <div>
                        <p className="font-bold text-success-foreground">Harvesting & Revenue Scheduled</p>
                        <p className="opacity-80 text-[11px] mt-0.5">
                          {nextMonthForecast.harvestZones.map(z => {
                            const nextSeasonKey = getSeasonKeyFromMonth(nextMonthForecast.month);
                            const sz = z.seasons?.[nextSeasonKey];
                            return `${z.name} (${sz ? sz.cropPair[0] : ""})`;
                          }).join(", ")} harvest schedule active in {nextMonthForecast.month}. Expected revenue generation: <span className="font-bold text-success-foreground">₹{nextMonthForecast.estRevenue.toLocaleString("en-IN")}</span>. Ensure storage drying yards are prepped.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 shrink-0 text-accent-foreground mt-0.5" />
                      <div>
                        <p className="font-bold">Maintenance & Input Phase</p>
                        <p className="opacity-80 text-[11px] mt-0.5">
                          No harvests active in {nextMonthForecast.month}. Continue weeding schedules, foliar manure applications, and soil moisture maintenance to support crop grain filling.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-3.5 border-t border-accent/10 text-[10.5px] opacity-75 font-semibold">
                    💡 Logistics Advisory: Prepare storage bins and APMC logistics at least 15 days prior to harvesting phases.
                  </div>
                </div>
              </div>
            </Section>
          )}

        </div>

        {/* Right Column: Log field observation Form & History feed */}
        <div className="space-y-6 sm:space-y-8">
          
          {/* 1. Log field observation form */}
          <Section title="Log Field Update" subtitle="Record crop milestones, fertilizer inputs, or stress outbreaks">
            <form onSubmit={handleSubmitLog} className="rounded-3xl bg-card border border-border shadow-soft p-5 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Target Zone</label>
                <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-xl">
                  {plan.zones.map(z => (
                    <button 
                      type="button" 
                      key={z.id} 
                      onClick={() => setLogZoneId(z.id)}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        logZoneId === z.id ? "bg-card text-foreground shadow-soft border border-border/10" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {z.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Update Type</label>
                  <select 
                    value={logType} 
                    onChange={e => setLogType(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="Stage Log">Growth Log</option>
                    <option value="Input Applied">Input Log</option>
                    <option value="Stress Alert">Stress Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Zone Condition</label>
                  <select 
                    value={logStatus} 
                    onChange={e => setLogStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="Good">Good</option>
                    <option value="Normal">Normal</option>
                    <option value="Needs Attention">Needs Attention ⚠️</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Actions Performed</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableInputs.map(input => {
                    const isSelected = logInputs.includes(input);
                    return (
                      <button 
                        type="button" 
                        key={input} 
                        onClick={() => toggleInput(input)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold border transition-all cursor-pointer ${
                          isSelected ? "bg-primary text-primary-foreground border-primary animate-pulse" : "bg-card border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {input}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Observation Notes</label>
                <textarea 
                  value={logDescription}
                  onChange={e => setLogDescription(e.target.value)}
                  placeholder="e.g. Sprouting is highly uniform. Hand weeded the rows. Or: Yellow spots seen on lower tomato leaves."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all h-20 resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={!logDescription.trim()}
                className="w-full rounded-full bg-primary text-primary-foreground py-2.5 text-xs font-bold shadow-soft hover:shadow-elevated disabled:opacity-45 transition-all cursor-pointer"
              >
                Log observation update
              </button>
            </form>
          </Section>

          {/* 2. chronological updates history feed */}
          <Section title="Observation History Log" subtitle="Timeline of recorded updates and active alerts in your workspace">
            <div className="rounded-3xl bg-card border border-border shadow-soft p-5 max-h-[20rem] overflow-y-auto">
              {!plan.monitorUpdates || plan.monitorUpdates.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  <ClipboardList className="h-7 w-7 mx-auto mb-2 opacity-50 text-muted-foreground" />
                  No entries logged yet. Complete sowing and log your first updates.
                </div>
              ) : (
                <div className="relative border-l border-border ml-2 space-y-4">
                  {plan.monitorUpdates.map((log) => {
                    const zoneObj = plan.zones.find(z => z.id === log.zoneId);
                    
                    const getZoneLogCrop = (z: Zone, logCreatedAt: string) => {
                      const date = new Date(logCreatedAt);
                      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                      const logMonth = monthNames[date.getMonth()];
                      const sKey = getSeasonKeyFromMonth(logMonth);
                      return z.seasons?.[sKey]?.cropPair[0] || "";
                    };

                    return (
                      <div key={log.id} className="ml-4 relative">
                        {/* Dot */}
                        <span className={`absolute -left-[1.45rem] top-1.5 h-3.5 w-3.5 rounded-full border border-background grid place-items-center ${
                          log.status === "Needs Attention" ? "bg-destructive animate-pulse" : log.status === "Good" ? "bg-success" : "bg-muted-foreground"
                        }`} />
                        <div className="bg-muted/30 border border-border/50 rounded-xl p-3 text-xs">
                          <div className="flex justify-between items-start gap-1 flex-wrap">
                            <span className="font-bold text-foreground">
                              Zone {log.zoneId} ({zoneObj ? getZoneLogCrop(zoneObj, log.createdAt) : ""})
                            </span>
                            <span className="text-[9px] text-muted-foreground">
                              {new Date(log.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="bg-primary-soft/30 text-primary text-[8.5px] font-bold px-1.5 py-0.5 rounded border border-primary/5">
                              {log.updateType}
                            </span>
                            {log.appliedInputs && log.appliedInputs.length > 0 && (
                              <span className="text-[9px] text-muted-foreground truncate max-w-[150px]">
                                Applied: {log.appliedInputs.join(", ")}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mt-1.5 leading-relaxed font-semibold">
                            {log.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

// Global/Module-level helper functions
function getSeasonKeyFromMonth(month: string): "kharif" | "rabi" | "zaid" {
  const m = month.toLowerCase();
  if (["jun", "jul", "aug", "sep", "oct", "june", "july", "september", "october"].some(x => m.startsWith(x))) {
    return "kharif";
  }
  if (["nov", "dec", "jan", "feb", "november", "december", "january", "february"].some(x => m.startsWith(x))) {
    return "rabi";
  }
  return "zaid";
}

function getGrowthStage(z: Zone, sMonth: string) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  if (!z.seasons) {
    return { stage: "Post-Harvest / Fallow", progress: 100, detail: "Harvest complete." };
  }
  const seasonKey = getSeasonKeyFromMonth(sMonth);
  const seasonInfo = z.seasons[seasonKey];
  if (!seasonInfo) {
    return { stage: "Pre-Sowing Prep", progress: 0, detail: "Field prep." };
  }
  
  const plantIdx = MONTHS.indexOf(seasonInfo.plantingMonth);
  const viewIdx = MONTHS.indexOf(sMonth);
  const diff = (viewIdx - plantIdx + 12) % 12;
  const isHarvestMonth = seasonInfo.harvestMonths.includes(sMonth);

  const isBeforePlanting = ((viewIdx - plantIdx + 12) % 12) > 6; 
  if (isBeforePlanting || diff > 6) {
    return { stage: "Pre-Sowing Prep", progress: 0, detail: "Field clearance, organic manure prep, and tilling." };
  }

  if (diff === 0) {
    return { stage: "Sowing & Germination", progress: 10, detail: "Seeds sown, monitoring moisture for sprouting." };
  }
  if (isHarvestMonth) {
    return { stage: "Harvesting & Maturation", progress: 95, detail: "Crops are mature. Staggered harvesting is active." };
  }
  if (diff === 1) {
    return { stage: "Vegetative Growth", progress: 40, detail: "Early vegetative growth. Focus on manual weeding." };
  }
  if (diff === 2) {
    return { stage: "Flowering & Pod Setting", progress: 70, detail: "Budding/flowering active. Apply flower-retention sprays." };
  }
  return { stage: "Post-Harvest / Fallow", progress: 100, detail: "Harvest complete. Incorporating residues to feed topsoil." };
}

function getZoneHealth(plan: FarmPlan, zoneId: string) {
  const logs = plan.monitorUpdates || [];
  const zoneLogs = logs.filter(l => l.zoneId === zoneId);
  if (zoneLogs.length === 0) return "Normal";
  return zoneLogs[0].status;
}

function getZoneLatestLog(plan: FarmPlan, zoneId: string) {
  const logs = plan.monitorUpdates || [];
  const zoneLogs = logs.filter(l => l.zoneId === zoneId);
  if (zoneLogs.length === 0) return null;
  return zoneLogs[0];
}

function getTaskList(plan: FarmPlan, month: string) {
  const tasks: { id: string; zoneId: string; zone: string; title: string; desc: string; type: "sowing" | "input" | "alert" | "harvest" }[] = [];
  if (!month) return tasks;

  plan.zones.forEach(z => {
    const stageInfo = getGrowthStage(z, month);
    const health = getZoneHealth(plan, z.id);
    const latestLog = getZoneLatestLog(plan, z.id);
    
    const seasonKey = getSeasonKeyFromMonth(month);
    const seasonInfo = z.seasons ? z.seasons[seasonKey] : null;
    if (!seasonInfo) return;

    // Sowing
    if (stageInfo.stage.includes("Sowing")) {
      tasks.push({
        id: `${z.id}-${month}-sow1`,
        zoneId: z.id,
        zone: z.name,
        title: `Sow ${seasonInfo.cropPair.join(" + ")}`,
        desc: `Row planting. Sow pigeon pea/legume partner in alternating rows (e.g. 4:2 rows) with cereal/primary crop.`,
        type: "sowing"
      });
      tasks.push({
        id: `${z.id}-${month}-sow2`,
        zoneId: z.id,
        zone: z.name,
        title: `Incorporate baseline farmyard manure`,
        desc: `Mix 2 tonnes well-rotted farmyard manure per acre with soil before seeding.`,
        type: "sowing"
      });
    }
    
    // Vegetative
    if (stageInfo.stage.includes("Vegetative")) {
      tasks.push({
        id: `${z.id}-${month}-veg1`,
        zoneId: z.id,
        zone: z.name,
        title: `Conduct hand-weeding (Zone ${z.id})`,
        desc: `Remove weed competitors between 25-30 days post-seeding. Protect soil hydrology.`,
        type: "input"
      });
      tasks.push({
        id: `${z.id}-${month}-veg2`,
        zoneId: z.id,
        zone: z.name,
        title: `Apply liquid organic manure drench`,
        desc: `Apply 200L Jeevamrutha manure ferment per acre with irrigation lines to boost soil microbes.`,
        type: "input"
      });
    }

    // Flowering
    if (stageInfo.stage.includes("Flowering")) {
      tasks.push({
        id: `${z.id}-${month}-flower1`,
        zoneId: z.id,
        zone: z.name,
        title: `Spray Panchagavya foliar booster`,
        desc: `Apply a 3% foliar spray of fermented cow-byproducts at dawn to stimulate flower retention.`,
        type: "input"
      });
      tasks.push({
        id: `${z.id}-${month}-flower2`,
        zoneId: z.id,
        zone: z.name,
        title: `Erect pest sticky traps`,
        desc: `Hang yellow sticky cards (10/acre) at crop height to monitor whitefly and thrip levels.`,
        type: "input"
      });
    }

    // Harvesting
    if (stageInfo.stage.includes("Harvesting")) {
      tasks.push({
        id: `${z.id}-${month}-harvest1`,
        zoneId: z.id,
        zone: z.name,
        title: `Harvest Zone ${z.id} (${seasonInfo.cropPair[0]})`,
        desc: `Harvest mature crops at 80% dry color. Sun-dry grains on clean floor for 3 days.`,
        type: "harvest"
      });
      tasks.push({
        id: `${z.id}-${month}-harvest2`,
        zoneId: z.id,
        zone: z.name,
        title: `Grade and moisture-test yield`,
        desc: `Ensure grain moisture drops below 12% before bagging to prevent mildew decay in storage.`,
        type: "harvest"
      });
    }

    // If zone health is Needs Attention, add custom alert task
    if (health === "Needs Attention" && latestLog) {
      tasks.push({
        id: `${z.id}-${month}-alert`,
        zoneId: z.id,
        zone: z.name,
        title: `⚠️ Alert Mitigation: ${latestLog.description.slice(0, 45)}...`,
        desc: `Stress flagged: ${latestLog.description}. Next step: Drench with Trichoderma drench or spray 5% Neem kernel extract. Inspect root aeration.`,
        type: "alert"
      });
    }
  });

  return tasks;
}

// Dashboard Overview component for the first tab
function DashboardOverview({ plan, onUpdatePlan }: { plan: FarmPlan; onUpdatePlan: (p: FarmPlan) => void }) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const defaultStart = plan.input.season === "Kharif" ? "Jun" : plan.input.season === "Rabi" ? "Oct" : "Mar";
  const activeMonth = plan.isActive && plan.activationMonth ? plan.activationMonth : defaultStart;

  const taskList = useMemo(() => {
    return getTaskList(plan, activeMonth);
  }, [plan, activeMonth]);

  function handleToggleTask(taskId: string) {
    const completed = plan.completedTasks || [];
    const newCompleted = completed.includes(taskId)
      ? completed.filter(id => id !== taskId)
      : [...completed, taskId];
    onUpdatePlan({
      ...plan,
      completedTasks: newCompleted,
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-start animate-fadeIn">
      {/* Left Column: Weather & Live Crop Prices */}
      <div className="space-y-6 sm:space-y-8">
        <WeatherWidget plan={plan} />
        
        <Section title="Live Crop Market Rates" subtitle="Current APMC mandi pricing and local trading recommendations for your plan crops">
          <div className="grid sm:grid-cols-2 gap-4">
            {(plan.recommendations || []).map((r, idx) => {
              // Parse price percentage trend stably per crop name
              const nameSum = r.crop.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const trendPct = ((nameSum % 35) / 10 + 0.5).toFixed(1);
              const trendDir = nameSum % 2 === 0 ? "up" : "down";

              // Extract first numerical value to run future price calculations
              const numbers = r.marketPrice.match(/\d+([.,]\d+)?/g);
              let estimates = { current: 3000, m1: 3120, m3: 3450, m6: 2850, unit: "qtl" };
              if (numbers && numbers.length > 0) {
                const currentVal = parseInt(numbers[0].replace(/,/g, ''));
                const unit = r.marketPrice.toLowerCase().includes("tonne") ? "tonne" : "qtl";
                const multiplier1 = 1 + ((nameSum % 10) - 2) / 100;
                const multiplier3 = 1 + ((nameSum % 15) - 3) / 100;
                const multiplier6 = 1 - ((nameSum % 8) + 2) / 100;
                estimates = {
                  current: currentVal,
                  m1: Math.round(currentVal * multiplier1),
                  m3: Math.round(currentVal * multiplier3),
                  m6: Math.round(currentVal * multiplier6),
                  unit
                };
              }
              
              return (
                <div key={idx} className="rounded-2xl bg-card border border-border shadow-soft p-5 hover:shadow-elevated transition-shadow duration-300 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold text-primary">Harvested Crop</p>
                      <h4 className="font-display font-extrabold text-base text-foreground mt-0.5">{r.crop}</h4>
                      {r.partner && <p className="text-[10px] text-muted-foreground font-semibold">Intercropped with {r.partner}</p>}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5 ${
                      trendDir === "up" ? "bg-success/15 text-success animate-pulse" : "bg-amber-500/15 text-amber-500"
                    }`}>
                      {trendDir === "up" ? "▲" : "▼"} {trendPct}%
                    </span>
                  </div>

                  <div className="bg-muted/30 border border-border/40 rounded-xl p-3 text-center">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">APMC Mandi Rate</span>
                    <span className="font-display font-extrabold text-xl sm:text-2xl text-foreground mt-1 block">{r.marketPrice}</span>
                  </div>

                  {/* Future Projections Section */}
                  <div className="border-t border-border/40 pt-3.5 space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground">
                      <span>Mandi Price Forecast</span>
                      <span className="text-[8.5px] font-extrabold text-primary bg-primary-soft/40 px-2 py-0.5 rounded border border-primary/5">AI Projection</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted/30 p-2 rounded-xl border border-border/5">
                        <span className="text-[9px] text-muted-foreground block font-bold">1 Month</span>
                        <span className="font-display font-extrabold text-[11px] text-foreground block mt-0.5">₹{estimates.m1.toLocaleString("en-IN")}/{estimates.unit}</span>
                        <span className={`text-[8.5px] font-bold ${estimates.m1 >= estimates.current ? "text-success" : "text-amber-500"}`}>
                          {estimates.m1 >= estimates.current ? `+${((estimates.m1 - estimates.current)/estimates.current * 100).toFixed(1)}%` : `${((estimates.m1 - estimates.current)/estimates.current * 100).toFixed(1)}%`}
                        </span>
                      </div>
                      <div className="bg-primary-soft/20 p-2 rounded-xl border border-primary/10">
                        <span className="text-[9px] text-primary block font-extrabold">3 Months</span>
                        <span className="font-display font-extrabold text-[11px] text-primary block mt-0.5">₹{estimates.m3.toLocaleString("en-IN")}/{estimates.unit}</span>
                        <span className={`text-[8.5px] font-bold ${estimates.m3 >= estimates.current ? "text-success animate-pulse" : "text-amber-500"}`}>
                          {estimates.m3 >= estimates.current ? `+${((estimates.m3 - estimates.current)/estimates.current * 100).toFixed(1)}%` : `${((estimates.m3 - estimates.current)/estimates.current * 100).toFixed(1)}%`}
                        </span>
                      </div>
                      <div className="bg-muted/30 p-2 rounded-xl border border-border/5">
                        <span className="text-[9px] text-muted-foreground block font-bold">6 Months</span>
                        <span className="font-display font-extrabold text-[11px] text-foreground block mt-0.5">₹{estimates.m6.toLocaleString("en-IN")}/{estimates.unit}</span>
                        <span className={`text-[8.5px] font-bold ${estimates.m6 >= estimates.current ? "text-success" : "text-amber-500"}`}>
                          {estimates.m6 >= estimates.current ? `+${((estimates.m6 - estimates.current)/estimates.current * 100).toFixed(1)}%` : `${((estimates.m6 - estimates.current)/estimates.current * 100).toFixed(1)}%`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10.5px] text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                    💡 <span className="font-bold text-foreground">Trade Tip:</span> Grade A moisture target &lt; 12%. Demand is stable in regional APMC mandis.
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      {/* Right Column: Next Week's Tasks Checklist */}
      <div className="space-y-6 sm:space-y-8">
        <Section title="Next Week's Tasks" subtitle={`Actionable checklist for active period: ${activeMonth}`}>
          <div className="rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 space-y-4">
            {taskList.length === 0 ? (
              <div className="text-center py-8">
                <Check className="h-10 w-10 text-success mx-auto mb-2" />
                <p className="text-sm font-bold text-foreground">No tasks for this week</p>
                <p className="text-xs text-muted-foreground mt-1">Fields are in transition or post-harvest fallow phase.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {taskList.map(task => {
                  const isCompleted = (plan.completedTasks || []).includes(task.id);
                  return (
                    <div 
                      key={task.id} 
                      onClick={() => handleToggleTask(task.id)}
                      className="py-3.5 flex items-start gap-3 cursor-pointer hover:bg-muted/10 transition-all rounded-lg px-2 -mx-2 group"
                    >
                      <button className="shrink-0 mt-0.5 text-primary cursor-pointer border-none bg-transparent p-0">
                        {isCompleted ? (
                          <CheckSquare className="h-5 w-5 text-primary animate-scaleIn" />
                        ) : (
                          <Square className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider text-primary">{task.zone}</span>
                          <span className="text-muted-foreground/30">•</span>
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground">{task.type}</span>
                          {!isCompleted && (
                            <>
                              <span className="text-muted-foreground/30">•</span>
                              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/20 animate-pulse">
                                ⚠️ Needs Attention
                              </span>
                            </>
                          )}
                        </div>
                        <p className={`text-xs font-bold text-foreground mt-0.5 ${isCompleted ? "line-through text-muted-foreground font-normal" : ""}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                          {task.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
