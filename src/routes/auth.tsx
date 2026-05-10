import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { z } from "zod";
import { Layout } from "@/components/site/Layout";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign In — Moonscents" },
      { name: "description", content: "Sign in or create your Moonscents account." },
    ],
  }),
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
  password: z.string().min(8, "At least 8 characters").max(72),
  displayName: z.string().trim().min(2, "Name must be at least 2 characters").max(80).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, signIn, signInWithGoogle, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (user) {
      const target = user.role === "admin" ? "/admin" : "/account";
      navigate({ to: target });
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (mode === "forgot") {
      setLoading(true);
      try {
        const res = await fetch("https://eaqghrfwjunriasozpmg.supabase.co/functions/v1/admin-force-reset", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-secret": import.meta.env.VITE_ADMIN_RESET_SECRET ?? "",
          },
          body: JSON.stringify({ email, newPassword: password }),
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || "Failed to update password.");
        
        toast.success("Password instantly updated. You can now sign in.");
        setMode("signin");
      } catch (err: any) {
        toast.error(err.message || "Failed to forcefully update password.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const parsed = schema.safeParse({ email, password, displayName: mode === "signup" ? displayName : undefined });
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
        // Remember me is handled by Supabase defaults, but we acknowledge user intent
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

  async function handleGoogleSuccess(credentialResponse: any) {
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

  return (
    <Layout>
      <section className="pt-40 pb-24 max-w-md mx-auto px-6">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-6 text-center">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Begin" : "Force Reset"}
        </p>
        <h1 className="font-display text-5xl text-silver-gradient text-center mb-12">
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "New Password"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              minLength={2}
              maxLength={80}
              required
              className="w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={200}
            required
            className="w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={mode === "forgot" ? "Enter New Password" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={72}
              required
              className="w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver-muted hover:text-silver transition-silk tracking-luxe uppercase"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {mode === "signin" && (
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 border transition-silk flex items-center justify-center ${rememberMe ? 'border-silver bg-silver text-black' : 'border-border group-hover:border-silver/60'}`}>
                  {rememberMe && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span className="text-[11px] text-silver-muted group-hover:text-silver transition-silk uppercase tracking-luxe">Remember me</span>
              </label>
              <button type="button" onClick={() => setMode("forgot")} className="text-[11px] text-silver-muted hover:text-silver transition-silk uppercase tracking-luxe">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-silver text-primary-foreground px-8 py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon disabled:opacity-50 mt-4"
          >
            {loading ? "..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Force Update Password"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center w-full gap-4">
            <hr className="flex-1 border-border" />
            <span className="text-xs text-silver-muted uppercase tracking-luxe">Or</span>
            <hr className="flex-1 border-border" />
          </div>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google sign-in was unsuccessful")}
            theme="filled_black"
            shape="rectangular"
            text={mode === "signin" ? "signin_with" : "signup_with"}
          />
        </div>

        <p className="text-center text-xs text-silver-muted mt-8">
          {mode === "signin" ? "New to Moonscents?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-silver border-b border-silver/40 pb-0.5"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>

        <p className="text-center text-[10px] text-silver-muted mt-12">
          <Link to="/">Return home</Link>
        </p>
      </section>
    </Layout>
  );
}
