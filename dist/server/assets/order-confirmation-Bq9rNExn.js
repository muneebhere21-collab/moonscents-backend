import { U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { c as Route, L as Link } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const WHATSAPP_NUMBER = "923303965260";
const paymentMessages = {
  cod: "Your fragrance will arrive at your door. Please have your payment ready in cash upon delivery.",
  jazzcash: "Please send your payment via JazzCash and share the screenshot on WhatsApp to confirm your order.",
  easypaisa: "Please send your payment via Easypaisa and share the screenshot on WhatsApp to confirm your order.",
  bank: "Please complete your bank transfer and share the receipt on WhatsApp to confirm your order."
};
function OrderConfirmation() {
  const {
    id,
    payment = "cod"
  } = Route.useSearch();
  const message = paymentMessages[payment] ?? paymentMessages.cod;
  const waText = encodeURIComponent(`🌙 Hi! I just placed an order on Moonscents.
Order reference: #${id?.slice(0, 8).toUpperCase() ?? "N/A"}
Payment method: ${payment.toUpperCase()}

Please confirm my order. Thank you!`);
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-32 max-w-xl mx-auto px-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-6", children: "Confirmed" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl md:text-6xl text-silver-gradient", children: "Thank you." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-8 text-silver-muted leading-relaxed", children: [
      "Your order has been received. ",
      message
    ] }),
    id && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-[11px] tracking-luxe uppercase text-silver-muted", children: [
      "Order reference · #",
      id.slice(0, 8).toUpperCase()
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: waUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-3 mt-10 bg-[#25D366] text-white px-8 py-4 text-xs tracking-luxe uppercase hover:bg-[#1ebe5d] transition-colors", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" }) }),
      "Chat on WhatsApp"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex items-center justify-center gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "text-xs tracking-luxe uppercase text-silver border-b border-silver/40 pb-1", children: "Continue shopping" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", className: "text-xs tracking-luxe uppercase text-silver-muted hover:text-silver", children: "View orders" })
    ] })
  ] }) });
}
export {
  OrderConfirmation as component
};
