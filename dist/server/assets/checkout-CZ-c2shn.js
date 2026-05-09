import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { u as useNavigate, d as useCart, b as useAuth, L as Link, t as toast, a as apiRequest, o as objectType, e as stringType } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const schema = objectType({
  customer_name: stringType().trim().min(1, "Name is required").max(120),
  customer_email: stringType().trim().email("Valid email required").max(200),
  customer_phone: stringType().trim().min(5, "Phone required").max(30),
  address: stringType().trim().min(3, "Address required").max(500),
  city: stringType().trim().min(1, "City required").max(100),
  notes: stringType().trim().max(500).optional()
});
function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    clear
  } = useCart();
  const {
    user
  } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [paymentMethod, setPaymentMethod] = reactExports.useState("cod");
  const [errors, setErrors] = reactExports.useState({});
  const [form, setForm] = reactExports.useState({
    customer_name: "",
    customer_email: user?.email ?? "",
    customer_phone: "",
    address: "",
    city: "",
    notes: ""
  });
  const set = (k) => (e) => {
    setForm((f) => ({
      ...f,
      [k]: e.target.value
    }));
    if (errors[k]) setErrors((prev) => ({
      ...prev,
      [k]: ""
    }));
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const newErrors = {};
      parsed.error.issues.forEach((i) => {
        if (!newErrors[i.path[0]]) newErrors[i.path[0]] = i.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (!user) {
        toast.error("Please sign in to continue checkout");
        navigate({
          to: "/auth"
        });
        return;
      }
      const products = await apiRequest("/api/products");
      const productIdBySlug = new Map(products.map((p) => [p.slug, p._id]));
      const orderItems = items.map((item) => {
        const productId = productIdBySlug.get(item.slug);
        if (!productId) {
          throw new Error(`Product unavailable: ${item.name}`);
        }
        return {
          productId,
          quantity: item.quantity
        };
      });
      const order = await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...parsed.data,
          paymentMethod,
          items: orderItems
        })
      });
      clear();
      const WHATSAPP_NUMBER = "923303965260";
      const total = subtotal + (subtotal >= 1e4 ? 0 : 350);
      const paymentDisplay = {
        cod: "Cash on Delivery",
        jazzcash: "JazzCash",
        easypaisa: "Easypaisa",
        bank: "Bank Transfer"
      }[paymentMethod] || paymentMethod.toUpperCase();
      const shortOrderId = order._id.slice(-6).toUpperCase();
      const msg = [`✨ *MOONSCENTS — ORDER PLACED* ✨`, `Reference: #${shortOrderId}`, ``, `*CUSTOMER DETAILS*`, `━━━━━━━━━━━━━━━━━━━━━`, `👤 Name: ${parsed.data.customer_name}`, `📞 Phone: ${parsed.data.customer_phone}`, `📧 Email: ${parsed.data.customer_email}`, `📍 Address: ${parsed.data.address}, ${parsed.data.city}`, ``, `*ORDER SUMMARY*`, `━━━━━━━━━━━━━━━━━━━━━`, items.map((i) => `🔸 ${i.name} (x${i.quantity})  ........  PKR ${(i.price * i.quantity).toLocaleString()}`).join("\n"), ``, `*PAYMENT & TOTAL*`, `━━━━━━━━━━━━━━━━━━━━━`, `💳 Method: ${paymentDisplay}`, `💰 Total Amount: PKR ${total.toLocaleString()}`, parsed.data.notes ? `
📝 *Notes:* ${parsed.data.notes}` : ""].filter(Boolean).join("\n");
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      toast.success("Order placed! Redirecting to WhatsApp...");
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        navigate({
          to: "/order-confirmation",
          search: {
            id: order._id,
            payment: paymentMethod
          }
        });
      }, 1e3);
    } catch (err) {
      console.error("!! Checkout: Payment/Order Failure:", err);
      const msg = err instanceof Error ? err.message : "Could not place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }
  if (items.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-24 max-w-xl mx-auto px-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl text-silver-gradient", children: "Your cart is empty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "inline-block mt-8 text-xs tracking-luxe uppercase text-silver border-b border-silver/40 pb-1", children: "Explore the Collection" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-24 max-w-6xl mx-auto px-6 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-4", children: "Checkout" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl md:text-5xl text-silver-gradient mb-12", children: "Complete your order" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver mb-4", children: "Delivery details" }),
        [["customer_name", "Full name", "text"], ["customer_email", "Email", "email"], ["customer_phone", "Phone (e.g. 03001234567)", "tel"], ["address", "Street address", "text"], ["city", "City", "text"]].map(([k, label, type]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, placeholder: label, value: form[k], onChange: set(k), required: true, className: `w-full bg-transparent border ${errors[k] ? "border-red-900/50" : "border-border"} px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk` }),
          errors[k] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "absolute -bottom-5 left-0 text-[10px] text-red-500 uppercase tracking-luxe", children: errors[k] })
        ] }, k)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Order notes (optional)", value: form.notes, onChange: set("notes"), rows: 3, maxLength: 500, className: "w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver mb-4", children: "Payment" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [["cod", "Cash on Delivery", "Pay in cash when your fragrance arrives."], ["jazzcash", "JazzCash", "Pay via JazzCash — details sent on WhatsApp."], ["easypaisa", "Easypaisa", "Pay via Easypaisa — details sent on WhatsApp."], ["bank", "Bank Transfer", "Pay via bank transfer — details sent on WhatsApp."]].map(([method, title, caption]) => /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "border border-silver/60 px-4 py-4 block cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "payment_method", checked: paymentMethod === method, onChange: () => setPaymentMethod(method), className: "mt-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-silver-muted mt-1", children: caption })
            ] })
          ] }) }, method)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full bg-silver text-primary-foreground px-8 py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon disabled:opacity-50 mt-8", children: loading ? "Placing order..." : paymentMethod === "card" ? `Pay by Card — PKR ${subtotal.toLocaleString()}` : `Place order — PKR ${subtotal.toLocaleString()}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "bg-card p-8 border border-border h-fit lg:sticky lg:top-28", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver mb-6", children: "Order summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-5 mb-6", children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-16 bg-background overflow-hidden flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: i.image, alt: i.name, className: "w-full h-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-base text-silver", children: i.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-silver-muted", children: [
              "Qty ",
              i.quantity
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-silver", children: [
            "PKR ",
            (i.price * i.quantity).toLocaleString()
          ] })
        ] }, i.slug)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-silver-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Subtotal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "PKR ",
              subtotal.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-silver-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Shipping" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: subtotal >= 1e4 ? "Free" : "PKR 350" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-display text-xl text-silver pt-3 border-t border-border mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "PKR ",
              (subtotal + (subtotal >= 1e4 ? 0 : 350)).toLocaleString()
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  CheckoutPage as component
};
