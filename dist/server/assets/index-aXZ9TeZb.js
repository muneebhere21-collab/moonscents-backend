import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { h as heroImg, L as Link, a as apiRequest, t as toast } from "./router-BW0LjCeT.js";
import { L as Layout, m as motion } from "./Layout-CmawR06Z.js";
import { P as ProductCard } from "./ProductCard-BIJuclZK.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function Index() {
  const [products, setProducts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const handleSubscribe = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    if (!email) return;
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to subscribe");
      toast.success("Welcome to the Moonscents society.");
      e.target.reset();
    } catch (err) {
      toast.error(err.message || "Failed to subscribe");
    }
  };
  reactExports.useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await apiRequest("/api/products");
        const standardProducts = (results || []).filter((p) => p.slug !== "discovery-kit");
        setProducts(standardProducts.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchProducts();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative h-[100svh] w-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.img, { src: heroImg, alt: "Crystal perfume bottle suspended beside a luminous moon", width: 1920, height: 1280, className: "absolute inset-0 w-full h-full object-cover", initial: {
        scale: 1.1,
        opacity: 0
      }, animate: {
        scale: 1,
        opacity: 1
      }, transition: {
        duration: 2.4,
        ease: [0.22, 1, 0.36, 1]
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 1,
          delay: 0.6
        }, className: "text-xs tracking-luxe uppercase text-silver-muted mb-6", children: "New Collection · MMXXVI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.h1, { initial: {
          opacity: 0,
          y: 30
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 1.2,
          delay: 0.9,
          ease: [0.22, 1, 0.36, 1]
        }, className: "font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-3xl text-silver-gradient", children: [
          "Worn by the night.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Composed by the moon."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 1,
          delay: 1.4
        }, className: "mt-8 max-w-md text-base text-silver-muted leading-relaxed", children: "A house of fragrances inspired by the quiet of moonlight crafted in small batches in Karachi, made to be worn close." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 1,
          delay: 1.7
        }, className: "mt-12 flex flex-wrap items-center gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/collection", className: "group inline-flex items-center gap-3 px-8 py-4 bg-silver text-primary-foreground text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk", children: [
            "Explore the Collection",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "transition-silk group-hover:translate-x-1", children: "→" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/discovery-kit", className: "group inline-flex items-center gap-3 px-8 py-4 border border-silver/40 text-silver text-xs tracking-luxe uppercase hover:bg-silver/10 transition-silk", children: "Build Your Discovery Kit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "text-xs tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk border-b border-silver/30 pb-1" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-luxe uppercase text-silver-muted", children: "Scroll" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-7xl mx-auto px-6 lg:px-10 py-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        duration: 1
      }, className: "flex items-end justify-between mb-16 flex-wrap gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-4", children: "The Collection" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl text-silver-gradient max-w-xl", children: "Our Timeless Unique Scents" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collection", className: "text-xs tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk border-b border-silver/30 pb-1", children: "View All" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-silver-muted", children: "Loading collection..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12", children: products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: i }, p.slug)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative py-40 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-lunar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-3xl mx-auto px-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.p, { initial: {
          opacity: 0
        }, whileInView: {
          opacity: 1
        }, viewport: {
          once: true
        }, transition: {
          duration: 1.2
        }, className: "text-xs tracking-luxe uppercase text-silver-muted mb-8", children: "The House" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.blockquote, { initial: {
          opacity: 0,
          y: 20
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          duration: 1.4
        }, className: "font-display text-3xl md:text-5xl leading-[1.15] text-silver-gradient italic", children: '"We compose for the hour the world quiets — when the moon is the only witness, and a scent becomes a memory."' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-xs tracking-luxe uppercase text-silver-muted", children: "— Moonscents Atelier, Karachi" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-3xl mx-auto px-6 py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl md:text-4xl text-silver-gradient mb-4", children: "Receive the new moon" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-silver-muted mb-8", children: "Quiet letters on releases, rituals, and the art of scent." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubscribe, className: "flex flex-col sm:flex-row gap-3 max-w-md mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", name: "email", required: true, placeholder: "your@email.com", className: "flex-1 bg-transparent border border-border px-4 py-3 text-sm placeholder:text-silver-muted text-silver focus:outline-none focus:border-silver transition-silk" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "bg-silver text-primary-foreground px-6 py-3 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk", children: "Subscribe" })
      ] })
    ] })
  ] });
}
export {
  Index as component
};
