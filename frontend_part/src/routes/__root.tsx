import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Sprout, User, LogOut, Play, Square, Video } from "lucide-react";
import { supabase } from "../lib/supabase";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <AutopilotRecorder />
      </div>
    </QueryClientProvider>
  );
}

function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const router = useRouter();
  async function handleSignOut() {
    if (supabase) {
      await supabase.auth.signOut();
      router.navigate({ to: "/login" });
    }
  }

  return (
    <header className="no-print sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="h-9 w-9 rounded-xl gradient-hero grid place-items-center text-primary-foreground font-bold shadow-soft shrink-0">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="font-display font-extrabold text-foreground truncate tracking-tight">KrishiFlow</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold hidden sm:block">Farm Insights Suite</span>
          </div>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {session && (
            <>
              <Link to="/saved" className="text-sm font-medium text-muted-foreground hover:text-foreground px-2 sm:px-3 py-2 rounded-md transition-colors">
                Saved plans
              </Link>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold shadow-soft hover:shadow-elevated transition-shadow"
              >
                <span className="hidden sm:inline">New farm planning</span>
                <span className="sm:hidden">Start Plan</span>
                <span aria-hidden>→</span>
              </Link>
            </>
          )}
          {!loading && (
            <>
              {session ? (
                <div className="flex items-center gap-2 sm:gap-3 ml-2 border-l border-border pl-2 sm:pl-3">
                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground font-medium max-w-[150px] truncate" title={session.user?.email}>
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{session.user?.email?.split('@')[0]}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1.5 cursor-pointer border-none bg-transparent"
                  >
                    <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full border border-border hover:bg-muted text-foreground px-4 py-2 text-xs sm:text-sm font-semibold transition-all"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="no-print border-t border-border mt-12 py-6 text-center text-xs text-muted-foreground">
      KrishiFlow · Unified Farm Intelligence · Crafted for Indian Agriculture
    </footer>
  );
}

function AutopilotRecorder() {
  const router = useRouter();
  const [showPanel, setShowPanel] = useState(false);
  const [recording, setRecording] = useState(false);
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const addLog = (msg: string) => {
    setLog(prev => [...prev.slice(-4), msg]);
  };

  const setReactInputValue = (inputEl: HTMLInputElement, value: string) => {
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

  const setReactSelectValue = (selectEl: HTMLSelectElement, value: string) => {
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

  const findInputByLabel = (labelText: string): HTMLInputElement | HTMLSelectElement | null => {
    const label = Array.from(document.querySelectorAll("label")).find(l => 
      l.textContent?.toLowerCase().includes(labelText.toLowerCase())
    );
    if (!label) return null;
    
    let input = label.querySelector("input, select") as HTMLInputElement | HTMLSelectElement | null;
    if (!input) {
      const parent = label.parentElement;
      if (parent) {
        input = parent.querySelector("input, select") as HTMLInputElement | HTMLSelectElement | null;
      }
    }
    return input;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const active = params.get("autopilot") === "true" || 
                   params.get("record") === "true" || 
                   sessionStorage.getItem("autopilot_active") === "true";
                   
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
          displaySurface: "browser",
        },
        audio: false
      } as any);

      addLog("Initializing recorder...");
      const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=h264") 
        ? "video/mp4;codecs=h264" 
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp9") 
          ? "video/webm;codecs=vp9" 
          : "video/webm";

      const chunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorder.ondataavailable = e => {
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
      addLog("Failed to start capture: " + (err as Error).message);
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      recorder.stream.getTracks().forEach(t => t.stop());
    }
  };

  useEffect(() => {
    if (!recording || step === 0) return;

    let timer: any;

    const executeStep = async () => {
      const path = window.location.pathname;
      addLog(`Executing Step ${step} on path: ${path}...`);

      if (step === 1) {
        if (path !== "/login") {
          addLog("Waiting to navigate to /login...");
          router.navigate({ to: "/login" });
          return;
        }

        await new Promise(r => setTimeout(r, 1000));
        
        const registerTab = Array.from(document.querySelectorAll("button")).find(b => 
          b.textContent?.trim() === "Register"
        );
        if (registerTab && !registerTab.className.includes("bg-card")) {
          registerTab.click();
          await new Promise(r => setTimeout(r, 800));
        }

        const nameInput = findInputByLabel("Full Name") as HTMLInputElement;
        const phoneInput = findInputByLabel("Mobile Number") as HTMLInputElement;
        const emailInput = findInputByLabel("Email Address") as HTMLInputElement;
        const passwordInput = findInputByLabel("Password") as HTMLInputElement;

        if (nameInput && phoneInput && emailInput && passwordInput) {
          const randEmail = `manoj.farm.${Date.now()}@krishiflow.com`;
          const randPhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
          
          sessionStorage.setItem("autopilot_email", randEmail);
          
          setReactInputValue(nameInput, "Manoj");
          setReactInputValue(phoneInput, randPhone);
          setReactInputValue(emailInput, randEmail);
          setReactInputValue(passwordInput, "Password@123");
          
          addLog(`Filled form as Manoj, email: ${randEmail}`);
          await new Promise(r => setTimeout(r, 1500));

          const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
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
      } 
      else if (step === 2) {
        if (path !== "/analyze") {
          return; 
        }

        await new Promise(r => setTimeout(r, 1500));

        const farmNameInput = findInputByLabel("Farm Name") as HTMLInputElement;
        const landAreaInput = findInputByLabel("Land Area") as HTMLInputElement;
        const stateSelect = findInputByLabel("State") as HTMLSelectElement;
        const districtSelect = findInputByLabel("District") as HTMLSelectElement;
        const soilSelect = findInputByLabel("Soil Type") as HTMLSelectElement;
        const waterSelect = findInputByLabel("Water Source") as HTMLSelectElement;
        const budgetInput = findInputByLabel("Estimated Budget") as HTMLInputElement;

        if (farmNameInput && landAreaInput && stateSelect && districtSelect && soilSelect && waterSelect && budgetInput) {
          setReactInputValue(farmNameInput, "Manoj's Model Farm");
          setReactInputValue(landAreaInput, "15");
          setReactSelectValue(stateSelect, "Karnataka");
          setReactSelectValue(districtSelect, "Belagavi");
          setReactSelectValue(soilSelect, "Red");
          setReactSelectValue(waterSelect, "Low");
          setReactInputValue(budgetInput, "1500000"); 

          addLog("Form details filled: 15 Acres, 15 Lakhs, Red soil, Low water");
          await new Promise(r => setTimeout(r, 2000));

          const optimizeBtn = Array.from(document.querySelectorAll("button")).find(b => 
            b.textContent?.toLowerCase().includes("optimize")
          ) as HTMLButtonElement;

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
      } 
      else if (step === 3) {
        if (path !== "/results") {
          return; 
        }

        await new Promise(r => setTimeout(r, 2500));

        window.scrollTo({ top: 350, behavior: "smooth" });
        addLog("Showing the dynamically calculated 6 Zones layout");
        await new Promise(r => setTimeout(r, 3000));

        window.scrollTo({ top: 850, behavior: "smooth" });
        addLog("Reviewing income projections and traditional comparison");
        await new Promise(r => setTimeout(r, 4000));

        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise(r => setTimeout(r, 1000));

        const todayTab = Array.from(document.querySelectorAll("button")).find(b => 
          b.textContent?.toLowerCase().includes("today")
        ) as HTMLButtonElement;

        if (todayTab) {
          todayTab.click();
          addLog("Opened Today's Overview");
          await new Promise(r => setTimeout(r, 1000));
          
          window.scrollTo({ top: 400, behavior: "smooth" });
          addLog("Viewing live local weather alerts and Mandi price forecasts");
          await new Promise(r => setTimeout(r, 4500));
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise(r => setTimeout(r, 1000));

        const diagnosticsTab = Array.from(document.querySelectorAll("button")).find(b => 
          b.textContent?.toLowerCase().includes("diagnostics") || b.textContent?.toLowerCase().includes("health")
        ) as HTMLButtonElement;

        if (diagnosticsTab) {
          diagnosticsTab.click();
          addLog("Opened Crop Health & Diagnostics tab");
          await new Promise(r => setTimeout(r, 1500));

          const accordionBtn = Array.from(document.querySelectorAll("button")).find(b => 
            b.textContent?.toLowerCase().includes("crop diagnostic")
          ) as HTMLButtonElement;

          if (accordionBtn) {
            accordionBtn.click();
            addLog("Expanding leaf diagnostics scanner");
            await new Promise(r => setTimeout(r, 1000));

            const fileInput = document.getElementById("leaf-image-upload") as HTMLInputElement;
            if (fileInput) {
              const myFile = new File([""], "powdery_mildew.png", { type: "image/png" });
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(myFile);
              fileInput.files = dataTransfer.files;
              const event = new Event("change", { bubbles: true });
              fileInput.dispatchEvent(event);
              
              addLog("Uploading leaf image powdery_mildew.png...");
              await new Promise(r => setTimeout(r, 3500));
              
              window.scrollTo({ top: 600, behavior: "smooth" });
              addLog("Reviewing Powdery Mildew diagnosis and organic remedies");
              await new Promise(r => setTimeout(r, 4000));
            }
          }
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        await new Promise(r => setTimeout(r, 1000));

        const saveBtn = Array.from(document.querySelectorAll("button")).find(b => 
          b.textContent?.toLowerCase().includes("save plan")
        ) as HTMLButtonElement;

        if (saveBtn) {
          saveBtn.click();
          addLog("Saving plan to Supabase database...");
          await new Promise(r => setTimeout(r, 2000));
        }

        const savedPlansLink = Array.from(document.querySelectorAll("a")).find(a => 
          a.textContent?.toLowerCase().includes("saved plans")
        ) as HTMLAnchorElement;

        if (savedPlansLink) {
          savedPlansLink.click();
          addLog("Navigating to Saved Plans...");
          setStep(4);
          sessionStorage.setItem("autopilot_step", "4");
        } else {
          router.navigate({ to: "/saved" });
          setStep(4);
          sessionStorage.setItem("autopilot_step", "4");
        }
      } 
      else if (step === 4) {
        if (path !== "/saved") {
          return;
        }

        await new Promise(r => setTimeout(r, 2000));
        addLog("Manoj's farm plan is successfully listed in saved workspace!");
        await new Promise(r => setTimeout(r, 2000));

        const signOutBtn = Array.from(document.querySelectorAll("button")).find(b => 
          b.textContent?.toLowerCase().includes("sign out")
        ) as HTMLButtonElement;

        if (signOutBtn) {
          signOutBtn.click();
          addLog("Signing out of current session...");
          sessionStorage.setItem("autopilot_is_relocking", "true");
          setStep(5);
          sessionStorage.setItem("autopilot_step", "5");
        } else {
          addLog("Sign Out button not found");
        }
      } 
      else if (step === 5) {
        if (path !== "/login") {
          return;
        }

        await new Promise(r => setTimeout(r, 2000));

        const signInTab = Array.from(document.querySelectorAll("button")).find(b => 
          b.textContent?.trim() === "Sign In"
        );
        if (signInTab && !signInTab.className.includes("bg-card")) {
          signInTab.click();
          await new Promise(r => setTimeout(r, 800));
        }

        const emailInput = findInputByLabel("Email Address") as HTMLInputElement;
        const passwordInput = findInputByLabel("Password") as HTMLInputElement;

        if (emailInput && passwordInput) {
          const savedEmail = sessionStorage.getItem("autopilot_email") || "";
          setReactInputValue(emailInput, savedEmail);
          setReactInputValue(passwordInput, "Password@123");

          addLog(`Re-entering Manoj's credentials: ${savedEmail}`);
          await new Promise(r => setTimeout(r, 1500));

          const submitBtn = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
          if (submitBtn) {
            submitBtn.click();
            addLog("Logging back in...");
            setStep(6);
            sessionStorage.setItem("autopilot_step", "6");
          }
        }
      } 
      else if (step === 6) {
        if (path !== "/saved") {
          return;
        }

        await new Promise(r => setTimeout(r, 2500));
        addLog("Recovered Manoj's workspace successfully! Reloading plan...");

        const planLink = document.querySelector(".grid a, a[href*='results']") as HTMLAnchorElement;
        if (planLink) {
          planLink.click();
          setStep(7);
          sessionStorage.setItem("autopilot_step", "7");
        } else {
          addLog("Saved plan link not found, stopping demo.");
          stopRecording();
        }
      } 
      else if (step === 7) {
        if (path !== "/results") {
          return;
        }

        await new Promise(r => setTimeout(r, 3000));
        addLog("Verified multi-plan access works. Stopping recording!");
        stopRecording();
      }
    };

    timer = setInterval(executeStep, 2000);
    return () => clearInterval(timer);
  }, [recording, step]);

  if (!showPanel) return null;

  return (
    <div className="no-print fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-card/90 backdrop-blur border border-border p-4 shadow-elevated flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Video className="h-4 w-4 text-primary shrink-0 animate-pulse" />
        <span className="font-display font-extrabold text-xs text-foreground tracking-tight">Demo Video Autopilot</span>
      </div>
      
      <div className="text-[10px] space-y-1 text-muted-foreground font-medium">
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${step >= 1 ? "bg-success animate-pulse" : "bg-border"}`} />
          <span className={step >= 1 ? "text-foreground font-semibold" : ""}>1. Sign Up User "Manoj"</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${step >= 2 ? "bg-success" : "bg-border"}`} />
          <span className={step >= 2 ? "text-foreground font-semibold" : ""}>2. Form details (15ac, 15L, Red, Low)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${step >= 3 ? "bg-success" : "bg-border"}`} />
          <span className={step >= 3 ? "text-foreground font-semibold" : ""}>3. 6-Zone Plan & Crop health scan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${step >= 4 ? "bg-success" : "bg-border"}`} />
          <span className={step >= 4 ? "text-foreground font-semibold" : ""}>4. Save plan and Log out</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${step >= 5 ? "bg-success" : "bg-border"}`} />
          <span className={step >= 5 ? "text-foreground font-semibold" : ""}>5. Sign back in & verify saved plan</span>
        </div>
      </div>

      {log.length > 0 && (
        <div className="bg-muted p-2 rounded-xl text-[9px] font-mono text-muted-foreground space-y-0.5 max-h-[70px] overflow-y-auto">
          {log.map((l, idx) => (
            <p key={idx} className="truncate">{l}</p>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {!recording ? (
          <button 
            onClick={startRecording}
            className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-4 shadow-soft transition-colors cursor-pointer flex items-center justify-center gap-1 border-none"
          >
            <Play className="h-3 w-3 fill-primary-foreground" /> Start Autopilot
          </button>
        ) : (
          <button 
            onClick={stopRecording}
            className="flex-1 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-xs py-2 px-4 transition-colors cursor-pointer flex items-center justify-center gap-1 border-none"
          >
            <Square className="h-3 w-3 fill-destructive-foreground" /> Stop & Download
          </button>
        )}
        <button 
          onClick={() => setShowPanel(false)}
          className="rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground text-xs py-2 px-3 transition-colors cursor-pointer bg-transparent"
        >
          Hide
        </button>
      </div>
    </div>
  );
}
