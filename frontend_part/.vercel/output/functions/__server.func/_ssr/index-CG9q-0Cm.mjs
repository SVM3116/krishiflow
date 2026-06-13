import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as ArrowRight, y as Map, l as BookOpen, C as Calendar } from "../_libs/lucide-react.mjs";
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
function Index() {
  const pillars = [{
    icon: Map,
    title: "Smart zone planning",
    desc: "Split your land into staggered crop zones so something is always growing — and always earning.",
    tint: "bg-primary-soft",
    text: "text-primary"
  }, {
    icon: BookOpen,
    title: "Traditional agronomy",
    desc: "Crop pairings and timing rooted in local heritage practices — pigeon pea + jowar, marigold borders, panchagavya cycles.",
    tint: "bg-accent-soft",
    text: "text-accent-foreground"
  }, {
    icon: Calendar,
    title: "Income calendar",
    desc: "A month-by-month revenue map that turns one harvest into a steady cash flow across all 12 months.",
    tint: "bg-success/15",
    text: "text-success"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden border-b border-border bg-gradient-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-primary-soft blur-3xl opacity-60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-accent-soft blur-3xl opacity-60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1.5 text-xs font-bold mb-5 border border-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" }),
            "Agronomic Planning Suite for Karnataka & Maharashtra"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground text-balance leading-[1.05]", children: [
            "From seasonal harvests to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary bg-primary-soft px-3 py-1 rounded-2xl inline-block mt-1 sm:mt-0", children: "continuous income" }),
            "."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed", children: "KrishiFlow Insights turns your agricultural land into a year-round crop-earning engine by combining heritage crop rotations with data-driven zone planning." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/analyze", className: "inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5", children: [
              "Analyze my farm ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/saved", className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors", children: "See saved plans" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center gap-6 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-2xl font-display font-extrabold text-foreground", children: "3.2x" }),
              "income smoothing"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-2xl font-display font-extrabold text-foreground", children: "88%" }),
              "avg. stability score"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-2xl font-display font-extrabold text-foreground", children: "100%" }),
              "traditional compliance"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-card shadow-elevated border border-border p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 border-b border-border pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground", children: "12-Month Staggered Projection" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-lg text-foreground", children: "Karnataka Pilot · 1 Acre Plan" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/10 text-success text-xs font-semibold px-2.5 py-1 border border-success/20", children: "+₹1.4L/yr expected" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-12 gap-1.5 items-end h-36", children: [5, 4, 6, 8, 3, 2, 4, 6, 18, 22, 28, 24].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group relative rounded-t-md bg-gradient-to-t from-primary to-primary/65 hover:to-primary transition-all duration-150", style: {
            height: `${h * 3}%`,
            minHeight: 6
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-foreground text-background text-[9px] font-bold rounded px-1.5 py-0.5 whitespace-nowrap shadow-soft", children: [
            "₹",
            h,
            "k"
          ] }) }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-12 gap-1.5 mt-2 text-[9px] font-semibold text-muted-foreground text-center", children: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.slice(0, 1) }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-3 gap-2", children: [{
            z: "A",
            c: "Jowar + Tur",
            m: "Sowing Jun",
            bg: "bg-primary-soft",
            fg: "text-primary"
          }, {
            z: "B",
            c: "Jowar + Tur",
            m: "Sowing Jul",
            bg: "bg-accent-soft",
            fg: "text-accent-foreground"
          }, {
            z: "C",
            c: "Tomato + Marigold",
            m: "Sowing Aug",
            bg: "bg-success/10",
            fg: "text-success"
          }].map((z) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl ${z.bg} p-3 border border-border/10`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-[9px] font-bold uppercase tracking-wider ${z.fg}`, children: [
              "Zone ",
              z.z
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-bold text-foreground mt-1 leading-tight", children: z.c }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: z.m })
          ] }, z.z)) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-2xl mx-auto mb-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-primary font-extrabold", children: "Agronomic Pillars" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-extrabold text-foreground mt-2", children: "Three pillars of continuous income" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-6", children: pillars.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-elevated hover:border-primary/20 transition-all duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-12 w-12 rounded-xl ${f.tint} grid place-items-center mb-5 group-hover:scale-110 transition-transform duration-200`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: `h-6 w-6 ${f.text}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground", children: f.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 leading-relaxed", children: f.desc })
      ] }, f.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl gradient-hero text-primary-foreground p-8 sm:p-12 shadow-elevated relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10", children: [{
        n: "12 Months",
        l: "Income cycle coverage"
      }, {
        n: "3 Zones",
        l: "Staggered sub-plots"
      }, {
        n: "88%",
        l: "Avg. revenue stability"
      }, {
        n: "₹1.4L+",
        l: "Est. revenue per acre"
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-extrabold text-3xl sm:text-5xl tracking-tight", children: s.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm opacity-85 mt-1", children: s.l })
      ] }, s.l)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl sm:text-4xl font-extrabold text-foreground", children: "Ready to optimize your farm?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-4 leading-relaxed max-w-xl mx-auto", children: "Fill in your soil profile, water levels, and budget to get a staggered multi-zone timeline, continuous calendar, and traditional practices guidelines." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/analyze", className: "inline-flex mt-8 items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3.5 text-sm font-semibold shadow-soft hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5", children: [
        "Start farm assessment ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4.5 w-4.5" })
      ] })
    ] })
  ] });
}
export {
  Index as component
};
