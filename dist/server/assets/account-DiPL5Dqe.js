import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { b as useAuth, u as useNavigate, a as apiRequest, L as Link } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function AccountPage() {
  const {
    user,
    isAdmin,
    loading,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = reactExports.useState([]);
  const [fetching, setFetching] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/auth"
    });
  }, [loading, user, navigate]);
  reactExports.useEffect(() => {
    if (!user) return;
    void (async () => {
      const data = await apiRequest("/api/orders/my");
      setOrders(data ?? []);
      setFetching(false);
    })();
  }, [user]);
  if (loading || !user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-40 pb-24 max-w-xl mx-auto px-6 text-center text-silver-muted", children: "Loading..." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-24 max-w-4xl mx-auto px-6 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between flex-wrap gap-4 mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl text-silver-gradient", children: user.name }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "text-xs tracking-luxe uppercase text-silver hover:text-white border-b border-silver/50 pb-1", children: "Enter Atelier" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          void signOut();
          navigate({
            to: "/"
          });
        }, className: "text-xs tracking-luxe uppercase text-silver-muted hover:text-silver border-b border-silver/30 pb-1", children: "Sign out" })
      ] })
    ] }),
    !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver mb-6", children: "Your orders" }),
    isAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border p-12 text-center bg-card/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl text-silver mb-4", children: "Administrator Portal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver-muted text-sm mb-8", children: "Welcome to your master account. Manage your collections, view customer orders, and update order statuses from the Atelier." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin", className: "bg-silver text-primary-foreground px-8 py-4 text-[10px] tracking-luxe uppercase hover:bg-moonlight transition-silk inline-block", children: "Open Atelier Dashboard" })
    ] }) : fetching ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver-muted text-sm", children: "Loading..." }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver-muted text-sm mb-6", children: "You haven't placed any orders yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "text-xs tracking-luxe uppercase text-silver border-b border-silver/40 pb-1", children: "Explore the Collection" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border border-y border-border", children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-5 flex items-center justify-between gap-6 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg text-silver", children: [
          "Order · ",
          o.id.slice(0, 8)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-silver-muted mt-1", children: [
          new Date(o.created_at).toLocaleDateString("en-PK", {
            dateStyle: "long"
          }),
          " · ",
          o.status
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-silver", children: [
        "PKR ",
        o.total_amount.toLocaleString()
      ] })
    ] }, o.id)) })
  ] }) });
}
export {
  AccountPage as component
};
