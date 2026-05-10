import { createFileRoute, Link, useRouter, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Product = {
  id: string;
  slug: string;
  name: string;
  family: string;
  tagline: string;
  description: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
  ml: number;
  perfume_type: string;
  image: string;
  price: number;
  variants?: {
    ml: number;
    price: number;
    stock: number;
  }[];
};

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", params.slug)
      .eq("active", true)
      .single();
    if (error || !data) throw notFound();
    return { product: data as Product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Moonscents` },
          { name: "description", content: loaderData.product.tagline },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <Layout>
        <div className="pt-40 max-w-xl mx-auto px-6 text-center">
          <p className="text-silver">{error.message}</p>
          <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 text-xs tracking-luxe uppercase text-silver-muted hover:text-silver">Try again</button>
        </div>
      </Layout>
    );
  },
  notFoundComponent: () => (
    <Layout>
      <div className="pt-40 max-w-xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl text-silver-gradient">Fragrance not found</h1>
        <Link to="/collection" className="inline-block mt-8 text-xs tracking-luxe uppercase text-silver border-b border-silver/40 pb-1">View collection</Link>
      </div>
    </Layout>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [selectedMl, setSelectedMl] = useState(product.ml);
  const { add, openCart } = useCart();

  const selectedPrice = product.variants?.find(v => v.ml === selectedMl)?.price || product.price;

  useEffect(() => {
    async function fetchRecommendations() {
      const { data } = await supabase
        .from("products")
        .select("id, slug, name, family, tagline, price, image, ml, perfume_type, description, notes, variants")
        .eq("active", true)
        .neq("slug", product.slug)
        .limit(3);
      if (data) setRecommendations(data as Product[]);
    }
    void fetchRecommendations();
  }, [product.slug]);

  const handleAdd = () => {
    add({
      slug: product.slug,
      name: product.name,
      price: selectedPrice,
      image: product.image,
      ml: selectedMl,
    });
    toast.success(`${product.name} added to cart`);
    openCart();
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[3/4] bg-card overflow-hidden lg:sticky lg:top-28"
          >
            <div className="absolute inset-0 bg-lunar" />
            <img src={product.image} alt={product.name} width={900} height={1200} className="relative w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p className="text-xs tracking-luxe uppercase text-silver-muted mb-6">{product.family} · {product.perfume_type}</p>
            <h1 className="font-display text-5xl md:text-6xl text-silver-gradient mb-4">{product.name}</h1>
            <p className="font-display text-xl italic text-silver-muted">{product.tagline}</p>

            <div className="mt-10 h-px w-16 bg-silver/40" />

            <p className="mt-10 text-base leading-[1.8] text-silver-muted whitespace-pre-wrap">{product.description}</p>

            <div className="mt-12 space-y-6">
              <p className="text-xs tracking-luxe uppercase text-silver">Composition</p>
              {([
                ["Top", product.notes?.top],
                ["Heart", product.notes?.heart],
                ["Base", product.notes?.base],
              ] as const)
                .filter(([_, notes]) => notes)
                .map(([label, notes]) => (
                <div key={label} className="grid grid-cols-[80px_1fr] gap-6 items-baseline border-b border-border pb-4">
                  <p className="text-[10px] tracking-luxe uppercase text-silver-muted">{label}</p>
                  <p className="font-display text-lg text-silver">{notes}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-8">
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs tracking-luxe uppercase text-silver">Select Size</p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setSelectedMl(product.ml)}
                      className={`px-6 py-2 border text-[11px] tracking-luxe uppercase transition-silk ${
                        selectedMl === product.ml ? "border-silver text-silver bg-silver/10" : "border-border text-silver-muted hover:border-silver/50"
                      }`}
                    >
                      {product.ml}ml
                    </button>
                    {product.variants.map((v) => (
                      <button
                        key={v.ml}
                        onClick={() => setSelectedMl(v.ml)}
                        className={`px-6 py-2 border text-[11px] tracking-luxe uppercase transition-silk ${
                          selectedMl === v.ml ? "border-silver text-silver bg-silver/10" : "border-border text-silver-muted hover:border-silver/50"
                        }`}
                      >
                        {v.ml}ml
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex items-end justify-between gap-6">
              <div>
                <p className="text-[10px] tracking-luxe uppercase text-silver-muted">{selectedMl}ml · {product.perfume_type}</p>
                <p className="font-display text-3xl text-silver mt-2">PKR {selectedPrice.toLocaleString()}</p>
              </div>
              <button onClick={handleAdd} className="flex-1 max-w-xs bg-silver text-primary-foreground px-8 py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon">
                Add to Cart
              </button>
            </div>

            <p className="mt-8 text-xs text-silver-muted leading-relaxed">
              Free delivery across Pakistan on orders above PKR 10,000. Cash on delivery, JazzCash, Easypaisa, and card payments accepted.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 border-t border-border">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-10">You may also love</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {recommendations.map((p, i) => (
            <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-card">
                <img src={p.image} alt={p.name} loading="lazy" width={900} height={1200} className="w-full h-full object-cover transition-silk group-hover:scale-105" />
              </div>
              <p className="font-display text-xl text-silver mt-4">{p.name}</p>
              <p className="text-xs text-silver-muted italic">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
