import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { d as useCart, u as useNavigate, a as apiRequest, t as toast } from "./router-BW0LjCeT.js";
import { c as createLucideIcon, L as Layout, m as motion, X } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode);
function DiscoveryKitPage() {
  const [products, setProducts] = reactExports.useState([]);
  const [kitProduct, setKitProduct] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [step, setStep] = reactExports.useState("selection");
  const [personalization, setPersonalization] = reactExports.useState({
    name: "",
    occasion: ""
  });
  const {
    add,
    openCart
  } = useCart();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await apiRequest("/api/products");
        if (results) {
          const kit = results.find((p) => p.slug === "discovery-kit");
          if (kit) setKitProduct(kit);
          setProducts(results.filter((p) => p.slug !== "discovery-kit"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    void fetchProducts();
  }, []);
  const toggleSelect = (p) => {
    if (selected.find((s) => s.slug === p.slug)) {
      setSelected(selected.filter((s) => s.slug !== p.slug));
    } else if (selected.length < 4) {
      setSelected([...selected, p]);
    } else {
      toast.error("Maximum 4 fragrances selected.");
    }
  };
  const handleAddToCart = () => {
    const selectionNames = selected.map((s) => s.name).join(", ");
    const customText = `Kit for: ${personalization.name || "Customer"}${personalization.occasion ? ` (${personalization.occasion})` : ""} — Scents: ${selectionNames}`;
    const price = kitProduct?.price || 5e3;
    const image = kitProduct?.image || "/discovery-kit-box.jpg";
    add({
      slug: "discovery-kit",
      name: kitProduct?.name || "Custom Discovery Kit",
      price,
      image,
      customSelection: customText,
      ml: 20
    });
    toast.success("Discovery Kit added to cart");
    openCart();
    navigate({
      to: "/"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-32 min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-10 pb-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mb-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
        opacity: 0,
        y: 10
      }, animate: {
        opacity: 1,
        y: 0
      }, className: "text-xs tracking-luxe uppercase text-silver-muted mb-4", children: "The Experience" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.1
      }, className: "font-display text-5xl md:text-7xl text-silver-gradient", children: "Create Your Signature Discovery Kit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        delay: 0.2
      }, className: "mt-6 text-silver-muted text-lg max-w-xl", children: "Select 4 fragrances from our collection and experience them before choosing your signature scent." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-16 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-8", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-silver-muted animate-pulse", children: "Loading fragrances..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-8", children: products.map((p, i) => {
        const isSelected = selected.find((s) => s.slug === p.slug);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          delay: i * 0.05
        }, onClick: () => toggleSelect(p), className: `group relative cursor-pointer border p-6 transition-silk ${isSelected ? "border-silver bg-silver/5 shadow-[0_0_30px_rgba(192,192,192,0.1)]" : "border-border hover:border-silver/30 bg-card/20"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: p.family }),
            isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-silver" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-silver mb-2", children: p.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver-muted italic leading-relaxed", children: p.tagline }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 relative aspect-square overflow-hidden opacity-80 group-hover:opacity-100 transition-silk", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, className: "w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-silk" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `mt-6 w-full py-3 text-[10px] tracking-luxe uppercase border transition-silk ${isSelected ? "bg-silver text-primary-foreground border-silver" : "border-border text-silver group-hover:border-silver"}`, children: isSelected ? "Added to Kit" : "Add to Kit" })
        ] }, p.slug);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-4 sticky top-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "backdrop-blur-xl bg-background/40 border border-silver/20 p-8 rounded-sm shadow-luxe", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted mb-6", children: "Your Discovery Kit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 mb-10", children: [0, 1, 2, 3].map((idx) => {
          const item = selected[idx];
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between border-b border-border pb-4 h-12", children: item ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-silver", children: item.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleSelect(item), className: "text-silver-muted hover:text-red-400 transition-silk", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted/40 italic", children: [
            "Slot ",
            idx + 1,
            " Empty"
          ] }) }, idx);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted", children: "Counter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-silver font-medium", children: [
            selected.length,
            " / 4 Selected"
          ] })
        ] }),
        selected.length === 4 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: "Name for Kit (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: personalization.name, onChange: (e) => setPersonalization({
              ...personalization,
              name: e.target.value
            }), placeholder: "e.g. Muneeb's Selection", className: "w-full bg-transparent border border-border p-3 text-xs text-silver outline-none focus:border-silver transition-silk" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAddToCart, className: "w-full bg-silver text-primary-foreground py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon", children: [
            "Add Kit to Cart — PKR ",
            (kitProduct?.price || 5e3).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected([]), className: "w-full text-[10px] tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk", children: "Reset Kit" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-silver/5 border border-silver/10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: "Select 4 fragrances to proceed" }) })
      ] }) })
    ] })
  ] }) }) });
}
export {
  DiscoveryKitPage as component
};
