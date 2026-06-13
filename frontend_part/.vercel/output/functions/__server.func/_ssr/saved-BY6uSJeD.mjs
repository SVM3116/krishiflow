import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { l as listPlans, d as deletePlan } from "./krishi-storage-jG_ojFAq.mjs";
import { s as supabase } from "./router-DCDgEq5b.mjs";
import { b as LoaderCircle, S as Sprout, A as ArrowRight, C as Calendar, M as MapPin, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function SavedPage() {
  const [plans, setPlans] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const nav = useNavigate();
  reactExports.useEffect(() => {
    if (!supabase) {
      setLoading(false);
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
            redirect: window.location.pathname
          }
        });
        return;
      }
      const localPlans = listPlans().filter((p) => p.user_id === session.user.id);
      setPlans(localPlans);
      supabase.from("farm_plans").select("plan_data").eq("user_id", session.user.id).order("created_at", {
        ascending: false
      }).limit(50).then(({
        data,
        error
      }) => {
        setLoading(false);
        if (error) {
          console.error("Error fetching plans from Supabase:", error);
          return;
        }
        if (data) {
          const remotePlans = data.map((d) => d.plan_data).filter(Boolean);
          setPlans(remotePlans);
        }
      }).catch(() => setLoading(false));
    });
  }, []);
  const handleDeletePlan = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      const success = await deletePlan(id);
      if (success) {
        setPlans((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete plan. Please try again.");
      }
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 text-primary animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-semibold", children: "Loading your workspace..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-primary font-bold", children: "Workspace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-extrabold text-foreground mt-1", children: "Saved plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
          plans.length,
          " ",
          plans.length === 1 ? "plan" : "plans",
          " saved in your library"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/analyze", className: "rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow", children: "+ Create plan" })
    ] }),
    plans.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-card p-16 text-center shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-12 w-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-lg", children: "No saved plans yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create your first optimization plan to see it here." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/analyze", className: "inline-flex items-center gap-1.5 mt-5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow", children: [
        "Analyze my farm ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: plans.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: () => nav({
      to: "/results",
      search: {
        id: p.id
      }
    }), className: "group rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5 cursor-pointer relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-muted-foreground mb-1 uppercase tracking-wider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors", children: p.input?.farmName || "Unnamed Farm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              p.input?.district || "Unknown",
              ", ",
              p.input?.state || ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-block rounded-full bg-success/10 text-success text-[10px] font-bold px-2.5 py-0.5 shrink-0 border border-success/25", children: [
            p.scores?.incomeStability || p.scores?.total_score || 0,
            " Score"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => handleDeletePlan(e, p.id), className: "h-7 w-7 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 grid place-items-center transition-all cursor-pointer shadow-sm shrink-0", title: "Delete this plan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-3 gap-1.5", children: (p.zones || []).map((z) => {
        const cropName = z.seasons ? z.seasons.kharif?.cropPair?.[0] || "Unknown" : z.cropPair?.[0] || z.cropPair || "Unknown";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted px-2 py-1.5 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase font-bold text-muted-foreground", children: z.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-foreground truncate", children: cropName })
        ] }, z.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Est. Annual Revenue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-primary text-sm", children: [
          "₹",
          ((p.totals?.annualRevenue || 0) / 1e3).toFixed(0),
          "k"
        ] })
      ] })
    ] }, p.id)) })
  ] });
}
export {
  SavedPage as component
};
