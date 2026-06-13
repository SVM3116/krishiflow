import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as STATES, K as KA_DISTRICTS, D as DEMO_INPUT, b as buildPlan } from "./krishi-engine-Ddy7-FOL.mjs";
import { a as setCurrentPlan, s as savePlan } from "./krishi-storage-jG_ojFAq.mjs";
import { s as supabase } from "./router-DCDgEq5b.mjs";
import { b as LoaderCircle, w as Sparkles, A as ArrowRight, S as Sprout, x as CircleCheck } from "../_libs/lucide-react.mjs";
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
const SOILS = [{
  v: "Red",
  colorClass: "bg-amber-800 border-amber-900",
  desc: "Iron-rich, well-drained"
}, {
  v: "Black Cotton",
  colorClass: "bg-neutral-900 border-neutral-950",
  desc: "Moisture retentive"
}, {
  v: "Loam",
  colorClass: "bg-amber-700 border-amber-800",
  desc: "Balanced, fertile"
}, {
  v: "Sandy",
  colorClass: "bg-yellow-100 border-yellow-300",
  desc: "Light, fast-draining"
}, {
  v: "Clay",
  colorClass: "bg-orange-600 border-orange-700",
  desc: "Heavy, slow-draining"
}];
function AnalyzePage() {
  const nav = useNavigate();
  const [session, setSession] = reactExports.useState(null);
  const [authLoading, setAuthLoading] = reactExports.useState(true);
  const [form, setForm] = reactExports.useState({
    farmName: "Manoj's Model Farm",
    landArea: 15,
    district: "Belagavi",
    state: "Karnataka",
    soilType: "Red",
    water: "Low",
    season: "Kharif",
    budget: 15e5
  });
  const [errors, setErrors] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({
      data: {
        session: session2
      }
    }) => {
      if (!session2) {
        nav({
          to: "/login",
          search: {
            redirect: window.location.pathname
          }
        });
      } else {
        setSession(session2);
        setAuthLoading(false);
      }
    });
  }, []);
  function set(k, v) {
    setForm((f) => ({
      ...f,
      [k]: v
    }));
    setErrors((e) => ({
      ...e,
      [k]: ""
    }));
  }
  function fillDemo() {
    setForm(DEMO_INPUT);
    setErrors({});
  }
  function validate() {
    const e = {};
    if (!form.farmName.trim()) e.farmName = "Please name your farm";
    if (form.landArea < 0.5 || form.landArea > 50) e.landArea = "Land area must be between 0.5 and 50 acres";
    if (!form.district) e.district = "Choose a district";
    if (!form.budget || form.budget < 1e3) e.budget = "Enter a realistic budget";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const base = "http://localhost:3001/api";
    let plan = null;
    {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4e3);
        const headers = {
          "Content-Type": "application/json"
        };
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
        const res = await fetch(`${base}/analyze`, {
          method: "POST",
          headers,
          body: JSON.stringify(form),
          signal: ctrl.signal
        });
        clearTimeout(t);
        if (res.ok) plan = await res.json();
      } catch {
      }
    }
    if (!plan) {
      await new Promise((r) => setTimeout(r, 2600));
      plan = buildPlan(form);
    }
    setCurrentPlan(plan);
    savePlan(plan);
    setLoading(false);
    nav({
      to: "/results",
      search: {
        id: plan.id
      }
    });
  }
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 text-primary animate-spin mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm font-semibold", children: "Verifying credentials..." })
    ] });
  }
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, { farmName: form.farmName });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-primary font-bold", children: "Assessment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl sm:text-4xl font-extrabold text-foreground mt-1", children: "Configure your farm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: fillDemo, className: "shrink-0 rounded-full border border-border bg-card hover:bg-muted text-foreground px-4 py-2 text-xs font-bold shadow-soft hover:shadow-elevated transition-all flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-accent-foreground" }),
        "Load demo scenario"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "rounded-3xl bg-card border border-border shadow-soft p-6 sm:p-8 space-y-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Farm name / identifier", error: errors.farmName, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.farmName, onChange: (e) => set("farmName", e.target.value), placeholder: "e.g. Ravi's Farm", className: inputCls }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { label: "Land area (acres)", error: errors.landArea, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 bg-muted/30 border border-border p-3.5 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 0.5, max: 50, step: 0.5, value: form.landArea, onChange: (e) => set("landArea", Number(e.target.value)), className: "flex-1 accent-[var(--color-primary)] cursor-pointer h-2 bg-muted rounded-lg" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-foreground text-sm bg-card border border-border px-3 py-1.5 rounded-lg shadow-soft min-w-[70px] text-center", children: [
              form.landArea,
              " ac"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-[10px] text-muted-foreground px-1 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "0.5 ac" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "25 ac" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "50 ac" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Working budget (₹)", error: errors.budget, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold", children: "₹" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1e3, step: 1e3, value: form.budget, onChange: (e) => set("budget", Number(e.target.value)), className: `${inputCls} pl-8` })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "State / Territory", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: form.state, onChange: (e) => set("state", e.target.value), className: inputCls, children: STATES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: s }, s)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "District / Region", error: errors.district, children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: form.district, onChange: (e) => set("district", e.target.value), className: inputCls, children: KA_DISTRICTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: d }, d)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Soil classification profile", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-2.5", children: SOILS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${form.soilType === s.v ? "border-primary bg-primary-soft shadow-soft" : "border-border bg-card hover:border-primary/50"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "soil", value: s.v, checked: form.soilType === s.v, onChange: () => set("soilType", s.v), className: "sr-only" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-6 w-6 rounded-full mx-auto mb-2 border-2 ${s.colorClass}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold text-foreground", children: s.v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-muted-foreground mt-1 leading-snug", children: s.desc })
      ] }, s.v)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-1 gap-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Water availability & irrigation", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SegmentedGroup, { value: form.water, options: ["Low", "Medium", "High"], onChange: (v) => set("water", v) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "w-full rounded-full bg-primary text-primary-foreground py-3.5 font-semibold shadow-soft hover:shadow-elevated hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5", children: [
        "Generate crop optimization plan ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
      ] })
    ] })
  ] });
}
const inputCls = "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all";
function Field({
  label,
  error,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2", children: label }),
    children,
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1.5", children: error })
  ] });
}
function SegmentedGroup({
  value,
  options,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-xl", children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onChange(o), className: `py-2 text-xs font-semibold rounded-lg transition-all ${value === o ? "bg-card text-foreground shadow-soft border border-border/10" : "text-muted-foreground hover:text-foreground"}`, children: o }, o)) });
}
function LoadingScreen({
  farmName
}) {
  const steps = ["Retrieving soil hydrology and regional climate records…", "Cross-referencing crop compatibility matrices…", "Running multi-zone crop yield optimization modeling…", "Verifying traditional agronomic heritage guidelines…", "Finalizing staggered sowing & harvest calendar…"];
  const [i, setI] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const id = setInterval(() => {
      setI((x) => x === steps.length - 1 ? x : x + 1);
    }, 500);
    return () => clearInterval(id);
  }, [steps.length]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/95 backdrop-blur-md grid place-items-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md w-full bg-card border border-border shadow-elevated rounded-3xl p-6 sm:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-16 w-16 mx-auto mb-4 bg-primary-soft rounded-2xl grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-8 w-8 text-primary animate-bounce" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl sm:text-2xl font-extrabold text-foreground", children: "Analyzing Farm Parameters" }),
      farmName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        "Generating configuration report for ",
        farmName
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3.5", children: steps.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      idx < i ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-success shrink-0" }) : idx === i ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 text-primary animate-spin shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 rounded-full border border-border shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${idx === i ? "text-foreground font-semibold" : idx < i ? "text-muted-foreground" : "text-muted-foreground/50"}`, children: step })
    ] }, idx)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Staggered Rotation Engine v2.4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono bg-muted px-2 py-1 rounded", children: "PROCESSING" })
    ] })
  ] }) });
}
export {
  AnalyzePage as component
};
