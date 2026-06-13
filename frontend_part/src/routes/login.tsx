import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Mail, Lock, ArrowRight, Loader2, Sprout, User, Phone } from "lucide-react";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: (s.redirect as string) || "",
  }),
  head: () => ({ meta: [{ title: "Access KrishiFlow Insights" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const nav = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    supabase?.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (redirect) {
          nav({ to: redirect as any });
        } else {
          nav({ to: "/saved" });
        }
      }
    });
  }, [redirect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedFullName = fullName.trim();
    
    if (isSignUp) {
      if (!trimmedFullName || !trimmedPhone || !trimmedEmail || !password) {
        setErrorMsg("Please fill in all fields.");
        return;
      }
      // Simple validation for Indian mobile numbers starting with 6-9
      if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
        setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
        return;
      }
    } else {
      if (!trimmedEmail || !password) {
        setErrorMsg("Please fill in all fields.");
        return;
      }
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase!.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedFullName,
              phone: trimmedPhone,
            }
          }
        });
        if (error) throw error;
        
        if (data.session) {
          setSuccessMsg("Account created! Logging in...");
          setTimeout(() => {
            if (redirect) {
              nav({ to: redirect as any });
            } else {
              nav({ to: "/saved" });
            }
          }, 1500);
        } else {
          setSuccessMsg("Registration successful! Please check your email to confirm your account.");
        }
      } else {
        const { data, error } = await supabase!.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (error) throw error;

        if (data.session) {
          setSuccessMsg("Success! Redirecting...");
          setTimeout(() => {
            if (redirect) {
              nav({ to: redirect as any });
            } else {
              nav({ to: "/saved" });
            }
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-8">
        <div className="h-12 w-12 rounded-2xl gradient-hero grid place-items-center text-primary-foreground font-bold shadow-soft mx-auto mb-4">
          <Sprout className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-foreground">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {isSignUp
            ? "Start optimizing crop schedules for continuous revenue"
            : "Sign in to manage and view your optimized farm plans"}
        </p>
      </div>

      <div className="bg-card border border-border shadow-elevated rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Tab selector */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              !isSignUp
                ? "bg-card text-foreground shadow-soft border border-border/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isSignUp
                ? "bg-card text-foreground shadow-soft border border-border/10"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. farmer@krishiflow.in"
                className="w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="text-xs text-success bg-success/10 border border-success/20 rounded-xl p-3">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary text-primary-foreground py-3.5 font-semibold shadow-soft hover:shadow-elevated hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              <>
                Create Account <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
