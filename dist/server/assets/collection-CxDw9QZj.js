import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import { P as ProductCard } from "./ProductCard-BIJuclZK.js";
import { a as apiRequest } from "./router-BW0LjCeT.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function CollectionPage() {
  const [products, setProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await apiRequest("/api/products");
        const standardProducts = (results || []).filter((p) => p.slug !== "discovery-kit");
        setProducts(standardProducts);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchProducts();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-4", children: "The Collection" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl md:text-6xl lg:text-7xl text-silver-gradient max-w-3xl leading-tight mb-6", children: "Every bottle, a phase of night." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-xl text-silver-muted leading-relaxed", children: "Five fragrances composed in our Karachi atelier — each captures a different mood of the moon, from the hush of new light to the slow burn of midnight." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-7xl mx-auto px-6 lg:px-10 pb-24", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-silver-muted", children: "Loading collection..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12", children: products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: i }, p.slug)) }) })
  ] });
}
export {
  CollectionPage as component
};
