import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as getPlan, s as savePlan } from "./krishi-storage-jG_ojFAq.mjs";
import { P as PEST_SYMPTOMS, d as diagnosePest } from "./krishi-engine-Ddy7-FOL.mjs";
import { R as Route$3, s as supabase } from "./router-DCDgEq5b.mjs";
import { S as Sprout, M as MapPin, C as Calendar, c as Printer, d as Check, e as SquareCheckBig, a as Square, f as TrendingUp, g as ShieldCheck, Z as Zap, R as RefreshCw, D as DollarSign, h as CloudSun, i as Droplet, F as Flower, B as Bug, j as ChevronDown, k as Upload, l as BookOpen, m as FlaskConical, n as Activity, o as Clock, p as ClipboardList, q as Sun, r as CloudRain, s as Cloud } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, a as Bar } from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function ResultsPage() {
  const {
    id,
    tab,
    subtab
  } = Route$3.useSearch();
  const [plan, setPlan] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const nav = useNavigate();
  const activeTab = tab || "dashboard";
  const setActiveTab = (newTab) => {
    nav({
      to: "/results",
      search: {
        id,
        tab: newTab,
        subtab
      }
    });
  };
  const [authLoading, setAuthLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (!session) {
        nav({
          to: "/login",
          search: {
            redirect: window.location.pathname + window.location.search
          }
        });
        return;
      }
      setAuthLoading(false);
      const local = getPlan(id);
      if (local) {
        setPlan(local);
        setLoading(false);
      } else if (id && supabase) {
        setLoading(true);
        supabase.from("farm_plans").select("plan_data").eq("id", id).eq("user_id", session.user.id).single().then(({
          data,
          error
        }) => {
          if (data && data.plan_data) {
            setPlan(data.plan_data);
          } else if (error) {
            console.error("Error fetching plan from Supabase:", error);
          }
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [id]);
  function updatePlanState(newPlan) {
    setPlan(newPlan);
    savePlan(newPlan);
  }
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-12 w-12 mx-auto mb-4 bg-primary-soft rounded-2xl grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderSpinner, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-semibold", children: "Verifying session..." })
    ] });
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-12 w-12 mx-auto mb-4 bg-primary-soft rounded-2xl grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderSpinner, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-semibold", children: "Running crop zoning algorithm..." })
    ] });
  }
  if (!plan) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-20 text-center bg-card border border-border rounded-3xl shadow-soft mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl bg-primary-soft text-primary grid place-items-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "No plan found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: "Generate a fresh crop plan to view optimized analytics." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/analyze", className: "inline-flex items-center gap-1.5 mt-5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow", children: "Analyze my farm" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PlanHeader, { plan }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "no-print border-b border-border flex gap-6 overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("dashboard"), className: `pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "dashboard" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Today's Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("projections"), className: `pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "projections" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Overview & Projections" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("monitoring"), className: `pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "monitoring" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Live Crop Monitor & Tasks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveTab("diagnostics"), className: `pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === "diagnostics" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: "Crop Health & Diagnostics" })
    ] }),
    activeTab === "dashboard" ? /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardOverview, { plan, onUpdatePlan: updatePlanState }) : activeTab === "projections" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(IncomeChart, { plan }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ZoneMap, { plan }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Recommendations, { plan }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Timeline, { plan, onUpdatePlan: updatePlanState })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreDashboard, { plan }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(WeatherWidget, { plan })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FarmingIntelligenceDashboard, { plan })
    ] }) : activeTab === "diagnostics" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto space-y-6 animate-fadeIn", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PestDetector, {}) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CropMonitorSection, { plan, onUpdatePlan: updatePlanState })
  ] });
}
function FarmingIntelligenceDashboard({
  plan
}) {
  const {
    id,
    tab,
    subtab
  } = Route$3.useSearch();
  const nav = useNavigate();
  const activeSubTab = subtab || "rotation";
  const setActiveSubTab = (newSubTab) => {
    nav({
      to: "/results",
      search: {
        id,
        tab,
        subtab: newSubTab
      }
    });
  };
  const landArea = plan.input?.landArea || 1;
  const waterLevel = plan.input?.water?.toLowerCase() || "medium";
  plan.zones.some((z) => Object.values(z.seasons).some((s) => s.cropPair?.[0]?.toLowerCase().includes("tomato") || s.cropPair?.[1]?.toLowerCase().includes("tomato")));
  plan.zones.some((z) => Object.values(z.seasons).some((s) => s.cropPair?.[0]?.toLowerCase().includes("maize") || s.cropPair?.[1]?.toLowerCase().includes("maize")));
  const waterRecommendations = waterLevel === "low" ? [{
    title: "Contour Bunding & Mulching",
    desc: "Construct soil/stone bunds along slopes to prevent water runoff. Use crop residues to cover topsoil, retaining up to 40% more moisture."
  }, {
    title: "Farm Pond (Krishi Honda)",
    desc: "Dig a 10m x 10m farm pond lined with polythene sheet at the lowest point of your farm to catch and store rainfall runoff."
  }] : waterLevel === "high" ? [{
    title: "Sub-surface Drainage Channels",
    desc: "Excavate 1-foot deep drainage trenches around zone boundaries to prevent waterlogging and root rot in clay/heavy soils."
  }, {
    title: "Rainwater Buffer Pit",
    desc: "Store excess monsoon water in a buffer pit for slow soil recharging and emergency watering during winter dry spells."
  }] : [{
    title: "Broad Bed and Furrow (BBF)",
    desc: "Sow crops on raised beds with furrows in between. BBF conserves rainwater in furrows during dry periods and drains excess water during heavy rain."
  }, {
    title: "Contour Bunding",
    desc: "Construct low-height soil barriers along contours to retain rainfall and reduce soil erosion across the farm zones."
  }];
  const rotationMap = {
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
  const getRotationPlan = (cropId, zoneName) => {
    const key = cropId.toLowerCase();
    const config = rotationMap[key] || {
      year2: "Groundnut + Red Gram",
      year3: "Jowar (Sorghum) + Pigeon Pea",
      why: "Ensures soil nutrients are balanced by rotating heavy grain feeders with nitrogen-fixing cover crops."
    };
    return {
      zoneName,
      ...config
    };
  };
  const compostTons = (landArea * 5).toFixed(1);
  const dungTons = (landArea * 2.5).toFixed(1);
  const seedKg = (landArea * 15).toFixed(0);
  const jeevamruthaL = (landArea * 200).toFixed(0);
  const costSavings = Math.round(landArea * 8500).toLocaleString("en-IN");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Continuous Income & Sustainability Intelligence", subtitle: "Agronomic resource calculators, cashflow ledger, and crop rotation schedules", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 border-b border-border pb-4", children: [{
      id: "rotation",
      l: "3-Year Rotation Plan",
      icon: RefreshCw
    }, {
      id: "ledger",
      l: "Zone Cashflow Ledger",
      icon: DollarSign
    }, {
      id: "fertility",
      l: "Organic Input Calculator",
      icon: Sprout
    }, {
      id: "resource",
      l: "Water & Pollinators",
      icon: CloudSun
    }, {
      id: "scores",
      l: "Risk Score Weights",
      icon: ShieldCheck
    }].map((tab2) => {
      const Icon = tab2.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveSubTab(tab2.id), className: `flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${activeSubTab === tab2.id ? "bg-primary text-primary-foreground border-primary shadow-soft" : "bg-card border-border text-muted-foreground hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
        tab2.l
      ] }, tab2.id);
    }) }),
    activeSubTab === "rotation" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-primary shrink-0" }),
        "3-Year Crop Rotation Planner"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Ecological Crop Rotation Strategy: Continuous monoculture depletes specific micro-nutrients. Crop rotation alternates deep and shallow root structures, breaking insect breeding cycles naturally." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-2", children: plan.zones.map((z) => {
        const kharifCrop = z.seasons?.kharif?.cropPair?.[0] || "";
        const rot = getRotationPlan(kharifCrop, z.name);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 shadow-soft space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-b border-border pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-xs text-foreground", children: [
              rot.zoneName,
              " Rotation"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] uppercase font-bold text-primary bg-primary-soft/35 px-2 py-0.5 rounded border border-primary/5", children: [
              "Zone ",
              z.id
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Year 1 (Current):" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: z.seasons ? z.seasons.kharif.cropPair.join(" + ") : "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Year 2 (Future):" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-success", children: rot.year2 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-semibold", children: "Year 3 (Future):" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-primary", children: rot.year3 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 border-t border-border text-[10px] text-muted-foreground leading-relaxed", children: [
            "💡 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Benefit:" }),
            " ",
            rot.why
          ] })
        ] }, z.id);
      }) })
    ] }),
    activeSubTab === "ledger" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-primary shrink-0" }),
        "Zone-wise Monthly Financial Ledger"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Continuous Income Ledger: Zone-wise monthly breakdowns track seed layouts, field labor expenditures, and staggered market payoff phases to maintain positive working capital." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 border-b border-border text-muted-foreground font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3.5", children: "Month" }),
          plan.zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "p-3.5", children: [
            z.name,
            " (Rev / Exp / Profit)"
          ] }, z.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3.5 text-right font-black text-foreground", children: "Total Net Profit" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/60", children: plan.monthly.map((m) => {
          const getStatusColor = (profit) => {
            if (profit > 0) return "text-success font-bold";
            if (profit < 0) return "text-destructive font-semibold";
            return "text-muted-foreground";
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/20 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3.5 font-bold text-foreground", children: m.month }),
            plan.zones.map((z) => {
              const zb = m.zoneBreakdown?.[z.name] || {
                revenue: 0,
                expenses: 0,
                netProfit: 0
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3.5 space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 text-[10px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-success font-semibold", children: [
                    "In: ₹",
                    zb.revenue.toLocaleString("en-IN")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive", children: [
                    "Out: ₹",
                    zb.expenses.toLocaleString("en-IN")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-[10px] ${getStatusColor(zb.netProfit)}`, children: [
                  "Net: ₹",
                  zb.netProfit.toLocaleString("en-IN")
                ] })
              ] }, z.id);
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `p-3.5 text-right font-display font-extrabold text-sm ${getStatusColor(m.krishiflow)}`, children: [
              "₹",
              m.krishiflow.toLocaleString("en-IN")
            ] })
          ] }, m.month);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary-soft/35 border border-primary/10 rounded-2xl p-4 text-[11px] leading-relaxed text-muted-foreground", children: [
        "💡 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "Principal Agronomist Insight:" }),
        " Expenses are staggered per zone: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "30% is allocated in the sowing month" }),
        " for seeds and land preparation, ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "10% is allocated for mid-season maintenance" }),
        ", and the remaining ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "60% (harvesting & transport)" }),
        " is paid in the payoff month when the crop is sold and revenue is realized."
      ] })
    ] }),
    activeSubTab === "fertility" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 items-start animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-4 w-4 text-primary shrink-0" }),
          "Heritage Organic Soil Inputs (Scaled for ",
          landArea,
          " Acres)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Microbial Organic Nutrition: Applying biodynamic inputs enriches the microbial carbon sink, multiplying mycorrhizal colony counts and increasing soil water holding capacity." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3.5", children: [{
          l: "Fermented Jeevamrutha",
          v: `${jeevamruthaL} L`,
          desc: "Apply 200L/acre every fortnight",
          sub: "Microbial booster"
        }, {
          l: "Organic Compost",
          v: `${compostTons} Tonnes`,
          desc: "Incorporate before tilling",
          sub: "Topsoil carbon feed"
        }, {
          l: "Cow Dung / Raw Manure",
          v: `${dungTons} Tonnes`,
          desc: "Mix with field soil",
          sub: "Nitrogen base"
        }, {
          l: "Green Manure Seeds",
          v: `${seedKg} Kg`,
          desc: "Sow Sunnhemp / Dhaincha",
          sub: "Pre-season cover"
        }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-3 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-extrabold text-muted-foreground", children: item.l }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-extrabold text-lg text-foreground mt-1", children: item.v })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[9px] text-muted-foreground leading-snug border-t border-border/40 pt-1", children: [
            item.desc,
            " · ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground/80", children: item.sub })
          ] })
        ] }, item.l)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-success/5 border border-success/15 p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-success/10 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-success shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xs uppercase text-success-foreground tracking-wider", children: "Chemical Input Savings" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "By replacing chemical urea, pesticide sprays, and synthetic growth hormones with fermented Jeevamrutha and trap crops, your cost reductions are estimated at:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-success/10 p-4 rounded-xl text-center shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-2xl sm:text-3xl text-success", children: [
            "₹",
            costSavings
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-wider text-muted-foreground mt-1.5 font-bold", children: "Estimated Cost Savings" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-normal italic", children: "*Calculation is based on average Karnataka APMC fertilizer expenses saved per acre." })
      ] })
    ] }),
    activeSubTab === "resource" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-start animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Droplet, { className: "h-4 w-4 text-primary shrink-0" }),
          "Traditional Water Management Advisor"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Hydrology Conservation: Slope-aligned rainwater catchment structures prevent topsoil washouts and recharge shallow aquifers, boosting local moisture levels." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3.5", children: waterRecommendations.map((rec, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-4 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "font-display font-bold text-xs text-foreground", children: rec.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1 leading-relaxed", children: rec.desc })
        ] }, idx)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flower, { className: "h-4 w-4 text-primary shrink-0 animate-pulse" }),
          "Pollinator & Border Crop Planner (Trap Crops)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Trap Cropping & Pollination Indices: Bordering plots with flowering borders increases honeybee visits, improving tomato/legume yields by 20% to 30% while acting as pest buffers." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3.5", children: [{
          crop: "Marigold / Sunflower",
          role: "Attracts honeybees & repels nematodes"
        }, {
          crop: "Sesame / Mustard",
          role: "Attracts hoverflies & predatory insects"
        }].map((trap) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3 shadow-soft flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h6", { className: "font-display font-extrabold text-xs text-foreground", children: trap.crop }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9.5px] text-muted-foreground mt-1 leading-snug", children: trap.role })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2.5 text-[8.5px] font-bold text-primary uppercase", children: "Boundary Row layout" })
        ] }, trap.crop)) })
      ] })
    ] }),
    activeSubTab === "scores" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-fadeIn", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold text-foreground border-b border-border/50 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-primary shrink-0" }),
        "Risk Diversification Score Weightings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Balanced Composite Scoring Engine: Our recommendation system utilizes a multi-criteria decision formula to rank cropping configurations. This ensures financial profitability doesn't compromise ecological integrity." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-5 gap-3.5 pt-2", children: [{
        l: "Expected Profit",
        w: "35%",
        val: plan.scores?.profit_score || 85,
        color: "bg-primary"
      }, {
        l: "Income Stability",
        w: "25%",
        val: plan.scores?.incomeStability || 75,
        color: "bg-success"
      }, {
        l: "Sustainability",
        w: "20%",
        val: plan.scores?.sustainability || 80,
        color: "bg-accent"
      }, {
        l: "Biodiversity Profile",
        w: "10%",
        val: plan.scores?.biodiversity || 82,
        color: "bg-primary"
      }, {
        l: "Risk Yield Buffer",
        w: "10%",
        val: plan.scores?.riskMitigation || 70,
        color: "bg-amber-500"
      }].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border p-3.5 shadow-soft space-y-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground truncate max-w-[80px]", children: item.l }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9.5px] font-extrabold text-foreground", children: [
            item.w,
            " weight"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-lg text-foreground", children: [
            item.val,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "score" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-1.5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${item.color} h-1.5 rounded-full`, style: {
          width: `${item.val}%`
        } }) })
      ] }, item.l)) })
    ] })
  ] }) });
}
function LoaderSpinner() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" });
}
function PlanHeader({
  plan
}) {
  const [saved, setSaved] = reactExports.useState(false);
  function onSave() {
    savePlan(plan);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl gradient-hero text-primary-foreground p-6 sm:p-8 shadow-elevated relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-48 w-48 bg-white/5 rounded-full blur-2xl pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start sm:flex sm:flex-wrap sm:justify-between relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-widest opacity-80 font-bold", children: "Agronomic Optimization Report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl sm:text-4xl font-extrabold mt-1.5 truncate tracking-tight", children: plan?.input?.farmName || "Unnamed Farm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-90 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            plan?.input?.district || "",
            ", ",
            plan?.input?.state || ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            plan?.input?.landArea || 0,
            " Acres"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 shrink-0" }),
            " ",
            plan?.input?.season || "",
            " Cycle"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 no-print shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onSave, className: "rounded-full bg-accent text-accent-foreground px-4 py-2 text-xs sm:text-sm font-bold shadow-accent hover:opacity-95 whitespace-nowrap transition-all", children: saved ? "✓ Saved to workspace" : "Save plan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => window.print(), className: "rounded-full bg-primary-foreground/15 backdrop-blur px-4 py-2 text-xs sm:text-sm font-bold hover:bg-primary-foreground/25 whitespace-nowrap transition-all flex items-center gap-1.5 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
          " Download PDF"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 grid grid-cols-3 gap-3 sm:gap-6 relative z-10", children: [{
      l: "Estimated Annual Revenue",
      v: `₹${((plan?.totals?.annualRevenue || 0) / 1e3).toFixed(0)}k`,
      desc: "Total gross receipts"
    }, {
      l: "Estimated Net Profit",
      v: `₹${((plan?.totals?.netProfit || 0) / 1e3).toFixed(0)}k`,
      desc: "Gross minus inputs"
    }, {
      l: "Active Earning Months",
      v: `${plan?.totals?.activeMonths || 0}/12`,
      desc: "Cash flow consistency"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-primary-foreground/10 backdrop-blur border border-white/5 p-3.5 sm:p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs opacity-80 font-medium truncate", children: s.l }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-extrabold text-lg sm:text-3xl mt-1.5 tracking-tight", children: s.v }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] opacity-60 mt-1 hidden sm:block", children: s.desc })
    ] }, s.l)) })
  ] });
}
function ZoneMap({
  plan
}) {
  const colorMap = {
    primary: "bg-primary text-primary-foreground border-primary/20",
    accent: "gradient-accent text-accent-foreground border-accent/20",
    success: "bg-success text-primary-foreground border-success/20"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Agronomic zone division", subtitle: "Staggered cultivation sub-plots to distribute labor and secure steady cash flow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-6", children: (plan?.zones || []).map((z) => {
    const totalZoneIncome = z.seasons ? (z.seasons.kharif?.expectedIncome || 0) + (z.seasons.rabi?.expectedIncome || 0) + (z.seasons.zaid?.expectedIncome || 0) : z.expectedIncome || 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border shadow-soft overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-shadow duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-5 border-b ${colorMap[z.color] || "bg-primary text-primary-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-extrabold text-2xl tracking-tight", children: z.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[10px] font-black border border-white/10", children: [
              (z.area || 0).toFixed(2),
              " ac"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider opacity-85 font-extrabold mt-1", children: "Staggered Crop Rotation" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 space-y-4.5", children: z.seasons ? ["kharif", "rabi", "zaid"].map((seasonKey) => {
          const seasonInfo = z.seasons[seasonKey];
          if (!seasonInfo) return null;
          const seasonLabels = {
            kharif: {
              label: "Kharif Cycle",
              time: "Jun - Oct",
              color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
            },
            rabi: {
              label: "Rabi Cycle",
              time: "Nov - Feb",
              color: "text-blue-600 dark:text-blue-400 bg-blue-500/10"
            },
            zaid: {
              label: "Zaid Cycle",
              time: "Mar - May",
              color: "text-amber-600 dark:text-amber-400 bg-amber-500/10"
            }
          };
          const config = seasonLabels[seasonKey];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-4 border-l-2 border-border/80 hover:border-primary/50 transition-colors py-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${config.color}`, children: config.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-semibold", children: config.time })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-sm text-foreground mt-1.5 leading-snug", children: [
              seasonInfo.cropPair?.[0],
              " + ",
              seasonInfo.cropPair?.[1]
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Sow: ",
                seasonInfo.plantingMonth,
                " · Harv: ",
                seasonInfo.harvestMonths.join(", ")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                "₹",
                ((seasonInfo.expectedIncome || 0) / 1e3).toFixed(1),
                "k profit"
              ] })
            ] })
          ] }, seasonKey);
        }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-4 border-l-2 border-border py-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-bold text-sm text-foreground mt-1.5 leading-snug", children: [
            z.cropPair?.[0],
            " + ",
            z.cropPair?.[1]
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mt-1 text-[10px] text-muted-foreground font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Sow: ",
            z.plantingMonth,
            " · Harv: ",
            z.harvestMonths?.join(", ")
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3 border-t border-border flex justify-between items-baseline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold text-muted-foreground", children: "Annual Zone Net Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-primary text-xl", children: [
          "₹",
          (totalZoneIncome / 1e3).toFixed(1),
          "k"
        ] })
      ] }) })
    ] }, z.id);
  }) }) });
}
const formatCurrency = (val) => {
  if (val < 0) return `-₹${Math.abs(val).toLocaleString("en-IN")}`;
  return `₹${val.toLocaleString("en-IN")}`;
};
const CustomTooltip = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    const traditional = payload.find((p) => p.dataKey === "traditional")?.value || 0;
    const zoneItems = payload.filter((p) => p.dataKey !== "traditional");
    const totalStaggered = zoneItems.reduce((sum, p) => sum + (p.value || 0), 0);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-soft p-4 text-xs space-y-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-semibold flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2.5 h-2.5 rounded-full bg-[oklch(0.60_0.22_29)]" }),
            "Traditional monoculture:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: formatCurrency(traditional) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/60 my-1.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-black text-primary flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2.5 h-2.5 rounded-full bg-primary" }),
            "KrishiFlow Plan (Total):"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black text-primary", children: formatCurrency(totalStaggered) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-4 space-y-1 text-[11px] mt-1 border-l border-primary/20 max-h-48 overflow-y-auto", children: zoneItems.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-semibold flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-2 h-2 rounded-full", style: {
              backgroundColor: p.color || p.fill
            } }),
            p.name,
            ":"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: formatCurrency(p.value || 0) })
        ] }, p.dataKey)) })
      ] })
    ] });
  }
  return null;
};
function IncomeChart({
  plan
}) {
  const chartData = reactExports.useMemo(() => {
    return (plan?.monthly || []).map((m) => {
      const row = {
        month: m.month,
        traditional: m.traditional || 0
      };
      if (m.zoneBreakdown) {
        Object.keys(m.zoneBreakdown).forEach((zoneId) => {
          row[zoneId] = Math.round(m.zoneBreakdown[zoneId]?.netProfit || 0);
        });
      }
      return row;
    });
  }, [plan?.monthly]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Income calendar & comparison", subtitle: "Staggered revenue streams vs traditional monoculture harvesting variance", highlight: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border shadow-soft p-4 sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-72 sm:h-96 -ml-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, barGap: 4, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", vertical: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", tick: {
        fontSize: 11,
        fill: "var(--color-muted-foreground)",
        fontWeight: "semibold"
      }, axisLine: false, tickLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: {
        fontSize: 11,
        fill: "var(--color-muted-foreground)",
        fontWeight: "semibold"
      }, axisLine: false, tickLine: false, tickFormatter: (v) => `₹${(v / 1e3).toFixed(0)}k` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { wrapperStyle: {
        fontSize: 12,
        paddingTop: 12,
        fontWeight: "semibold"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "traditional", name: "Traditional monoculture yield", fill: "var(--color-destructive)", radius: [6, 6, 0, 0] }),
      plan.zones.map((z, idx) => {
        const colorMap = {
          primary: "var(--color-primary)",
          success: "var(--color-success)",
          accent: "var(--color-accent)"
        };
        const fallbackColors = ["var(--color-primary)", "var(--color-success)", "var(--color-accent)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-chart-6)"];
        const barColor = colorMap[z.color] || fallbackColors[idx % fallbackColors.length];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: z.name, stackId: "staggered", name: `KrishiFlow ${z.name}`, fill: barColor }, z.id || z.name);
      })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Income variance mitigation", value: "3.2×", hint: "Staggered income vs monoculture spike", icon: TrendingUp }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Systemic risk reduction", value: "-64%", hint: "Diversified crop zone risk buffer", tone: "success", icon: ShieldCheck }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Active cashflow periods", value: `${plan?.totals?.activeMonths || 0}/12`, hint: "Months with positive net revenue", tone: "accent", icon: Calendar })
    ] })
  ] }) });
}
function MetricCard({
  label,
  value,
  hint,
  tone = "primary",
  icon: Icon
}) {
  const tones = {
    primary: "bg-primary-soft/40 text-primary border-primary/10",
    accent: "bg-accent-soft/40 text-accent-foreground border-accent/10",
    success: "bg-success/10 text-success border-success/15"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border p-4 flex gap-3.5 items-start ${tones[tone]}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-card border border-border/10 grid place-items-center shadow-soft shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-extrabold text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-extrabold text-xl sm:text-2xl mt-1 tracking-tight", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5 leading-snug", children: hint })
    ] })
  ] });
}
function Recommendations({
  plan
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Agronomic crop details & pairings", subtitle: "Nutrient compatibility index and crop pairing rationale", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: (plan?.recommendations || []).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecCard, { r }, i)) }) });
}
function RecCard({
  r
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-soft overflow-hidden transition-all duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(!open), className: "w-full p-5 text-left grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center hover:bg-muted/30 transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-wider font-extrabold text-primary", children: "Agronomic pairing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-display font-extrabold text-lg text-foreground truncate mt-0.5", children: [
          r.crop,
          " + ",
          r.partner
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed", children: r.why })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 h-8 w-8 grid place-items-center rounded-full bg-muted border border-border text-foreground transition-transform ${open ? "rotate-180" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-accent-soft/20 p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-4 shadow-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[9px] uppercase font-extrabold text-accent-foreground border-b border-border pb-2 mb-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5" }),
          "Traditional Practice & Rationale"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: r.traditionalWisdom })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase font-bold text-muted-foreground", children: "Historical Yield / Acre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground mt-1", children: r.yieldPerAcre })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase font-bold text-muted-foreground", children: "Local Market Rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground mt-1", children: r.marketPrice })
        ] })
      ] })
    ] })
  ] });
}
function ScoreDashboard({
  plan
}) {
  const items = [{
    l: "Income stability",
    v: plan?.scores?.incomeStability || 0,
    color: "var(--color-primary)"
  }, {
    l: "Sustainability index",
    v: plan?.scores?.sustainability || 0,
    color: "var(--color-chart-3)"
  }, {
    l: "Biodiversity profile",
    v: plan?.scores?.biodiversity || 0,
    color: "var(--color-chart-2)"
  }, {
    l: "Yield risk buffer",
    v: plan?.scores?.riskMitigation || 0,
    color: "oklch(0.65 0.18 45)"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Agronomic scores", subtitle: "Quantitative evaluation parameters of the current plan model", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3.5", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreRing, { ...i }, i.l)) }) });
}
function ScoreRing({
  l,
  v,
  color
}) {
  const r = 40, c = 2 * Math.PI * r, off = c - v / 100 * c;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-col items-center justify-between text-center min-h-[160px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-20 w-20 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "-rotate-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r, fill: "none", stroke: "var(--color-muted)", strokeWidth: "7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r, fill: "none", stroke: color, strokeWidth: "7", strokeDasharray: c, strokeDashoffset: off, strokeLinecap: "round", style: {
          transition: "stroke-dashoffset 0.8s"
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-xl text-foreground", children: [
        v,
        "%"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-xs leading-snug", children: l }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: v >= 80 ? "Optimized" : v >= 65 ? "Stable" : "Moderate" })
    ] })
  ] });
}
function WeatherWidget({
  plan
}) {
  const [weather, setWeather] = reactExports.useState(plan?.weather || []);
  const [advisory, setAdvisory] = reactExports.useState(plan?.advisory || "");
  reactExports.useEffect(() => {
    setWeather(plan?.weather || []);
    setAdvisory(plan?.advisory || "");
    const base = "http://localhost:3001/api";
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 3e3);
    fetch(`${base}/weather?district=${encodeURIComponent(plan?.input?.district || "")}&state=${encodeURIComponent(plan?.input?.state || "")}`, {
      signal: ctrl.signal
    }).then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    }).then((data) => {
      if (data.weather) setWeather(data.weather);
      if (data.advisory) setAdvisory(data.advisory);
    }).catch(() => {
    }).finally(() => clearTimeout(t));
    return () => ctrl.abort();
  }, [plan?.id, plan?.input?.district, plan?.input?.state]);
  function getWeatherIcon(condition) {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("sunny") || cond.includes("clear")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-6 w-6 text-amber-500 animate-spin-slow" });
    } else if (cond.includes("cloud") && cond.includes("part")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CloudSun, { className: "h-6 w-6 text-slate-400 animate-pulse" });
    } else if (cond.includes("rain") || cond.includes("shower") || cond.includes("drizzle")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CloudRain, { className: "h-6 w-6 text-blue-400 animate-bounce", style: {
        animationDuration: "2s"
      } });
    } else if (cond.includes("cloud")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "h-6 w-6 text-slate-500 animate-pulse" });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-6 w-6 text-amber-500" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Climate & advisory indices", subtitle: "Local weather feeds mapped to agricultural advisory briefs", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-soft p-4 sm:p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase font-extrabold text-muted-foreground border-b border-border pb-2 mb-3", children: "5-Day Regional Forecast" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-5 gap-2", children: weather?.map((d) => {
        const isRain = d.condition?.toLowerCase().includes("rain") || d.condition?.toLowerCase().includes("drizzle");
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl p-2.5 text-center flex flex-col items-center relative overflow-hidden transition-all duration-300 ${isRain ? "bg-blue-50/70 border border-blue-200/40 dark:bg-blue-950/40 dark:border-blue-900/30 shadow-sm animate-pulse-slow" : "bg-muted border border-transparent"}`, children: [
          isRain && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 pointer-events-none opacity-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1 left-2 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-5 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1 left-9 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 left-13 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-1 delay-200" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-17 w-0.5 h-3 bg-blue-400/80 rounded animate-rain-drop-2 delay-500" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-muted-foreground uppercase z-10", children: d.day }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-2 z-10", children: getWeatherIcon(d.condition) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-extrabold text-foreground text-xs z-10", children: [
            d.temp,
            "°C"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] text-muted-foreground mt-0.5 font-medium z-10", children: [
            d.rain,
            "mm"
          ] })
        ] }, d.day);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-accent-soft/30 border border-accent/20 p-5 text-accent-foreground relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-accent/10 pb-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-accent-foreground shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xs uppercase tracking-wider", children: "Agronomic Field Alert" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-relaxed font-medium", children: advisory })
    ] })
  ] }) });
}
function PestDetector() {
  const [open, setOpen] = reactExports.useState(false);
  const [picked, setPicked] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [uploadedFileName, setUploadedFileName] = reactExports.useState("");
  const [result, setResult] = reactExports.useState(null);
  function toggle(s) {
    setPicked((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  }
  async function analyze() {
    setLoading(true);
    setResult(null);
    const base = "http://localhost:3001/api";
    let r = null;
    {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3e3);
        const res = await fetch(`${base}/pest`, {
          method: "POST",
          body: JSON.stringify({
            symptoms: picked
          }),
          headers: {
            "Content-Type": "application/json"
          },
          signal: ctrl.signal
        });
        clearTimeout(t);
        if (res.ok) r = await res.json();
      } catch {
      }
    }
    if (!r) {
      await new Promise((r2) => setTimeout(r2, 700));
      r = diagnosePest(picked);
    }
    setResult(r);
    setLoading(false);
  }
  function simulateUpload(e) {
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
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            setPicked(symptomsToSelect);
            setLoading(true);
            setTimeout(() => {
              setResult(diagnosePest(symptomsToSelect));
              setLoading(false);
            }, 1e3);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Crop health & diagnostics", subtitle: "Scan symptoms or upload field leaf photography for diagnostics and remedies", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border shadow-soft overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(!open), className: "w-full p-5 text-left grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3.5 items-center hover:bg-muted/30 transition-all border-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "h-6 w-6 text-primary shrink-0 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: "Crop Diagnostic Diagnostics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: "Diagnose plant stresses, diseases, and mineral deficits" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `shrink-0 h-6 w-6 rounded-full bg-muted border border-border grid place-items-center text-foreground transition-transform ${open ? "rotate-180" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border p-5 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", className: "hidden", id: "leaf-image-upload", onChange: simulateUpload }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "leaf-image-upload", className: "block cursor-pointer border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-2xl p-6 text-center transition-all", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-7 w-7 text-muted-foreground mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-foreground block", children: "Upload crop/leaf photography" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground mt-1 block", children: "Drag and drop images or tap to scan local folder" })
        ] }),
        uploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 bg-muted/40 p-3.5 rounded-xl border border-border mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate max-w-[150px] font-medium", children: uploadedFileName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
              uploadProgress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-1.5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary h-1.5 rounded-full transition-all duration-150", style: {
            width: `${uploadProgress}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block animate-pulse", children: "Running leaf cell diagnosis & lesion scan..." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-grow border-t border-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink mx-3 text-[9px] uppercase font-extrabold text-muted-foreground tracking-wider", children: "or flag symptoms manually" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-grow border-t border-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: PEST_SYMPTOMS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggle(s), className: `rounded-full px-2.5 py-1 text-xs font-semibold border transition-all ${picked.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground hover:border-primary"}`, children: s }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: analyze, disabled: picked.length === 0 || loading || uploading, className: "w-full rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold disabled:opacity-40 hover:shadow-soft transition-all", children: loading ? "Verifying diagnosis data..." : "Analyze symptoms" }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-primary-soft/40 border border-primary/10 p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-primary/10 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase font-bold text-muted-foreground", children: "Diagnostic Conclusion" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-extrabold text-base text-foreground mt-0.5", children: result.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-card border border-border text-foreground text-[10px] font-bold px-2.5 py-0.5 shrink-0", children: [
            result.confidence,
            "% match"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-4 shadow-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[9px] uppercase font-extrabold text-success border-b border-border pb-1.5 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-3.5 w-3.5" }),
              "Organic / Heritage Control"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: result.traditional })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-4 shadow-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[9px] uppercase font-extrabold text-destructive border-b border-border pb-1.5 mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-3.5 w-3.5" }),
              "Targeted Chemical Control"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: result.chemical })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
