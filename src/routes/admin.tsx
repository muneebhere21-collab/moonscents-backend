import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Moonscents" }] }),
});

type Order = {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  payment_method: string;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  ml: number;
  perfumeType: string;
  image: string;
  stock: number;
  price: number;
  family: string;
  active: boolean;
  variants?: {
    ml: number;
    price: number;
    stock: number;
  }[];
};

type ProductForm = {
  slug: string;
  name: string;
  family: string;
  tagline: string;
  description: string;
  notesTop: string;
  notesHeart: string;
  notesBase: string;
  ml: string;
  perfumeType: string;
  image: string;
  price: string;
  stock: string;
  variants: { ml: string; price: string; stock: string }[];
};

const emptyProductForm: ProductForm = {
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
  variants: [],
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/" });
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    void refresh();
  }, [isAdmin]);

  async function refresh() {
    const [{ data: o }, { data: p }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
    ]);
    setOrders((o ?? []) as Order[]);
    setProducts((p ?? []) as Product[]);
  }

  function setFormField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `perfumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

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
        base: form.notesBase.trim(),
      },
      ml: Number(form.ml),
      perfumeType: form.perfumeType,
      image: form.image.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      variants: form.variants.map(v => ({
        ml: Number(v.ml),
        price: Number(v.price),
        stock: Number(v.stock),
      })),
    };

    if (!payload.slug || !payload.name || !payload.image || Number.isNaN(payload.price)) {
      toast.error("Please complete all product fields");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product created");
      }

      setEditingId(null);
      setForm(emptyProductForm);
      await refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
      console.error(err);
    }
  }

  async function updateOrderStatus(id: string, status: string) {
    try {
      if (!id) throw new Error("Order ID is missing");
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
      toast.success("Status updated");
      void refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      console.error("Update failed:", err);
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm("Are you sure?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      toast.success("Product deleted");
      void refresh();
    } catch (err) {
      toast.error("Failed to delete");
    }
  }

  function startEditProduct(product: Product) {
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
      variants: (product.variants || []).map(v => ({
        ml: String(v.ml),
        price: String(v.price),
        stock: String(v.stock),
      })),
    });
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading || !isAdmin) {
    return (
      <Layout>
        <section className="pt-40 pb-24 max-w-xl mx-auto px-6 text-center text-silver-muted">
          Loading...
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-3">Admin</p>
        <h1 className="font-display text-5xl text-silver-gradient mb-10">Atelier</h1>

        <div className="flex gap-8 border-b border-border mb-10">
          {(["orders", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 text-xs tracking-luxe uppercase transition-silk ${
                tab === t ? "text-silver border-b border-silver" : "text-silver-muted hover:text-silver"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-luxe uppercase text-silver-muted">
                <tr className="border-b border-border">
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Customer</th>
                  <th className="text-left py-3">Location</th>
                  <th className="text-left py-3">Payment</th>
                  <th className="text-right py-3">Total</th>
                  <th className="text-left py-3 pl-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border/60">
                    <td className="py-4 text-silver-muted">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <p className="text-silver">{o.customer_name}</p>
                      <p className="text-[11px] text-silver-muted">{o.customer_email}</p>
                    </td>
                    <td className="py-4">
                      <p className="text-silver text-[11px]">{o.address}</p>
                      <p className="text-silver-muted text-[10px] uppercase tracking-wider">{o.city}</p>
                    </td>
                    <td className="py-4">
                      <span className="text-[10px] tracking-luxe uppercase text-silver-muted border border-border px-2 py-1">
                        {o.payment_method}
                      </span>
                    </td>
                    <td className="py-4 text-right text-silver">PKR {o.total_amount.toLocaleString()}</td>
                    <td className="py-4 pl-6">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="bg-transparent border border-border px-3 py-2 text-xs text-silver"
                      >
                        {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                          <option key={s} value={s} className="bg-card">{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "products" && (
          <div>
            <div className="border border-border p-6 mb-12 space-y-6">
              <h2 className="text-sm tracking-luxe uppercase text-silver">
                {editingId ? "Edit Scent" : "Create New Scent"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  value={form.name}
                  onChange={(e) => setFormField("name", e.target.value)}
                  placeholder="Fragrance Name"
                  className="bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none"
                />
                <input
                  value={form.slug}
                  onChange={(e) => setFormField("slug", e.target.value)}
                  placeholder="URL Slug (e.g. noor-e-qamar)"
                  className="bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none"
                />
                {form.slug !== 'discovery-kit' && (
                  <>
                    <input
                      value={form.family}
                      onChange={(e) => setFormField("family", e.target.value)}
                      placeholder="Scent Family (e.g. Woody Spicy)"
                      className="bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none"
                    />
                    <input
                      value={form.tagline}
                      onChange={(e) => setFormField("tagline", e.target.value)}
                      placeholder="Luxury Tagline"
                      className="bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none"
                    />
                    <textarea
                      value={form.description}
                      onChange={(e) => setFormField("description", e.target.value)}
                      placeholder="Fragrance Description"
                      rows={3}
                      className="bg-transparent border border-border px-4 py-3 text-sm text-silver md:col-span-2 focus:border-silver outline-none"
                    />
                  </>
                )}

                {form.slug !== 'discovery-kit' && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      value={form.notesTop}
                      onChange={(e) => setFormField("notesTop", e.target.value)}
                      placeholder="Top Notes"
                      className="bg-transparent border border-border px-3 py-2 text-sm text-silver focus:border-silver outline-none"
                    />
                    <input
                      value={form.notesHeart}
                      onChange={(e) => setFormField("notesHeart", e.target.value)}
                      placeholder="Heart Notes"
                      className="bg-transparent border border-border px-3 py-2 text-sm text-silver focus:border-silver outline-none"
                    />
                    <input
                      value={form.notesBase}
                      onChange={(e) => setFormField("notesBase", e.target.value)}
                      placeholder="Base Notes"
                      className="bg-transparent border border-border px-3 py-2 text-sm text-silver focus:border-silver outline-none"
                    />
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] tracking-luxe uppercase text-silver-muted">Product Image</label>
                  <div className="flex gap-4">
                    <input
                      value={form.image}
                      onChange={(e) => setFormField("image", e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none"
                    />
                    <label className="cursor-pointer bg-silver text-primary-foreground px-6 py-3 text-[10px] tracking-luxe uppercase hover:bg-moonlight transition-silk text-center flex items-center justify-center min-w-[140px]">
                      {uploading ? "Uploading..." : "Upload File"}
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                    </label>
                  </div>
                  {form.image && (
                    <div className="mt-4 h-32 w-32 border border-border overflow-hidden">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setFormField("price", e.target.value)}
                    placeholder="Price (PKR)"
                    className="bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none"
                  />
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setFormField("stock", e.target.value)}
                    placeholder="Stock Qty"
                    className="bg-transparent border border-border px-4 py-3 text-sm text-silver focus:border-silver outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={saveProduct}
                  className="bg-silver text-primary-foreground px-8 py-3 text-[10px] tracking-luxe uppercase hover:bg-moonlight transition-silk"
                >
                  {editingId ? "Update Product" : "Launch Product"}
                </button>
                {editingId && (
                  <button
                    onClick={() => { setEditingId(null); setForm(emptyProductForm); }}
                    className="text-[10px] tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {products.length === 0 && (
                <div className="border border-dashed border-border p-12 text-center text-silver-muted">
                  No products found in the vault.
                </div>
              )}
              {products.map((p) => (
                <div key={p.id || (p as any)._id} className="border border-border p-6 flex items-center justify-between group hover:border-silver/40 transition-silk">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 border border-border overflow-hidden bg-card/50">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase">No Image</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-silver">{p.name}</h3>
                      <p className="text-[10px] tracking-luxe uppercase text-silver-muted">
                        {p.family} · PKR {p.price?.toLocaleString()} · {p.active ? "Live" : "Hidden"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => startEditProduct(p)} className="text-[10px] tracking-luxe uppercase text-silver-muted hover:text-silver px-3 py-2 border border-border hover:border-silver transition-silk">Edit</button>
                    <button onClick={() => deleteProduct(p.id || (p as any)._id)} className="text-[10px] tracking-luxe uppercase text-red-400/60 hover:text-red-400 px-3 py-2 border border-red-500/20 hover:border-red-500/40 transition-silk">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
