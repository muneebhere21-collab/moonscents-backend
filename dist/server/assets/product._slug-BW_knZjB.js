import { M as useRouter, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BW0LjCeT.js";
const SplitErrorComponent = ({
  error,
  reset
}) => {
  const router = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-40 max-w-xl mx-auto px-6 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
      router.invalidate();
      reset();
    }, className: "mt-6 text-xs tracking-luxe uppercase text-silver-muted hover:text-silver", children: "Try again" })
  ] }) });
};
export {
  SplitErrorComponent as errorComponent
};
