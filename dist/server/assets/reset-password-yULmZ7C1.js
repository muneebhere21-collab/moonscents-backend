import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { u as useNavigate, b as useAuth, s as supabase, t as toast } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ResetPasswordPage() {
  const navigate = useNavigate();
  const {
    updatePassword,
    user
  } = useAuth();
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const checkSession = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session && !window.location.hash.includes("type=recovery")) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        navigate({
          to: "/auth"
        });
      }
    };
    checkSession();
  }, [navigate]);
  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Password updated successfully.");
      if (user?.role === "admin") {
        navigate({
          to: "/admin"
        });
      } else {
        navigate({
          to: "/account"
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-32 max-w-md mx-auto px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-6", children: "Secure" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl text-silver-gradient", children: "New Password" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: showPassword ? "text" : "password", placeholder: "Enter new password", value: password, onChange: (e) => setPassword(e.target.value), minLength: 8, maxLength: 72, required: true, className: "w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver-muted hover:text-silver transition-silk tracking-luxe uppercase", children: showPassword ? "Hide" : "Show" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full bg-silver text-primary-foreground py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon disabled:opacity-50", children: loading ? "Updating..." : "Update Password" })
    ] })
  ] }) });
}
export {
  ResetPasswordPage as component
};
