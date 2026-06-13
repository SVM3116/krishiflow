import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as Route$2, s as supabase } from "./router-DCDgEq5b.mjs";
import { S as Sprout, U as User, t as Phone, u as Mail, v as Lock, b as LoaderCircle, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function LoginPage() {
  const {
    redirect
  } = Route$2.useSearch();
  const nav = useNavigate();
  const [isSignUp, setIsSignUp] = reactExports.useState(false);
  const [fullName, setFullName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  const [successMsg, setSuccessMsg] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase?.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      if (session) {
        if (redirect) {
          nav({
            to: redirect
          });
        } else {
          nav({
            to: "/saved"
          });
        }
      }
    });
  }, [redirect]);
  async function handleSubmit(e) {
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
        const {
          data,
          error
        } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: trimmedFullName,
              phone: trimmedPhone
            }
          }
        });
        if (error) throw error;
        if (data.session) {
          setSuccessMsg("Account created! Logging in...");
          setTimeout(() => {
            if (redirect) {
              nav({
                to: redirect
              });
            } else {
              nav({
                to: "/saved"
              });
            }
          }, 1500);
        } else {
          setSuccessMsg("Registration successful! Please check your email to confirm your account.");
        }
      } else {
        const {
          data,
          error
        } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password
        });
        if (error) throw error;
        if (data.session) {
          setSuccessMsg("Success! Redirecting...");
          setTimeout(() => {
            if (redirect) {
              nav({
                to: redirect
              });
            } else {
              nav({
                to: "/saved"
              });
            }
          }, 1e3);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto px-4 py-16 sm:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-2xl gradient-hero grid place-items-center text-primary-foreground font-bold shadow-soft mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-6 w-6 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-extrabold text-foreground", children: isSignUp ? "Create your account" : "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: isSignUp ? "Start optimizing crop schedules for continuous revenue" : "Sign in to manage and view your optimized farm plans" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border shadow-elevated rounded-3xl p-6 sm:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-1.5 p-1 bg-muted rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setIsSignUp(false);
          setErrorMsg("");
          setSuccessMsg("");
        }, className: `py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${!isSignUp ? "bg-card text-foreground shadow-soft border border-border/10" : "text-muted-foreground hover:text-foreground"}`, children: "Sign In" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setIsSignUp(true);
          setErrorMsg("");
          setSuccessMsg("");
        }, className: `py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${isSignUp ? "bg-card text-foreground shadow-soft border border-border/10" : "text-muted-foreground hover:text-foreground"}`, children: "Register" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        isSignUp && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "e.g. Ramesh Kumar", className: "w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all", required: true })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2", children: "Mobile Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "e.g. 9876543210", className: "w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all", required: true })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2", children: "Email Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "e.g. farmer@krishiflow.in", className: "w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", className: "w-full rounded-xl border border-input bg-background pl-10 pr-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all", required: true })
          ] })
        ] }),
        errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-3", children: errorMsg }),
        successMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-success bg-success/10 border border-success/20 rounded-xl p-3", children: successMsg }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full rounded-full bg-primary text-primary-foreground py-3.5 font-semibold shadow-soft hover:shadow-elevated hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : isSignUp ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Create Account ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Sign In ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  LoginPage as component
};