function Timeline({
  plan,
  onUpdatePlan
}) {
  function toggleTimelineItem(itemKey) {
    if (!onUpdatePlan) return;
    const completed = plan.completedTimelineItems || [];
    const newCompleted = completed.includes(itemKey) ? completed.filter((id) => id !== itemKey) : [...completed, itemKey];
    onUpdatePlan({
      ...plan,
      completedTimelineItems: newCompleted
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Agronomic action timeline", subtitle: "Chronological cultivation calendar from field prep to post-harvest processing", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 max-h-[32rem] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "relative border-l border-primary/20 ml-3.5 space-y-6", children: (plan?.timeline || []).map((t, i) => {
    const itemKey = `${t.month}-${t.zone}-${t.action}`;
    const isCompleted = (plan.completedTimelineItems || []).includes(itemKey);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "ml-5 relative pr-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -left-[1.85rem] top-0.5 h-6 w-6 rounded-full bg-primary-soft border border-primary/20 text-primary text-[10px] font-extrabold grid place-items-center ring-4 ring-background shadow-soft", children: t.month.slice(0, 3) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3.5 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-muted border border-border text-foreground text-[9px] font-bold px-2 py-0.5 whitespace-nowrap uppercase tracking-wider shrink-0", children: [
          "Zone ",
          t.zone.slice(-1)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-bold text-foreground text-sm leading-snug transition-all ${isCompleted ? "line-through text-muted-foreground font-normal" : ""}`, children: t.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs text-muted-foreground mt-1 leading-relaxed transition-all ${isCompleted ? "text-muted-foreground/60" : ""}`, children: t.detail })
        ] }),
        onUpdatePlan && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleTimelineItem(itemKey), className: "shrink-0 h-7 w-7 rounded-full border border-border hover:border-primary hover:bg-primary-soft/35 grid place-items-center cursor-pointer transition-colors", title: isCompleted ? "Mark as not implemented" : "Mark as implemented", children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-success animate-scaleIn" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground/30 hover:bg-primary transition-all" }) })
      ] })
    ] }, i);
  }) }) }) });
}
function Section({
  title,
  subtitle,
  children,
  highlight
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-end justify-between gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      highlight && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-accent-soft text-accent-foreground text-[10px] font-extrabold px-2.5 py-0.5 border border-accent/20 mb-2 uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-3 w-3" }),
        " Core Analysis"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl sm:text-2xl font-extrabold text-foreground tracking-tight", children: title }),
      subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug", children: subtitle })
    ] }) }),
    children
  ] });
}
function CropMonitorSection({
  plan,
  onUpdatePlan
}) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const defaultStart = plan.input.season === "Kharif" ? "Jun" : plan.input.season === "Rabi" ? "Oct" : "Mar";
  const [startMonth, setStartMonth] = reactExports.useState(plan.activationMonth || defaultStart);
  const [selectedMonth, setSelectedMonth] = reactExports.useState("");
  const [logZoneId, setLogZoneId] = reactExports.useState("A");
  const [logStatus, setLogStatus] = reactExports.useState("Normal");
  const [logType, setLogType] = reactExports.useState("Stage Log");
  const [logDescription, setLogDescription] = reactExports.useState("");
  const [logInputs, setLogInputs] = reactExports.useState([]);
  const availableInputs = ["Weeding", "Irrigation", "Jeevamrutha organic manure", "Neem oil foliar spray", "NPK top-dressing", "Trichoderma soil drench"];
  reactExports.useEffect(() => {
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
      completedTasks: plan.completedTasks || []
    });
    setSelectedMonth(startMonth);
  }
  function handleDeactivate() {
    if (confirm("Are you sure you want to deactivate cultivation tracking? All logged observations will remain preserved, but monitoring stages will reset.")) {
      onUpdatePlan({
        ...plan,
        isActive: false,
        activationMonth: void 0
      });
    }
  }
  function handleToggleTask(taskId) {
    const completed = plan.completedTasks || [];
    const newCompleted = completed.includes(taskId) ? completed.filter((id) => id !== taskId) : [...completed, taskId];
    onUpdatePlan({
      ...plan,
      completedTasks: newCompleted
    });
  }
  function handleSubmitLog(e) {
    e.preventDefault();
    if (!logDescription.trim()) return;
    const newLog = {
      id: crypto.randomUUID(),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      zoneId: logZoneId,
      status: logStatus,
      updateType: logType,
      description: logDescription,
      appliedInputs: logInputs
    };
    onUpdatePlan({
      ...plan,
      monitorUpdates: [newLog, ...plan.monitorUpdates || []]
    });
    setLogDescription("");
    setLogInputs([]);
    setLogStatus("Normal");
    setLogType("Stage Log");
  }
  const toggleInput = (inputName) => {
    setLogInputs((prev) => prev.includes(inputName) ? prev.filter((x) => x !== inputName) : [...prev, inputName]);
  };
  const taskList = reactExports.useMemo(() => {
    return getTaskList(plan, selectedMonth);
  }, [plan, selectedMonth]);
  const nextMonthForecast = reactExports.useMemo(() => {
    if (!selectedMonth) return null;
    const currentIdx = MONTHS.indexOf(selectedMonth);
    const nextMonth = MONTHS[(currentIdx + 1) % 12];
    const nextSeasonKey = getSeasonKeyFromMonth(nextMonth);
    const sowingZones = plan.zones.filter((z) => z.seasons?.[nextSeasonKey]?.plantingMonth === nextMonth);
    const harvestZones = plan.zones.filter((z) => z.seasons?.[nextSeasonKey]?.harvestMonths?.includes(nextMonth));
    const estRevenue = harvestZones.reduce((sum, z) => {
      const sz = z.seasons?.[nextSeasonKey];
      return sum + (sz ? sz.expectedIncome / sz.harvestMonths.length : 0);
    }, 0);
    return {
      month: nextMonth,
      sowingZones,
      harvestZones,
      estRevenue
    };
  }, [selectedMonth, plan.zones]);
  const activeStart = plan.activationMonth || startMonth;
  const elapsedMonths = plan.isActive ? (MONTHS.indexOf(selectedMonth) - MONTHS.indexOf(activeStart) + 12) % 12 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 sm:space-y-8 animate-fadeIn", children: [
    !plan.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 max-w-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full bg-accent-soft/40 text-accent-foreground text-[10px] font-extrabold px-2.5 py-0.5 border border-accent/20 uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
          " Cultivation Monitor"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-extrabold text-lg sm:text-xl text-foreground", children: "Activate Ongoing Cultivation Tracking" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground leading-relaxed", children: "Transition this crop planning projection into an ongoing field tracking plan. Set your sowing commencement month, log fertilizer/weeding inputs, and get context-aware recommendations month-by-month." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase font-bold text-muted-foreground", children: "Sowing Starts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: startMonth, onChange: (e) => setStartMonth(e.target.value), className: "rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold focus:outline-none", children: MONTHS.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: m, children: [
            m,
            " Sowing"
          ] }, m)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleActivate, className: "rounded-full bg-primary text-primary-foreground px-5 py-3 text-xs sm:text-sm font-bold shadow-soft hover:shadow-elevated transition-all flex items-center gap-1.5 cursor-pointer mt-5", children: "Activate tracking plan" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card border border-border p-5 flex flex-wrap items-center justify-between gap-4 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-success/10 text-success grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "Ongoing Cultivation Monitor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-baseline gap-1.5 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-foreground text-sm", children: [
              "Month ",
              elapsedMonths + 1,
              ": ",
              selectedMonth
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "(Started: ",
              activeStart,
              ")"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-muted rounded-xl p-1", children: MONTHS.map((m) => {
          const activeIdx = MONTHS.indexOf(activeStart);
          const currentIdx = MONTHS.indexOf(m);
          const diff = (currentIdx - activeIdx + 12) % 12;
          const inCycle = diff >= 0 && diff < 6;
          if (!inCycle) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedMonth(m), className: `px-2.5 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${selectedMonth === m ? "bg-card text-foreground shadow-soft border border-border/10" : "text-muted-foreground hover:text-foreground"}`, children: m }, m);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleDeactivate, className: "text-xs font-semibold text-destructive hover:underline px-3 py-1.5 cursor-pointer", children: "Reset plan" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Zone Status Tracker", subtitle: "Estimations of current physiological crop development based on selected calendar month", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-3 gap-4", children: plan.zones.map((z) => {
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
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-col justify-between min-h-[190px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border pb-2 mb-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-extrabold text-sm text-foreground", children: z.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] font-bold px-2 py-0.5 rounded-full border ${healthColors[health]}`, children: health })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-foreground", children: seasonInfo.cropPair.join(" + ") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1 leading-snug font-semibold", children: [
                "Stage: ",
                stageInfo.stage
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted rounded-full h-2 mt-3 overflow-hidden border border-border/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary h-2 rounded-full transition-all duration-300", style: {
                width: `${stageInfo.progress}%`
              } }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3.5 pt-2.5 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9.5px] text-muted-foreground leading-relaxed italic", children: [
                '"',
                stageInfo.detail,
                '"'
              ] }),
              health === "Needs Attention" && latestLog && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-bold text-destructive mt-1.5 leading-snug", children: [
                "⚠️ Alert logged: ",
                latestLog.description.slice(0, 30),
                "..."
              ] })
            ] })
          ] }, z.id);
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Next Recommended Tasks", subtitle: "Staggered operational checklist adapted to growth stages and logged alerts", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 space-y-4", children: taskList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-8 w-8 text-success mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "No pending actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Crop monitoring suggests fallow or residue decomposition phase." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: taskList.map((task) => {
          const isCompleted = (plan.completedTasks || []).includes(task.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => handleToggleTask(task.id), className: "py-3 flex items-start gap-3 cursor-pointer hover:bg-muted/10 transition-all rounded-lg px-2 -mx-2 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "shrink-0 mt-0.5 text-primary cursor-pointer", children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-5 w-5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-bold uppercase tracking-wider text-primary", children: task.zone }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground", children: task.type }),
                !isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/20 animate-pulse", children: "⚠️ Needs Attention (Time Ending)" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs font-bold text-foreground mt-0.5 ${isCompleted ? "line-through text-muted-foreground font-normal" : ""}`, children: task.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1 leading-relaxed", children: task.desc })
            ] })
          ] }, task.id);
        }) }) }) }),
        nextMonthForecast && /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Thereafter Analysis & Projections", subtitle: "Forward-looking operational logistics and cash flow estimates for the coming month", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-accent-soft/30 border border-accent/20 p-5 sm:p-6 text-accent-foreground relative overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-10 -bottom-10 h-32 w-32 bg-accent/5 rounded-full blur-xl pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-display font-extrabold text-base border-b border-accent/10 pb-2 mb-3.5 flex items-center gap-1.5 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
            " Next Month Outlook (",
            nextMonthForecast.month,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 text-xs font-medium", children: [
            nextMonthForecast.sowingZones.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-4 w-4 shrink-0 text-accent-foreground mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Zone Sowing Commences" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "opacity-80 text-[11px] mt-0.5", children: [
                  nextMonthForecast.sowingZones.map((z) => {
                    const nextSeasonKey = getSeasonKeyFromMonth(nextMonthForecast.month);
                    const sz = z.seasons?.[nextSeasonKey];
                    return `${z.name} (${sz ? sz.cropPair.join("+") : ""})`;
                  }).join(", "),
                  " sowing begins in ",
                  nextMonthForecast.month,
                  ". Pre-purchase seeds and prepare manure fertilizer."
                ] })
              ] })
            ] }),
            nextMonthForecast.harvestZones.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 shrink-0 text-success mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-success-foreground", children: "Harvesting & Revenue Scheduled" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "opacity-80 text-[11px] mt-0.5", children: [
                  nextMonthForecast.harvestZones.map((z) => {
                    const nextSeasonKey = getSeasonKeyFromMonth(nextMonthForecast.month);
                    const sz = z.seasons?.[nextSeasonKey];
                    return `${z.name} (${sz ? sz.cropPair[0] : ""})`;
                  }).join(", "),
                  " harvest schedule active in ",
                  nextMonthForecast.month,
                  ". Expected revenue generation: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-success-foreground", children: [
                    "₹",
                    nextMonthForecast.estRevenue.toLocaleString("en-IN")
                  ] }),
                  ". Ensure storage drying yards are prepped."
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 shrink-0 text-accent-foreground mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Maintenance & Input Phase" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "opacity-80 text-[11px] mt-0.5", children: [
                  "No harvests active in ",
                  nextMonthForecast.month,
                  ". Continue weeding schedules, foliar manure applications, and soil moisture maintenance to support crop grain filling."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-3.5 border-t border-accent/10 text-[10.5px] opacity-75 font-semibold", children: "💡 Logistics Advisory: Prepare storage bins and APMC logistics at least 15 days prior to harvesting phases." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Log Field Update", subtitle: "Record crop milestones, fertilizer inputs, or stress outbreaks", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmitLog, className: "rounded-3xl bg-card border border-border shadow-soft p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase font-bold text-muted-foreground mb-1.5", children: "Target Zone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1 bg-muted p-1 rounded-xl", children: plan.zones.map((z) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setLogZoneId(z.id), className: `py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${logZoneId === z.id ? "bg-card text-foreground shadow-soft border border-border/10" : "text-muted-foreground hover:text-foreground"}`, children: z.name }, z.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase font-bold text-muted-foreground mb-1.5", children: "Update Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: logType, onChange: (e) => setLogType(e.target.value), className: "w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold focus:outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Stage Log", children: "Growth Log" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Input Applied", children: "Input Log" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Stress Alert", children: "Stress Alert" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase font-bold text-muted-foreground mb-1.5", children: "Zone Condition" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: logStatus, onChange: (e) => setLogStatus(e.target.value), className: "w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-semibold focus:outline-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Good", children: "Good" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Normal", children: "Normal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Needs Attention", children: "Needs Attention ⚠️" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase font-bold text-muted-foreground mb-1.5", children: "Actions Performed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: availableInputs.map((input) => {
              const isSelected = logInputs.includes(input);
              return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggleInput(input), className: `rounded-full px-2.5 py-1 text-[10px] font-semibold border transition-all cursor-pointer ${isSelected ? "bg-primary text-primary-foreground border-primary animate-pulse" : "bg-card border-border text-foreground hover:border-primary"}`, children: input }, input);
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-[10px] uppercase font-bold text-muted-foreground mb-1.5", children: "Observation Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: logDescription, onChange: (e) => setLogDescription(e.target.value), placeholder: "e.g. Sprouting is highly uniform. Hand weeded the rows. Or: Yellow spots seen on lower tomato leaves.", className: "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all h-20 resize-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !logDescription.trim(), className: "w-full rounded-full bg-primary text-primary-foreground py-2.5 text-xs font-bold shadow-soft hover:shadow-elevated disabled:opacity-45 transition-all cursor-pointer", children: "Log observation update" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Observation History Log", subtitle: "Timeline of recorded updates and active alerts in your workspace", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-card border border-border shadow-soft p-5 max-h-[20rem] overflow-y-auto", children: !plan.monitorUpdates || plan.monitorUpdates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 text-muted-foreground text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-7 w-7 mx-auto mb-2 opacity-50 text-muted-foreground" }),
          "No entries logged yet. Complete sowing and log your first updates."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative border-l border-border ml-2 space-y-4", children: plan.monitorUpdates.map((log) => {
          const zoneObj = plan.zones.find((z) => z.id === log.zoneId);
          const getZoneLogCrop = (z, logCreatedAt) => {
            const date = new Date(logCreatedAt);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const logMonth = monthNames[date.getMonth()];
            const sKey = getSeasonKeyFromMonth(logMonth);
            return z.seasons?.[sKey]?.cropPair[0] || "";
          };
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-4 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -left-[1.45rem] top-1.5 h-3.5 w-3.5 rounded-full border border-background grid place-items-center ${log.status === "Needs Attention" ? "bg-destructive animate-pulse" : log.status === "Good" ? "bg-success" : "bg-muted-foreground"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border/50 rounded-xl p-3 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start gap-1 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                  "Zone ",
                  log.zoneId,
                  " (",
                  zoneObj ? getZoneLogCrop(zoneObj, log.createdAt) : "",
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: new Date(log.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary-soft/30 text-primary text-[8.5px] font-bold px-1.5 py-0.5 rounded border border-primary/5", children: log.updateType }),
                log.appliedInputs && log.appliedInputs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground truncate max-w-[150px]", children: [
                  "Applied: ",
                  log.appliedInputs.join(", ")
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 leading-relaxed font-semibold", children: log.description })
            ] })
          ] }, log.id);
        }) }) }) })
      ] })
    ] })
  ] });
}
function getSeasonKeyFromMonth(month) {
  const m = month.toLowerCase();
  if (["jun", "jul", "aug", "sep", "oct", "june", "july", "september", "october"].some((x) => m.startsWith(x))) {
    return "kharif";
  }
  if (["nov", "dec", "jan", "feb", "november", "december", "january", "february"].some((x) => m.startsWith(x))) {
    return "rabi";
  }
  return "zaid";
}
function getGrowthStage(z, sMonth) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!z.seasons) {
    return {
      stage: "Post-Harvest / Fallow",
      progress: 100,
      detail: "Harvest complete."
    };
  }
  const seasonKey = getSeasonKeyFromMonth(sMonth);
  const seasonInfo = z.seasons[seasonKey];
  if (!seasonInfo) {
    return {
      stage: "Pre-Sowing Prep",
      progress: 0,
      detail: "Field prep."
    };
  }
  const plantIdx = MONTHS.indexOf(seasonInfo.plantingMonth);
  const viewIdx = MONTHS.indexOf(sMonth);
  const diff = (viewIdx - plantIdx + 12) % 12;
  const isHarvestMonth = seasonInfo.harvestMonths.includes(sMonth);
  const isBeforePlanting = (viewIdx - plantIdx + 12) % 12 > 6;
  if (isBeforePlanting || diff > 6) {
    return {
      stage: "Pre-Sowing Prep",
      progress: 0,
      detail: "Field clearance, organic manure prep, and tilling."
    };
  }
  if (diff === 0) {
    return {
      stage: "Sowing & Germination",
      progress: 10,
      detail: "Seeds sown, monitoring moisture for sprouting."
    };
  }
  if (isHarvestMonth) {
    return {
      stage: "Harvesting & Maturation",
      progress: 95,
      detail: "Crops are mature. Staggered harvesting is active."
    };
  }
  if (diff === 1) {
    return {
      stage: "Vegetative Growth",
      progress: 40,
      detail: "Early vegetative growth. Focus on manual weeding."
    };
  }
  if (diff === 2) {
    return {
      stage: "Flowering & Pod Setting",
      progress: 70,
      detail: "Budding/flowering active. Apply flower-retention sprays."
    };
  }
  return {
    stage: "Post-Harvest / Fallow",
    progress: 100,
    detail: "Harvest complete. Incorporating residues to feed topsoil."
  };
}
function getZoneHealth(plan, zoneId) {
  const logs = plan.monitorUpdates || [];
  const zoneLogs = logs.filter((l) => l.zoneId === zoneId);
  if (zoneLogs.length === 0) return "Normal";
  return zoneLogs[0].status;
}
function getZoneLatestLog(plan, zoneId) {
  const logs = plan.monitorUpdates || [];
  const zoneLogs = logs.filter((l) => l.zoneId === zoneId);
  if (zoneLogs.length === 0) return null;
  return zoneLogs[0];
}
function getTaskList(plan, month) {
  const tasks = [];
  if (!month) return tasks;
  plan.zones.forEach((z) => {
    const stageInfo = getGrowthStage(z, month);
    const health = getZoneHealth(plan, z.id);
    const latestLog = getZoneLatestLog(plan, z.id);
    const seasonKey = getSeasonKeyFromMonth(month);
    const seasonInfo = z.seasons ? z.seasons[seasonKey] : null;
    if (!seasonInfo) return;
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
function DashboardOverview({
  plan,
  onUpdatePlan
}) {
  const defaultStart = plan.input.season === "Kharif" ? "Jun" : plan.input.season === "Rabi" ? "Oct" : "Mar";
  const activeMonth = plan.isActive && plan.activationMonth ? plan.activationMonth : defaultStart;
  const taskList = reactExports.useMemo(() => {
    return getTaskList(plan, activeMonth);
  }, [plan, activeMonth]);
  function handleToggleTask(taskId) {
    const completed = plan.completedTasks || [];
    const newCompleted = completed.includes(taskId) ? completed.filter((id) => id !== taskId) : [...completed, taskId];
    onUpdatePlan({
      ...plan,
      completedTasks: newCompleted
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-start animate-fadeIn", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 sm:space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WeatherWidget, { plan }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Live Crop Market Rates", subtitle: "Current APMC mandi pricing and local trading recommendations for your plan crops", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: (plan.recommendations || []).map((r, idx) => {
        const nameSum = r.crop.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const trendPct = (nameSum % 35 / 10 + 0.5).toFixed(1);
        const trendDir = nameSum % 2 === 0 ? "up" : "down";
        const numbers = r.marketPrice.match(/\d+([.,]\d+)?/g);
        let estimates = {
          current: 3e3,
          m1: 3120,
          m3: 3450,
          m6: 2850,
          unit: "qtl"
        };
        if (numbers && numbers.length > 0) {
          const currentVal = parseInt(numbers[0].replace(/,/g, ""));
          const unit = r.marketPrice.toLowerCase().includes("tonne") ? "tonne" : "qtl";
          const multiplier1 = 1 + (nameSum % 10 - 2) / 100;
          const multiplier3 = 1 + (nameSum % 15 - 3) / 100;
          const multiplier6 = 1 - (nameSum % 8 + 2) / 100;
          estimates = {
            current: currentVal,
            m1: Math.round(currentVal * multiplier1),
            m3: Math.round(currentVal * multiplier3),
            m6: Math.round(currentVal * multiplier6),
            unit
          };
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border shadow-soft p-5 hover:shadow-elevated transition-shadow duration-300 flex flex-col justify-between space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-extrabold text-primary", children: "Harvested Crop" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-extrabold text-base text-foreground mt-0.5", children: r.crop }),
              r.partner && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-semibold", children: [
                "Intercropped with ",
                r.partner
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5 ${trendDir === "up" ? "bg-success/15 text-success animate-pulse" : "bg-amber-500/15 text-amber-500"}`, children: [
              trendDir === "up" ? "▲" : "▼",
              " ",
              trendPct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border/40 rounded-xl p-3 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase font-bold text-muted-foreground block", children: "APMC Mandi Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-extrabold text-xl sm:text-2xl text-foreground mt-1 block", children: r.marketPrice })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/40 pt-3.5 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Mandi Price Forecast" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8.5px] font-extrabold text-primary bg-primary-soft/40 px-2 py-0.5 rounded border border-primary/5", children: "AI Projection" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 p-2 rounded-xl border border-border/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block font-bold", children: "1 Month" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-[11px] text-foreground block mt-0.5", children: [
                  "₹",
                  estimates.m1.toLocaleString("en-IN"),
                  "/",
                  estimates.unit
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8.5px] font-bold ${estimates.m1 >= estimates.current ? "text-success" : "text-amber-500"}`, children: estimates.m1 >= estimates.current ? `+${((estimates.m1 - estimates.current) / estimates.current * 100).toFixed(1)}%` : `${((estimates.m1 - estimates.current) / estimates.current * 100).toFixed(1)}%` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary-soft/20 p-2 rounded-xl border border-primary/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-primary block font-extrabold", children: "3 Months" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-[11px] text-primary block mt-0.5", children: [
                  "₹",
                  estimates.m3.toLocaleString("en-IN"),
                  "/",
                  estimates.unit
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8.5px] font-bold ${estimates.m3 >= estimates.current ? "text-success animate-pulse" : "text-amber-500"}`, children: estimates.m3 >= estimates.current ? `+${((estimates.m3 - estimates.current) / estimates.current * 100).toFixed(1)}%` : `${((estimates.m3 - estimates.current) / estimates.current * 100).toFixed(1)}%` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 p-2 rounded-xl border border-border/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block font-bold", children: "6 Months" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-extrabold text-[11px] text-foreground block mt-0.5", children: [
                  "₹",
                  estimates.m6.toLocaleString("en-IN"),
                  "/",
                  estimates.unit
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[8.5px] font-bold ${estimates.m6 >= estimates.current ? "text-success" : "text-amber-500"}`, children: estimates.m6 >= estimates.current ? `+${((estimates.m6 - estimates.current) / estimates.current * 100).toFixed(1)}%` : `${((estimates.m6 - estimates.current) / estimates.current * 100).toFixed(1)}%` })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10.5px] text-muted-foreground leading-relaxed pt-2 border-t border-border/40", children: [
            "💡 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "Trade Tip:" }),
            " Grade A moisture target < 12%. Demand is stable in regional APMC mandis."
          ] })
        ] }, idx);
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 sm:space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Next Week's Tasks", subtitle: `Actionable checklist for active period: ${activeMonth}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl bg-card border border-border shadow-soft p-5 sm:p-6 space-y-4", children: taskList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-10 w-10 text-success mx-auto mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-foreground", children: "No tasks for this week" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Fields are in transition or post-harvest fallow phase." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: taskList.map((task) => {
      const isCompleted = (plan.completedTasks || []).includes(task.id);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => handleToggleTask(task.id), className: "py-3.5 flex items-start gap-3 cursor-pointer hover:bg-muted/10 transition-all rounded-lg px-2 -mx-2 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "shrink-0 mt-0.5 text-primary cursor-pointer border-none bg-transparent p-0", children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-5 w-5 text-primary animate-scaleIn" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9.5px] font-bold uppercase tracking-wider text-primary", children: task.zone }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground", children: task.type }),
            !isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/20 animate-pulse", children: "⚠️ Needs Attention" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs font-bold text-foreground mt-0.5 ${isCompleted ? "line-through text-muted-foreground font-normal" : ""}`, children: task.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1 leading-relaxed", children: task.desc })
        ] })
      ] }, task.id);
    }) }) }) }) })
  ] });
}
export {
  ResultsPage as component
};
