import { U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { L as Link } from "./router-BW0LjCeT.js";
import { m as motion } from "./Layout-CmawR06Z.js";
function ProductCard({ product, index = 0 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/product/$slug",
          params: { slug: product.slug },
          className: "group block",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-lunar opacity-60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: product.image,
                  alt: product.name,
                  loading: "lazy",
                  width: 900,
                  height: 1200,
                  className: "relative w-full h-full object-cover transition-silk group-hover:scale-105"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-silk", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block text-[11px] tracking-luxe uppercase text-moonlight border border-silver/40 px-4 py-2 backdrop-blur-md bg-background/30", children: "Discover" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-6 flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted mb-2", children: product.family }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl text-silver", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver-muted mt-1 italic", children: product.tagline })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-silver whitespace-nowrap pt-7", children: [
                "PKR ",
                product.price.toLocaleString()
              ] })
            ] })
          ]
        }
      )
    }
  );
}
export {
  ProductCard as P
};
