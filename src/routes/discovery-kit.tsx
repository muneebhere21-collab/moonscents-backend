import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { X, Check } from "lucide-react";

type Product = {
  id: string;
  slug: string;
  name: string;
  family: string;
  tagline: string;
  image: string;
  price: number;
};

export const Route = createFileRoute("/discovery-kit")({
  component: DiscoveryKitPage,
  head: () => ({
    meta: [
      { title: "Build Your Discovery Kit — Moonscents" },
      { name: "description", content: "Select 4 fragrances from our collection and experience luxury before you decide." },
    ],
  }),
});

function DiscoveryKitPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [kitProduct, setKitProduct] = useState<Product | null>(null);
  const [selected, setSelected] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"selection" | "personalization">("selection");
  const [personalization, setPersonalization] = useState({ name: "", occasion: "" });
  
  const { add, openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await supabase
          .from("products")
          .select("id, slug, name, family, tagline, image, price")
          .eq("active", true)
          .order("created_at", { ascending: false });
        if (data) {
          const kit = data.find(p => p.slug === "discovery-kit");
          if (kit) setKitProduct(kit);
          setProducts(data.filter(p => p.slug !== "discovery-kit"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    void fetchProducts();
  }, []);

  const toggleSelect = (p: Product) => {
    if (selected.find(s => s.slug === p.slug)) {
      setSelected(selected.filter(s => s.slug !== p.slug));
    } else if (selected.length < 4) {
      setSelected([...selected, p]);
    } else {
      toast.error("Maximum 4 fragrances selected.");
    }
  };

  const handleAddToCart = () => {
    const selectionNames = selected.map(s => s.name).join(", ");
    const customText = `Kit for: ${personalization.name || "Customer"}${personalization.occasion ? ` (${personalization.occasion})` : ""} — Scents: ${selectionNames}`;
    
    const price = kitProduct?.price || 5000;
    const image = kitProduct?.image || "/discovery-kit-box.jpg";

    add({
      slug: "discovery-kit",
      name: kitProduct?.name || "Custom Discovery Kit",
      price: price,
      image: image,
      customSelection: customText,
      ml: 20
    });

    toast.success("Discovery Kit added to cart");
    openCart();
    navigate({ to: "/" });
  };

  return (
    <Layout>
      <div className="pt-32 min-h-screen bg-background">
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-32">
          {/* Hero */}
          <div className="max-w-3xl mb-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs tracking-luxe uppercase text-silver-muted mb-4"
            >
              The Experience
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-7xl text-silver-gradient"
            >
              Create Your Signature Discovery Kit
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-silver-muted text-lg max-w-xl"
            >
              Select 4 fragrances from our collection and experience them before choosing your signature scent.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {loading ? (
                <div className="text-silver-muted animate-pulse">Loading fragrances...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {products.map((p, i) => {
                    const isSelected = selected.find(s => s.slug === p.slug);
                    return (
                      <motion.div
                        key={p.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleSelect(p)}
                        className={`group relative cursor-pointer border p-6 transition-silk ${
                          isSelected 
                            ? "border-silver bg-silver/5 shadow-[0_0_30px_rgba(192,192,192,0.1)]" 
                            : "border-border hover:border-silver/30 bg-card/20"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-[10px] tracking-luxe uppercase text-silver-muted">{p.family}</p>
                          {isSelected && <Check className="w-4 h-4 text-silver" />}
                        </div>
                        <h3 className="font-display text-2xl text-silver mb-2">{p.name}</h3>
                        <p className="text-xs text-silver-muted italic leading-relaxed">{p.tagline}</p>
                        
                        <div className="mt-6 relative aspect-square overflow-hidden opacity-80 group-hover:opacity-100 transition-silk">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-silk" />
                        </div>

                        <button className={`mt-6 w-full py-3 text-[10px] tracking-luxe uppercase border transition-silk ${
                          isSelected ? "bg-silver text-primary-foreground border-silver" : "border-border text-silver group-hover:border-silver"
                        }`}>
                          {isSelected ? "Added to Kit" : "Add to Kit"}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 sticky top-32">
              <div className="backdrop-blur-xl bg-background/40 border border-silver/20 p-8 rounded-sm shadow-luxe">
                <p className="text-[10px] tracking-luxe uppercase text-silver-muted mb-6">Your Discovery Kit</p>
                
                <div className="space-y-6 mb-10">
                  {[0, 1, 2, 3].map((idx) => {
                    const item = selected[idx];
                    return (
                      <div key={idx} className="flex items-center justify-between border-b border-border pb-4 h-12">
                        {item ? (
                          <>
                            <p className="font-display text-lg text-silver">{item.name}</p>
                            <button onClick={() => toggleSelect(item)} className="text-silver-muted hover:text-red-400 transition-silk">
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <p className="text-[10px] tracking-luxe uppercase text-silver-muted/40 italic">Slot {idx + 1} Empty</p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mb-8">
                  <p className="text-xs tracking-luxe uppercase text-silver-muted">Counter</p>
                  <p className="text-sm text-silver font-medium">{selected.length} / 4 Selected</p>
                </div>

                {selected.length === 4 ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] tracking-luxe uppercase text-silver-muted">Name for Kit (Optional)</label>
                      <input 
                        type="text" 
                        value={personalization.name}
                        onChange={(e) => setPersonalization({...personalization, name: e.target.value})}
                        placeholder="e.g. Muneeb's Selection"
                        className="w-full bg-transparent border border-border p-3 text-xs text-silver outline-none focus:border-silver transition-silk"
                      />
                    </div>
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-silver text-primary-foreground py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon"
                    >
                      Add Kit to Cart — PKR {(kitProduct?.price || 5000).toLocaleString()}
                    </button>
                    <button 
                      onClick={() => setSelected([])}
                      className="w-full text-[10px] tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk"
                    >
                      Reset Kit
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-silver/5 border border-silver/10 text-center">
                    <p className="text-[10px] tracking-luxe uppercase text-silver-muted">Select 4 fragrances to proceed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
