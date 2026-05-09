import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, FormEvent, useEffect } from "react";
import { Layout } from "@/components/site/Layout";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: "Reset Password — Moonscents" }] }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, user } = useAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Listen for the hash token. Supabase handles the session automatically
    // when arriving via a recovery link.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && !window.location.hash.includes('type=recovery')) {
        toast.error("Invalid or expired reset link. Please request a new one.");
        navigate({ to: "/auth" });
      }
    };
    checkSession();
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password);
      toast.success("Password updated successfully.");
      
      // Navigate to the correct portal based on their role
      if (user?.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/account" });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section className="pt-40 pb-32 max-w-md mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-luxe uppercase text-silver-muted mb-6">Secure</p>
          <h1 className="font-display text-4xl md:text-5xl text-silver-gradient">New Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
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
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-silver text-primary-foreground py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>
    </Layout>
  );
}
