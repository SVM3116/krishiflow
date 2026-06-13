import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { S as Sprout, U as User, L as LogOut, V as Video, P as Play, a as Square } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const supabaseUrl = "https://cnoeyfytntlfhlcrftxd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNub2V5Znl0bnRsZmhsY3JmdHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNDc3MzksImV4cCI6MjA5NjcyMzczOX0.NFVasVM-UlrLkAffq4VYGYS0kj3BqIcJFwDVtHEtE4s";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const appCss = "/assets/styles-BbtZ4SVh.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$5 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KrishiFlow Insights — Staggered farm zone planner & crop intelligence" },
      { name: "description", content: "Maximize your land yield with staggered multi-zone planning, traditional heritage agriculture guidelines, and predictive 12-month crop scheduling." },
      { name: "author", content: "KrishiFlow Insights" },
      { property: "og:title", content: "KrishiFlow Insights" },
      { property: "og:description", content: "Optimized crop rotations and staggered harvesting calendars." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg"
      },
      {
        rel: "stylesheet",
        href: appCss
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$5.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AutopilotRecorder, {})
  ] }) });
}
function Navbar() {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const router2 = useRouter();
  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
      router2.navigate({ to: "/login" });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "no-print sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl gradient-hero grid place-items-center text-primary-foreground font-bold shadow-soft shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-tight min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-extrabold text-foreground truncate tracking-tight", children: "KrishiFlow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] uppercase tracking-widest text-muted-foreground font-bold hidden sm:block", children: "Farm Insights Suite" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 sm:gap-3", children: [
      session && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/saved", className: "text-sm font-medium text-muted-foreground hover:text-foreground px-2 sm:px-3 py-2 rounded-md transition-colors", children: "Saved plans" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/analyze",
            className: "inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New farm planning" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Start Plan" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "→" })
            ]
          }
        )
      ] }),
      !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: session ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 ml-2 border-l border-border pl-2 sm:pl-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground font-medium max-w-[150px] truncate", title: session.user?.email, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: session.user?.email?.split("@")[0] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleSignOut,
            className: "text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1.5 cursor-pointer border-none bg-transparent",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Sign Out" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/login",
          className: "rounded-full border border-border hover:bg-muted text-foreground px-4 py-2 text-xs sm:text-sm font-semibold transition-all",
          children: "Sign In"
        }
      ) })
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "no-print border-t border-border mt-12 py-6 text-center text-xs text-muted-foreground", children: "KrishiFlow · Unified Farm Intelligence · Crafted for Indian Agriculture" });
}
function AutopilotRecorder() {
  const router2 = useRouter();
  const [showPanel, setShowPanel] = reactExports.useState(false);
  const [recording, setRecording] = reactExports.useState(false);
  const [step, setStep] = reactExports.useState(0);
  const [log, setLog] = reactExports.useState([]);
  const [recorder, setRecorder] = reactExports.useState(null);
  const addLog = (msg) => {
    setLog((prev) => [...prev.slice(-4), msg]);
  };
  const setReactInputValue = (inputEl, value) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(inputEl, value);
      const ev = new Event("input", { bubbles: true });
      inputEl.dispatchEvent(ev);
    }
  };
  const setReactSelectValue = (selectEl, value) => {
    const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLSelectElement.prototype,
      "value"
    )?.set;
    if (nativeSelectValueSetter) {
      nativeSelectValueSetter.call(selectEl, value);
      const ev = new Event("change", { bubbles: true });
      selectEl.dispatchEvent(ev);
    }
  };
  const findInputByLabel = (labelText) => {
    const label = Array.from(document.querySelectorAll("label")).find(
      (l) => l.textContent?.toLowerCase().includes(labelText.toLowerCase())
    );
    if (!label) return null;
    let input = label.querySelector("input, select");
    if (!input) {
      const parent = label.parentElement;
      if (parent) {
        input = parent.querySelector("input, select");
      }
    }
    return input;
  };
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const active = params.get("autopilot") === "true" || params.get("record") === "true" || sessionStorage.getItem("autopilot_active") === "true";
    if (active) {
      setShowPanel(true);
      const savedStep = sessionStorage.getItem("autopilot_step");
      if (savedStep) {
        setStep(parseInt(savedStep));
      }
    }
  }, []);
  const startRecording = async () => {
    try {
      addLog("Requesting screen capture...");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "browser"
        },
        audio: false
      });
      addLog("Initializing recorder...");
      const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=h264") ? "video/mp4;codecs=h264" : MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
      const chunks = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        addLog("Saving video file...");
        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `krishiflow_demo_${Date.now()}.${mimeType.includes("mp4") ? "mp4" : "webm"}`;
        a.click();
        sessionStorage.removeItem("autopilot_active");
        sessionStorage.removeItem("autopilot_step");
        sessionStorage.removeItem("autopilot_email");
        sessionStorage.removeItem("autopilot_is_relocking");
        setRecording(false);
        setStep(0);
        addLog("Demo finished and video downloaded!");
      };
      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
      sessionStorage.setItem("autopilot_active", "true");
      if (window.location.pathname === "/login") {
        setStep(1);
        sessionStorage.setItem("autopilot_step", "1");
      } else {
        addLog("Please go to /login to start the full autopilot sequence.");
      }
    } catch (err) {
      console.error(err);
      addLog("Failed to start capture: " + err.message);
    }
  };
  const stopRecording = () => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      recorder.stream.getTracks().forEach((t) => t.stop());
    }
  };
  reactExports.useEffect(() => {
    if (!recording || step === 0) return;
    let timer;
    const executeStep = async () => {
      const path = window.location.pathname;
      addLog(`Executing Step ${step} on path: ${path}...`);
      if (step === 1) {
        if (path !== "/login") {
          addLog("Waiting to navigate to /login...");
          router2.navigate({ to: "/login" });
          return;
        }
        await new Promise((r) => setTimeout(r, 1e3));
        const registerTab = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.trim() === "Register"
        );
        if (registerTab && !registerTab.className.includes("bg-card")) {
          registerTab.click();
          await new Promise((r) => setTimeout(r, 800));
        }
        const nameInput = findInputByLabel("Full Name");
        const phoneInput = findInputByLabel("Mobile Number");
        const emailInput = findInputByLabel("Email Address");
        const passwordInput = findInputByLabel("Password");
        if (nameInput && phoneInput && emailInput && passwordInput) {
          const randEmail = `manoj.farm.${Date.now()}@krishiflow.com`;
          const randPhone = `9${Math.floor(1e8 + Math.random() * 9e8)}`;
          sessionStorage.setItem("autopilot_email", randEmail);
          setReactInputValue(nameInput, "Manoj");
          setReactInputValue(phoneInput, randPhone);
          setReactInputValue(emailInput, randEmail);
          setReactInputValue(passwordInput, "Password@123");
          addLog(`Filled form as Manoj, email: ${randEmail}`);
          await new Promise((r) => setTimeout(r, 1500));
          const submitBtn = document.querySelector('form button[type="submit"]');
          if (submitBtn) {
            submitBtn.click();
            addLog("Form submitted, waiting for redirect...");
            setStep(2);
            sessionStorage.setItem("autopilot_step", "2");
          } else {
            addLog("Submit button not found");
          }
        } else {
          addLog("Form inputs not fully found");
        }
      } else if (step === 2) {
        if (path !== "/analyze") {
          return;
        }
        await new Promise((r) => setTimeout(r, 1500));
        const farmNameInput = findInputByLabel("Farm Name");
        const landAreaInput = findInputByLabel("Land Area");
        const stateSelect = findInputByLabel("State");
        const districtSelect = findInputByLabel("District");
        const soilSelect = findInputByLabel("Soil Type");
        const waterSelect = findInputByLabel("Water Source");
        const budgetInput = findInputByLabel("Estimated Budget");
        if (farmNameInput && landAreaInput && stateSelect && districtSelect && soilSelect && waterSelect && budgetInput) {
          setReactInputValue(farmNameInput, "Manoj's Model Farm");
          setReactInputValue(landAreaInput, "15");
          setReactSelectValue(stateSelect, "Karnataka");
          setReactSelectValue(districtSelect, "Belagavi");
          setReactSelectValue(soilSelect, "Red");
          setReactSelectValue(waterSelect, "Low");
          setReactInputValue(budgetInput, "1500000");
          addLog("Form details filled: 15 Acres, 15 Lakhs, Red soil, Low water");
          await new Promise((r) => setTimeout(r, 2e3));
          const optimizeBtn = Array.from(document.querySelectorAll("button")).find(
            (b) => b.textContent?.toLowerCase().includes("optimize")
          );
          if (optimizeBtn) {
            optimizeBtn.click();
            addLog("Optimizing farm layout...");
            setStep(3);
            sessionStorage.setItem("autopilot_step", "3");
          } else {
            addLog("Optimize button not found");
          }
        } else {
          addLog("Farm input fields not fully found");
        }
      } else if (step === 3) {
        if (path !== "/results") {
          return;
        }
        await new Promise((r) => setTimeout(r, 2500));
        window.scrollTo({ top: 350, behavior: "smooth" });
        addLog("Showing the dynamically calculated 6 Zones layout");
        await new Promise((r) => setTimeout(r, 3e3));
        window.scrollTo({ top: 850, behavior: "smooth" });
        addLog("Reviewing income projections and traditional comparison");
        await new Promise((r) => setTimeout(r, 4e3));
        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise((r) => setTimeout(r, 1e3));
        const todayTab = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.toLowerCase().includes("today")
        );
        if (todayTab) {
          todayTab.click();
          addLog("Opened Today's Overview");
          await new Promise((r) => setTimeout(r, 1e3));
          window.scrollTo({ top: 400, behavior: "smooth" });
          addLog("Viewing live local weather alerts and Mandi price forecasts");
          await new Promise((r) => setTimeout(r, 4500));
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise((r) => setTimeout(r, 1e3));
        const diagnosticsTab = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.toLowerCase().includes("diagnostics") || b.textContent?.toLowerCase().includes("health")
        );
        if (diagnosticsTab) {
          diagnosticsTab.click();
          addLog("Opened Crop Health & Diagnostics tab");
          await new Promise((r) => setTimeout(r, 1500));
          const accordionBtn = Array.from(document.querySelectorAll("button")).find(
            (b) => b.textContent?.toLowerCase().includes("crop diagnostic")
          );
          if (accordionBtn) {
            accordionBtn.click();
            addLog("Expanding leaf diagnostics scanner");
            await new Promise((r) => setTimeout(r, 1e3));
            const fileInput = document.getElementById("leaf-image-upload");
            if (fileInput) {
              const myFile = new File([""], "powdery_mildew.png", { type: "image/png" });
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(myFile);
              fileInput.files = dataTransfer.files;
              const event = new Event("change", { bubbles: true });
              fileInput.dispatchEvent(event);
              addLog("Uploading leaf image powdery_mildew.png...");
              await new Promise((r) => setTimeout(r, 3500));
              window.scrollTo({ top: 600, behavior: "smooth" });
              addLog("Reviewing Powdery Mildew diagnosis and organic remedies");
              await new Promise((r) => setTimeout(r, 4e3));
            }
          }
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise((r) => setTimeout(r, 1e3));
        const saveBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.toLowerCase().includes("save plan")
        );
        if (saveBtn) {
          saveBtn.click();
          addLog("Saving plan to Supabase database...");
          await new Promise((r) => setTimeout(r, 2e3));
        }
        const savedPlansLink = Array.from(document.querySelectorAll("a")).find(
          (a) => a.textContent?.toLowerCase().includes("saved plans")
        );
        if (savedPlansLink) {
          savedPlansLink.click();
          addLog("Navigating to Saved Plans...");
          setStep(4);
          sessionStorage.setItem("autopilot_step", "4");
        } else {
          router2.navigate({ to: "/saved" });
          setStep(4);
          sessionStorage.setItem("autopilot_step", "4");
        }
      } else if (step === 4) {
        if (path !== "/saved") {
          return;
        }
        await new Promise((r) => setTimeout(r, 2e3));
        addLog("Manoj's farm plan is successfully listed in saved workspace!");
        await new Promise((r) => setTimeout(r, 2e3));
        const signOutBtn = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.toLowerCase().includes("sign out")
        );
        if (signOutBtn) {
          signOutBtn.click();
          addLog("Signing out of current session...");
          sessionStorage.setItem("autopilot_is_relocking", "true");
          setStep(5);
          sessionStorage.setItem("autopilot_step", "5");
        } else {
          addLog("Sign Out button not found");
        }
      } else if (step === 5) {
        if (path !== "/login") {
          return;
        }
        await new Promise((r) => setTimeout(r, 2e3));
        const signInTab = Array.from(document.querySelectorAll("button")).find(
          (b) => b.textContent?.trim() === "Sign In"
        );
        if (signInTab && !signInTab.className.includes("bg-card")) {
          signInTab.click();
          await new Promise((r) => setTimeout(r, 800));
        }
        const emailInput = findInputByLabel("Email Address");
        const passwordInput = findInputByLabel("Password");
        if (emailInput && passwordInput) {
          const savedEmail = sessionStorage.getItem("autopilot_email") || "";
          setReactInputValue(emailInput, savedEmail);
          setReactInputValue(passwordInput, "Password@123");
          addLog(`Re-entering Manoj's credentials: ${savedEmail}`);
          await new Promise((r) => setTimeout(r, 1500));
          const submitBtn = document.querySelector('form button[type="submit"]');
          if (submitBtn) {
            submitBtn.click();
            addLog("Logging back in...");
            setStep(6);
            sessionStorage.setItem("autopilot_step", "6");
          }
        }
      } else if (step === 6) {
        if (path !== "/saved") {
          return;
        }
        await new Promise((r) => setTimeout(r, 2500));
        addLog("Recovered Manoj's workspace successfully! Reloading plan...");
        const planLink = document.querySelector(".grid a, a[href*='results']");
        if (planLink) {
          planLink.click();
          setStep(7);
          sessionStorage.setItem("autopilot_step", "7");
        } else {
          addLog("Saved plan link not found, stopping demo.");
          stopRecording();
        }
      } else if (step === 7) {
        if (path !== "/results") {
          return;
        }
        await new Promise((r) => setTimeout(r, 3e3));
        addLog("Verified multi-plan access works. Stopping recording!");
        stopRecording();
      }
    };
    timer = setInterval(executeStep, 2e3);
    return () => clearInterval(timer);
  }, [recording, step]);
  if (!showPanel) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "no-print fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-card/90 backdrop-blur border border-border p-4 shadow-elevated flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border pb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4 text-primary shrink-0 animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-extrabold text-xs text-foreground tracking-tight", children: "Demo Video Autopilot" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] space-y-1 text-muted-foreground font-medium", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${step >= 1 ? "bg-success animate-pulse" : "bg-border"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: step >= 1 ? "text-foreground font-semibold" : "", children: '1. Sign Up User "Manoj"' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${step >= 2 ? "bg-success" : "bg-border"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: step >= 2 ? "text-foreground font-semibold" : "", children: "2. Form details (15ac, 15L, Red, Low)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${step >= 3 ? "bg-success" : "bg-border"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: step >= 3 ? "text-foreground font-semibold" : "", children: "3. 6-Zone Plan & Crop health scan" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${step >= 4 ? "bg-success" : "bg-border"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: step >= 4 ? "text-foreground font-semibold" : "", children: "4. Save plan and Log out" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `h-1.5 w-1.5 rounded-full ${step >= 5 ? "bg-success" : "bg-border"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: step >= 5 ? "text-foreground font-semibold" : "", children: "5. Sign back in & verify saved plan" })
      ] })
    ] }),
    log.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted p-2 rounded-xl text-[9px] font-mono text-muted-foreground space-y-0.5 max-h-[70px] overflow-y-auto", children: log.map((l, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate", children: l }, idx)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      !recording ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: startRecording,
          className: "flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-4 shadow-soft transition-colors cursor-pointer flex items-center justify-center gap-1 border-none",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3 fill-primary-foreground" }),
            " Start Autopilot"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: stopRecording,
          className: "flex-1 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-xs py-2 px-4 transition-colors cursor-pointer flex items-center justify-center gap-1 border-none",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-3 w-3 fill-destructive-foreground" }),
            " Stop & Download"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setShowPanel(false),
          className: "rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs py-2 px-3 transition-colors cursor-pointer bg-transparent",
          children: "Hide"
        }
      )
    ] })
  ] });
}
const $$splitComponentImporter$4 = () => import("./saved-BY6uSJeD.mjs");
const Route$4 = createFileRoute("/saved")({
  head: () => ({
    meta: [{
      title: "Saved plans — KrishiFlow Insights"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./results-Dmd2M00r.mjs");
const Route$3 = createFileRoute("/results")({
  validateSearch: (s) => ({
    id: s.id || "",
    tab: s.tab || "dashboard",
    subtab: s.subtab || "rotation"
  }),
  head: () => ({
    meta: [{
      title: "Your optimized farm plan — KrishiFlow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./login-UXMwnPoA.mjs");
const Route$2 = createFileRoute("/login")({
  validateSearch: (s) => ({
    redirect: s.redirect || ""
  }),
  head: () => ({
    meta: [{
      title: "Access KrishiFlow Insights"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./analyze-BuwhgOii.mjs");
const Route$1 = createFileRoute("/analyze")({
  head: () => ({
    meta: [{
      title: "Farm Assessment — KrishiFlow Insights"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CG9q-0Cm.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "KrishiFlow — Staggered farm zone planner & crop intelligence"
    }, {
      name: "description",
      content: "Advanced agronomic zone planning for Indian farmers. Smart crop zoning, integrated traditional crop protection, and a 12-month income calendar."
    }, {
      property: "og:title",
      content: "KrishiFlow Insights"
    }, {
      property: "og:description",
      content: "Optimized crop rotations and staggered harvesting calendars."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SavedRoute = Route$4.update({
  id: "/saved",
  path: "/saved",
  getParentRoute: () => Route$5
});
const ResultsRoute = Route$3.update({
  id: "/results",
  path: "/results",
  getParentRoute: () => Route$5
});
const LoginRoute = Route$2.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$5
});
const AnalyzeRoute = Route$1.update({
  id: "/analyze",
  path: "/analyze",
  getParentRoute: () => Route$5
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  AnalyzeRoute,
  LoginRoute,
  ResultsRoute,
  SavedRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$3 as R,
  Route$2 as a,
  router as r,
  supabase as s
};
