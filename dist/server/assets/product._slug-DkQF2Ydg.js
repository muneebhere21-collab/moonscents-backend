import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { f as Route, d as useCart, L as Link, a as apiRequest, t as toast } from "./router-BW0LjCeT.js";
import { L as Layout, m as motion } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function ProductPage() {
  const {
    product
  } = Route.useLoaderData();
  const [recommendations, setRecommendations] = reactExports.useState([]);
  const [selectedMl, setSelectedMl] = reactExports.useState(product.ml);
  const {
    add,
    openCart
  } = useCart();
  const selectedPrice = product.variants?.find((v) => v.ml === selectedMl)?.price || product.price;
  reactExports.useEffect(() => {
    async function fetchRecommendations() {
      const results = await apiRequest("/api/products");
      if (results) {
        setRecommendations(results.filter((p) => p.slug !== product.slug).slice(0, 3));
      }
    }
    void fetchRecommendations();
  }, [product.slug]);
  const handleAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      price: selectedPrice,
      image: product.image,
      ml: selectedMl
    });
    toast.success(`${product.name} added to cart`);
    openCart();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 1.04
      }, animate: {
        opacity: 1,
        scale: 1
      }, transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }, className: "relative aspect-[3/4] bg-card overflow-hidden lg:sticky lg:top-28", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-lunar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, width: 900, height: 1200, className: "relative w-full h-full object-cover" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 1,
        delay: 0.2
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-6", children: [
          product.family,
          " · ",
          product.perfumeType
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl md:text-6xl text-silver-gradient mb-4", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl italic text-silver-muted", children: product.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 h-px w-16 bg-silver/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-base leading-[1.8] text-silver-muted whitespace-pre-wrap", children: product.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver", children: "Composition" }),
          [["Top", product.notes?.top], ["Heart", product.notes?.heart], ["Base", product.notes?.base]].filter(([_, notes]) => notes).map(([label, notes]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_1fr] gap-6 items-baseline border-b border-border pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg text-silver", children: notes })
          ] }, label))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 space-y-8", children: product.variants && product.variants.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver", children: "Select Size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedMl(product.ml), className: `px-6 py-2 border text-[11px] tracking-luxe uppercase transition-silk ${selectedMl === product.ml ? "border-silver text-silver bg-silver/10" : "border-border text-silver-muted hover:border-silver/50"}`, children: [
              product.ml,
              "ml"
            ] }),
            product.variants.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedMl(v.ml), className: `px-6 py-2 border text-[11px] tracking-luxe uppercase transition-silk ${selectedMl === v.ml ? "border-silver text-silver bg-silver/10" : "border-border text-silver-muted hover:border-silver/50"}`, children: [
              v.ml,
              "ml"
            ] }, v.ml))
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex items-end justify-between gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: [
              selectedMl,
              "ml · ",
              product.perfumeType
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-3xl text-silver mt-2", children: [
              "PKR ",
              selectedPrice.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAdd, className: "flex-1 max-w-xs bg-silver text-primary-foreground px-8 py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon", children: "Add to Cart" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-xs text-silver-muted leading-relaxed", children: "Free delivery across Pakistan on orders above PKR 10,000. Cash on delivery, JazzCash, Easypaisa, and card payments accepted." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-10", children: "You may also love" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-10", children: recommendations.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/product/$slug", params: {
        slug: p.slug
      }, className: "group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[3/4] overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, loading: "lazy", width: 900, height: 1200, className: "w-full h-full object-cover transition-silk group-hover:scale-105" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl text-silver mt-4", children: p.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver-muted italic", children: p.tagline })
      ] }, p.slug)) })
    ] })
  ] });
}
export {
  ProductPage as component
};
