import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { apiRequest } from "@/lib/api";

type Product = {
  _id: string;
  slug: string;
  name: string;
  family: string;
  tagline: string;
  price: number;
  image: string;
};

export const Route = createFileRoute("/collection")({
  component: CollectionPage,
  head: () => ({
    meta: [
      { title: "The Collection — Moonscents" },
      { name: "description", content: "Browse the full Moonscents fragrance collection — compositions inspired by phases of night." },
    ],
  }),
});

function CollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await apiRequest<Product[]>("/api/products");
        // Filter out the discovery kit from the standard collection grid
        const standardProducts = (results || []).filter(p => p.slug !== "discovery-kit");
        setProducts(standardProducts);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchProducts();
  }, []);

  return (
    <Layout>
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-4">The Collection</p>
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-silver-gradient max-w-3xl leading-tight mb-6">
          Every bottle, a phase of night.
        </h1>
        <p className="max-w-xl text-silver-muted leading-relaxed">
          Five fragrances composed in our Karachi atelier — each captures a different mood of the moon, from the hush of new light to the slow burn of midnight.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        {loading ? (
          <div className="text-silver-muted">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
