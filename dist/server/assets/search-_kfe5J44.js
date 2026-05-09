import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { R as Route, L as Link, a as apiRequest } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function SearchPage() {
  const {
    q
  } = Route.useSearch();
  const [products, setProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const results = await apiRequest(`/api/products/search?q=${encodeURIComponent(q || "")}`);
        setProducts(results || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchResults();
  }, [q]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-24 max-w-7xl mx-auto px-6 lg:px-10 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-3", children: "Search results" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl text-silver-gradient mb-12", children: q ? `"${q}"` : "Search our collection" }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-silver-muted py-20", children: "Searching..." }) : products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-silver-muted py-20", children: "No products found matching your search." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16", children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/product/$slug", params: {
      slug: product.slug
    }, className: "group block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/5] overflow-hidden mb-6 bg-card border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.name, className: "w-full h-full object-cover transition-silk group-hover:scale-105" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: product.family }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-silver group-hover:text-silver-muted transition-silk", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-silver-muted italic line-clamp-1", children: product.tagline }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-silver mt-2", children: [
          "PKR ",
          product.price.toLocaleString()
        ] })
      ] })
    ] }, product._id)) })
  ] }) });
}
export {
  SearchPage as component
};
