import { U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { L as Link } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const entries = [{
  date: "April 2026",
  title: "On wearing scent at night",
  excerpt: "Why a fragrance reads differently after the sun has set, and how we compose for that hour."
}, {
  date: "March 2026",
  title: "The architecture of oud",
  excerpt: "A short essay on the slow, smouldering material at the heart of Eclipse."
}, {
  date: "February 2026",
  title: "Letters from Karachi",
  excerpt: "Field notes from our atelier — the markets, the materials, the moon over the Arabian Sea."
}];
function JournalPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-40 pb-12 max-w-4xl mx-auto px-6 lg:px-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-6", children: "Journal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl md:text-6xl text-silver-gradient", children: "Notes from the atelier." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-4xl mx-auto px-6 lg:px-10 pb-24 divide-y divide-border", children: entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "py-12 grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted pt-2", children: e.date }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl text-silver group-hover:text-moonlight transition-silk", children: e.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-silver-muted leading-relaxed", children: e.excerpt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/journal", className: "inline-block mt-4 text-xs tracking-luxe uppercase text-silver-muted hover:text-silver border-b border-silver/30 pb-1", children: "Read" })
      ] })
    ] }, e.title)) })
  ] });
}
export {
  JournalPage as component
};
