import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { u as useNavigate, b as useAuth, G as GoogleLogin, t as toast, L as Link, o as objectType, e as stringType } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const schema = objectType({
  email: stringType().trim().email("Enter a valid email").max(200),
  password: stringType().min(8, "At least 8 characters").max(72),
  displayName: stringType().trim().min(2, "Name must be at least 2 characters").max(80).optional()
});
function AuthPage() {
  const navigate = useNavigate();
  const {
    user,
    signIn,
    signInWithGoogle,
    signUp
  } = useAuth();
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [displayName, setDisplayName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [rememberMe, setRememberMe] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (user) {
      const target = user.role === "admin" ? "/admin" : "/account";
      navigate({
        to: target
      });
    }
  }, [user, navigate]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === "forgot") {
      setLoading(true);
      try {
        const res = await fetch("/api/admin-auth/force-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            newPassword: password
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update password.");
        toast.success("Password instantly updated. You can now sign in.");
        setMode("signin");
      } catch (err) {
        toast.error(err.message || "Failed to forcefully update password.");
      } finally {
        setLoading(false);
      }
      return;
    }
    const parsed = schema.safeParse({
      email,
      password,
      displayName: mode === "signup" ? displayName : void 0
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(displayName, email, password);
        toast.success("Account created successfully.");
        await signIn(email, password);
      } else {
        await signIn(email, password);
        toast.success("Welcome back.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogleSuccess(credentialResponse) {
    if (!credentialResponse.credential) return;
    setLoading(true);
    try {
      await signInWithGoogle(credentialResponse.credential);
      toast.success("Signed in with Google.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-24 max-w-md mx-auto px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-6 text-center", children: mode === "signin" ? "Welcome back" : mode === "signup" ? "Begin" : "Force Reset" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl text-silver-gradient text-center mb-12", children: mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "New Password" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", placeholder: "Name", value: displayName, onChange: (e) => setDisplayName(e.target.value), minLength: 2, maxLength: 80, required: true, className: "w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), maxLength: 200, required: true, className: "w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", placeholder: mode === "forgot" ? "Enter New Password" : "Password", value: password, onChange: (e) => setPassword(e.target.value), minLength: 8, maxLength: 72, required: true, className: "w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver-muted hover:text-silver transition-silk tracking-luxe uppercase", children: showPassword ? "Hide" : "Show" })
      ] }),
      mode === "signin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-4 h-4 border transition-silk flex items-center justify-center ${rememberMe ? "border-silver bg-silver text-black" : "border-border group-hover:border-silver/60"}`, children: rememberMe && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", className: "w-3 h-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 6L9 17l-5-5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", className: "hidden", checked: rememberMe, onChange: (e) => setRememberMe(e.target.checked) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-silver-muted group-hover:text-silver transition-silk uppercase tracking-luxe", children: "Remember me" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("forgot"), className: "text-[11px] text-silver-muted hover:text-silver transition-silk uppercase tracking-luxe", children: "Forgot Password?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full bg-silver text-primary-foreground px-8 py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon disabled:opacity-50 mt-4", children: loading ? "..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Force Update Password" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center w-full gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "flex-1 border-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-silver-muted uppercase tracking-luxe", children: "Or" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "flex-1 border-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleLogin, { onSuccess: handleGoogleSuccess, onError: () => toast.error("Google sign-in was unsuccessful"), theme: "filled_black", shape: "rectangular", text: mode === "signin" ? "signin_with" : "signup_with" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-silver-muted mt-8", children: [
      mode === "signin" ? "New to Moonscents?" : "Already have an account?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(mode === "signin" ? "signup" : "signin"), className: "text-silver border-b border-silver/40 pb-0.5", children: mode === "signin" ? "Create one" : "Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-[10px] text-silver-muted mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Return home" }) })
  ] }) });
}
export {
  AuthPage as component
};
