import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DEMO_INPUT, KA_DISTRICTS, STATES, buildPlan } from "../lib/krishi-engine";
import { setCurrentPlan, savePlan } from "../lib/krishi-storage";
import type { FarmInput, SoilType, Water, Season } from "../lib/krishi-types";
import { Sparkles, Sprout, ArrowRight, CheckCircle2, Loader2, HelpCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/analyze")({
  head: () => ({ meta: [{ title: "Farm Assessment — KrishiFlow Insights" }] }),
  component: AnalyzePage,
});

const SOILS: { v: SoilType; colorClass: string; desc: string }[] = [
  { v: "Red", colorClass: "bg-amber-800 border-amber-900", desc: "Iron-rich, well-drained" },
  { v: "Black Cotton", colorClass: "bg-neutral-900 border-neutral-950", desc: "Moisture retentive" },
  { v: "Loam", colorClass: "bg-amber-700 border-amber-800", desc: "Balanced, fertile" },
  { v: "Sandy", colorClass: "bg-yellow-100 border-yellow-300", desc: "Light, fast-draining" },
  { v: "Clay", colorClass: "bg-orange-600 border-orange-700", desc: "Heavy, slow-draining" },
];

function AnalyzePage() {
  const nav = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [form, setForm] = useState<FarmInput>({
    farmName: "Manoj's Model Farm", landArea: 15, district: "Belagavi", state: "Karnataka",
    soilType: "Red", water: "Low", season: "Kharif", budget: 1500000,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        nav({ to: "/login", search: { redirect: window.location.pathname } });
      } else {
        setSession(session);
        setAuthLoading(false);
      }
    });
  }, []);

  function set<K extends keyof FarmInput>(k: K, v: FarmInput[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  function fillDemo() {
    setForm(DEMO_INPUT);
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.farmName.trim()) e.farmName = "Please name your farm";
    if (form.landArea < 0.5 || form.landArea > 50) e.landArea = "Land area must be between 0.5 and 50 acres";
    if (!form.district) e.district = "Choose a district";
    if (!form.budget || form.budget < 1000) e.budget = "Enter a realistic budget";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulated backend call w/ graceful fallback
    const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
    let plan = null;
    if (base) {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 4000);
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
        const res = await fetch(`${base}/analyze`, {
          method: "POST", headers,
          body: JSON.stringify(form), signal: ctrl.signal,
        });
        clearTimeout(t);
        if (res.ok) plan = await res.json();
      } catch {/* fallback */}
    }
    if (!plan) {
      await new Promise(r => setTimeout(r, 2600)); // slightly longer for realistic loading feeling
      plan = buildPlan(form);
    }
    setCurrentPlan(plan);
    savePlan(plan);
    setLoading(false);
    nav({ to: "/results", search: { id: plan.id } });
  }

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm font-semibold">Verifying credentials...</p>
      </div>
    );
  }

  if (loading) return <LoadingScreen farmName={form.farmName} />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Assessment</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground mt-1">Configure your farm</h1>
        </div>
        <button type="button" onClick={fillDemo}
          className="shrink-0 rounded-full border border-border bg-card hover:bg-muted text-foreground px-4 py-2 text-xs font-bold shadow-soft hover:shadow-elevated transition-all flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
          Load demo scenario
        </button>
      </div>

      <form onSubmit={onSubmit} className="rounded-3xl bg-card border border-border shadow-soft p-6 sm:p-8 space-y-7">
        <Field label="Farm name / identifier" error={errors.farmName}>
          <input value={form.farmName} onChange={e => set("farmName", e.target.value)}
            placeholder="e.g. Ravi's Farm" className={inputCls} />
        </Field>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Land area (acres)" error={errors.landArea}>
            <div className="flex items-center gap-4 bg-muted/30 border border-border p-3.5 rounded-xl">
              <input type="range" min={0.5} max={50} step={0.5} value={form.landArea}
                onChange={e => set("landArea", Number(e.target.value))}
                className="flex-1 accent-[var(--color-primary)] cursor-pointer h-2 bg-muted rounded-lg" />
              <span className="font-display font-bold text-foreground text-sm bg-card border border-border px-3 py-1.5 rounded-lg shadow-soft min-w-[70px] text-center">
                {form.landArea} ac
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground px-1 mt-1">
              <span>0.5 ac</span><span>25 ac</span><span>50 ac</span>
            </div>
          </Field>
          <Field label="Working budget (₹)" error={errors.budget}>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
              <input type="number" min={1000} step={1000} value={form.budget}
                onChange={e => set("budget", Number(e.target.value))} className={`${inputCls} pl-8`} />
            </div>
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="State / Territory">
            <select value={form.state} onChange={e => set("state", e.target.value)} className={inputCls}>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="District / Region" error={errors.district}>
            <select value={form.district} onChange={e => set("district", e.target.value)} className={inputCls}>
              {KA_DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Soil classification profile">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {SOILS.map(s => (
              <label key={s.v} className={`cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${form.soilType === s.v ? "border-primary bg-primary-soft shadow-soft" : "border-border bg-card hover:border-primary/50"}`}>
                <input type="radio" name="soil" value={s.v} checked={form.soilType === s.v}
                  onChange={() => set("soilType", s.v)} className="sr-only" />
                <div className={`h-6 w-6 rounded-full mx-auto mb-2 border-2 ${s.colorClass}`} />
                <div className="text-xs font-bold text-foreground">{s.v}</div>
                <div className="text-[10px] text-muted-foreground mt-1 leading-snug">{s.desc}</div>
              </label>
            ))}
          </div>
        </Field>

        <div className="grid sm:grid-cols-1 gap-5">
          <Field label="Water availability & irrigation">
            <SegmentedGroup value={form.water} options={["Low","Medium","High"] as Water[]} onChange={v => set("water", v)} />
          </Field>
        </div>

        <button type="submit"
          className="w-full rounded-full bg-primary text-primary-foreground py-3.5 font-semibold shadow-soft hover:shadow-elevated hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5">
          Generate crop optimization plan <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
    </div>
  );
}

