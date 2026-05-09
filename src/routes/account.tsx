import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

export const Route = createFileRoute("/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Account — Moonscents" }] }),
});

type Order = {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
};

function AccountPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const data = await apiRequest<Order[]>("/api/orders/my");
      setOrders(data ?? []);
      setFetching(false);
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <Layout>
        <section className="pt-40 pb-24 max-w-xl mx-auto px-6 text-center text-silver-muted">
          Loading...
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-40 pb-24 max-w-4xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-silver-gradient">{user.name}</h1>
          </div>
          <div className="flex items-center gap-6">
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs tracking-luxe uppercase text-silver hover:text-white border-b border-silver/50 pb-1"
              >
                Enter Atelier
              </Link>
            )}
            <button
              onClick={() => { void signOut(); navigate({ to: "/" }); }}
              className="text-xs tracking-luxe uppercase text-silver-muted hover:text-silver border-b border-silver/30 pb-1"
            >
              Sign out
            </button>
          </div>
        </div>

        {!isAdmin && <p className="text-xs tracking-luxe uppercase text-silver mb-6">Your orders</p>}
        
        {isAdmin ? (
          <div className="border border-border p-12 text-center bg-card/30">
            <p className="font-display text-2xl text-silver mb-4">Administrator Portal</p>
            <p className="text-silver-muted text-sm mb-8">
              Welcome to your master account. Manage your collections, view customer orders, and update order statuses from the Atelier.
            </p>
            <Link 
              to="/admin" 
              className="bg-silver text-primary-foreground px-8 py-4 text-[10px] tracking-luxe uppercase hover:bg-moonlight transition-silk inline-block"
            >
              Open Atelier Dashboard
            </Link>
          </div>
        ) : fetching ? (
          <p className="text-silver-muted text-sm">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <p className="text-silver-muted text-sm mb-6">You haven't placed any orders yet.</p>
            <Link to="/collection" className="text-xs tracking-luxe uppercase text-silver border-b border-silver/40 pb-1">
              Explore the Collection
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {orders.map((o) => (
              <li key={o.id} className="py-5 flex items-center justify-between gap-6 flex-wrap">
                <div>
                  <p className="font-display text-lg text-silver">Order · {o.id.slice(0, 8)}</p>
                  <p className="text-[11px] text-silver-muted mt-1">
                    {new Date(o.created_at).toLocaleDateString("en-PK", { dateStyle: "long" })} · {o.status}
                  </p>
                </div>
                <p className="text-silver">PKR {o.total_amount.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}
