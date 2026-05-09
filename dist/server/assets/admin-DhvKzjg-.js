import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-Dqm-cmBp.js";
import { b as useAuth, u as useNavigate, a as apiRequest, t as toast, s as supabase } from "./router-BW0LjCeT.js";
import { L as Layout } from "./Layout-CmawR06Z.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const emptyProductForm = {
  slug: "",
  name: "",
  family: "",
  tagline: "",
  description: "",
  notesTop: "",
  notesHeart: "",
  notesBase: "",
  ml: "50",
  perfumeType: "EDP",
  image: "",
  price: "",
  stock: "",
  variants: []
};
function AdminPage() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = reactExports.useState("orders");
  const [orders, setOrders] = reactExports.useState([]);
  const [products, setProducts] = reactExports.useState([]);
  const [form, setForm] = reactExports.useState(emptyProductForm);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [uploading, setUploading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) navigate({
      to: "/auth"
    });
    else if (!isAdmin) navigate({
      to: "/"
    });
  }, [loading, user, isAdmin, navigate]);
  reactExports.useEffect(() => {
    if (!isAdmin) return;
    void refresh();
  }, [isAdmin]);
  async function refresh() {
    const [o, p] = await Promise.all([apiRequest("/api/orders"), apiRequest("/api/products")]);
    setOrders(o ?? []);
    setProducts(p ?? []);
  }
  function setFormField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }
  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `perfumes/${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from("products").upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("products").getPublicUrl(filePath);
      setFormField("image", publicUrl);
      toast.success("Image uploaded to cloud successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setUploading(false);
    }
  }
  async function saveProduct() {
    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      family: form.family.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      notes: {
        top: form.notesTop.trim(),
        heart: form.notesHeart.trim(),
        base: form.notesBase.trim()
      },
      ml: Number(form.ml),
      perfumeType: form.perfumeType,
      image: form.image.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      variants: form.variants.map((v) => ({
        ml: Number(v.ml),
        price: Number(v.price),
        stock: Number(v.stock)
      }))
    };
    if (!payload.slug || !payload.name || !payload.image || Number.isNaN(payload.price)) {
      toast.error("Please complete all product fields");
      return;
    }
    try {
      if (editingId) {
        await apiRequest(`/api/products/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload)
        });
        toast.success("Product updated");
      } else {
        await apiRequest("/api/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        toast.success("Product created");
      }
      setEditingId(null);
      setForm(emptyProductForm);
      await refresh();
    } catch (err) {
      toast.error(err.message || "Failed to save product");
      console.error(err);
    }
  }
  async function updateOrderStatus(id, status) {
    try {
      if (!id) throw new Error("Order ID is missing");
      await apiRequest(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status
        })
      });
      toast.success("Status updated");
      void refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update status");
      console.error("Update failed:", err);
    }
  }
  async function deleteProduct(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      await apiRequest(`/api/products/${id}`, {
        method: "DELETE"
      });
      toast.success("Product deleted");
      void refresh();
    } catch (err) {
      toast.error("Failed to delete");
    }
  }
  function startEditProduct(product) {
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      name: product.name,
      family: product.family,
      tagline: product.tagline,
      description: product.description || "",
      notesTop: product.notes?.top || "",
      notesHeart: product.notes?.heart || "",
      notesBase: product.notes?.base || "",
      ml: String(product.ml || 50),
      perfumeType: product.perfumeType || "EDP",
      image: product.image,
      price: String(product.price),
      stock: String(product.stock),
      variants: (product.variants || []).map((v) => ({
        ml: String(v.ml),
        price: String(v.price),
        stock: String(v.stock)
      }))
    });
    setTab("products");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  if (loading || !isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "pt-40 pb-24 max-w-xl mx-auto px-6 text-center text-silver-muted", children: "Loading..." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs tracking-luxe uppercase text-silver-muted mb-3", children: "Admin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-5xl text-silver-gradient mb-10", children: "Atelier" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-8 border-b border-border mb-10", children: ["orders", "products"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `pb-4 text-xs tracking-luxe uppercase transition-silk ${tab === t ? "text-silver border-b border-silver" : "text-silver-muted hover:text-silver"}`, children: t }, t)) }),
    tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3", children: "Customer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3", children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3", children: "Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left py-3 pl-6", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: orders.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-silver-muted", children: new Date(o.created_at).toLocaleDateString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver", children: o.customer_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-silver-muted", children: o.customer_email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver text-[11px]", children: o.address }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-silver-muted text-[10px] uppercase tracking-wider", children: o.city })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] tracking-luxe uppercase text-silver-muted border border-border px-2 py-1", children: o.payment_method }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-4 text-right text-silver", children: [
          "PKR ",
          o.total_amount.toLocaleString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 pl-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: o.status, onChange: (e) => updateOrderStatus(o.id, e.target.value), className: "bg-transparent border border-border px-3 py-2 text-xs text-silver", children: ["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, className: "bg-card", children: s }, s)) }) })
      ] }, o.id)) })
    ] }) }),
    tab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border p-6 mb-12 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm tracking-luxe uppercase text-silver", children: editingId ? "Edit Scent" : "Create New Scent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.name, onChange: (e) => setFormField("name", e.target.value), placeholder: "Fragrance Name", className: "bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.slug, onChange: (e) => setFormField("slug", e.target.value), placeholder: "URL Slug (e.g. noor-e-qamar)", className: "bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none" }),
          form.slug !== "discovery-kit" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.family, onChange: (e) => setFormField("family", e.target.value), placeholder: "Scent Family (e.g. Woody Spicy)", className: "bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.tagline, onChange: (e) => setFormField("tagline", e.target.value), placeholder: "Luxury Tagline", className: "bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.description, onChange: (e) => setFormField("description", e.target.value), placeholder: "Fragrance Description", rows: 3, className: "bg-transparent border border-border px-4 py-3 text-sm text-silver md:col-span-2 focus:border-silver outline-none" })
          ] }),
          form.slug !== "discovery-kit" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.notesTop, onChange: (e) => setFormField("notesTop", e.target.value), placeholder: "Top Notes", className: "bg-transparent border border-border px-3 py-2 text-sm text-silver focus:border-silver outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.notesHeart, onChange: (e) => setFormField("notesHeart", e.target.value), placeholder: "Heart Notes", className: "bg-transparent border border-border px-3 py-2 text-sm text-silver focus:border-silver outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.notesBase, onChange: (e) => setFormField("notesBase", e.target.value), placeholder: "Base Notes", className: "bg-transparent border border-border px-3 py-2 text-sm text-silver focus:border-silver outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 md:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: "Product Image" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: form.image, onChange: (e) => setFormField("image", e.target.value), placeholder: "Image URL", className: "flex-1 bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer bg-silver text-primary-foreground px-6 py-3 text-[10px] tracking-luxe uppercase hover:bg-moonlight transition-silk text-center flex items-center justify-center min-w-[140px]", children: [
                uploading ? "Uploading..." : "Upload File",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: "image/*", onChange: handleFileUpload, className: "hidden", disabled: uploading })
              ] })
            ] }),
            form.image && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-32 w-32 border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: form.image, alt: "Preview", className: "w-full h-full object-cover" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.price, onChange: (e) => setFormField("price", e.target.value), placeholder: "Price (PKR)", className: "bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: form.stock, onChange: (e) => setFormField("stock", e.target.value), placeholder: "Stock Qty", className: "bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: saveProduct, className: "bg-silver text-primary-foreground px-8 py-3 text-[10px] tracking-luxe uppercase hover:bg-moonlight transition-silk", children: editingId ? "Update Product" : "Launch Product" }),
          editingId && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setEditingId(null);
            setForm(emptyProductForm);
          }, className: "text-[10px] tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk", children: "Cancel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
        products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-dashed border-border p-12 text-center text-silver-muted", children: "No products found in the vault." }),
        products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border p-6 flex items-center justify-between group hover:border-silver/40 transition-silk", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 border border-border overflow-hidden bg-card/50", children: p.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center text-[10px] uppercase", children: "No Image" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl text-silver", children: p.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] tracking-luxe uppercase text-silver-muted", children: [
                p.family,
                " · PKR ",
                p.price?.toLocaleString(),
                " · ",
                p.active ? "Live" : "Hidden"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => startEditProduct(p), className: "text-[10px] tracking-luxe uppercase text-silver-muted hover:text-silver px-3 py-2 border border-border hover:border-silver transition-silk", children: "Edit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteProduct(p.id || p._id), className: "text-[10px] tracking-luxe uppercase text-red-400/60 hover:text-red-400 px-3 py-2 border border-red-500/20 hover:border-red-500/40 transition-silk", children: "Delete" })
          ] })
        ] }, p.id || p._id))
      ] })
    ] })
  ] }) });
}
export {
  AdminPage as component
};