function SegmentedGroup<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-xl">
      {options.map(o => (
        <button type="button" key={o} onClick={() => onChange(o)}
          className={`py-2 text-xs font-semibold rounded-lg transition-all ${value === o ? "bg-card text-foreground shadow-soft border border-border/10" : "text-muted-foreground hover:text-foreground"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function LoadingScreen({ farmName }: { farmName: string }) {
  const steps = [
    "Retrieving soil hydrology and regional climate records…",
    "Cross-referencing crop compatibility matrices…",
    "Running multi-zone crop yield optimization modeling…",
    "Verifying traditional agronomic heritage guidelines…",
    "Finalizing staggered sowing & harvest calendar…",
  ];
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI(x => (x === steps.length - 1 ? x : x + 1));
    }, 500);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md grid place-items-center px-4">
      <div className="max-w-md w-full bg-card border border-border shadow-elevated rounded-3xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="relative h-16 w-16 mx-auto mb-4 bg-primary-soft rounded-2xl grid place-items-center">
            <Sprout className="h-8 w-8 text-primary animate-bounce" />
          </div>
          <p className="font-display text-xl sm:text-2xl font-extrabold text-foreground">Analyzing Farm Parameters</p>
          {farmName && <p className="text-sm text-muted-foreground mt-1">Generating configuration report for {farmName}</p>}
        </div>

        <div className="space-y-3.5">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {idx < i ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : idx === i ? (
                <Loader2 className="h-5 w-5 text-primary animate-spin shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border border-border shrink-0" />
              )}
              <span className={`text-xs font-medium ${idx === i ? "text-foreground font-semibold" : idx < i ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
          <span>Staggered Rotation Engine v2.4</span>
          <span className="font-mono bg-muted px-2 py-1 rounded">PROCESSING</span>
        </div>
      </div>
    </div>
  );
}
