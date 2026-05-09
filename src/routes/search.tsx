import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { apiRequest } from "@/lib/api";

type SearchParams = {
  q?: string;
};

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: (search.q as string) || "",
    };
  },
  head: ({ search }) => ({
    meta: [{ title: `Search results for "${search.q}" — Moonscents` }],
  }),
});

type Product = {
  _id: string;
  slug: string;
  name: string;
  family: string;
  tagline: string;
  price: number;
  image: string;
};

function SearchPage() {
  const { q } = Route.useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const results = await apiRequest<Product[]>(`/api/products/search?q=${encodeURIComponent(q || "")}`);
        setProducts(results || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchResults();
  }, [q]);

  return (
    <Layout>
      <section className="pt-40 pb-24 max-w-7xl mx-auto px-6 lg:px-10 min-h-screen">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-3">Search results</p>
        <h1 className="font-display text-5xl text-silver-gradient mb-12">
          {q ? `"${q}"` : "Search our collection"}
        </h1>

        {loading ? (
          <div className="text-silver-muted py-20">Searching...</div>
        ) : products.length === 0 ? (
          <div className="text-silver-muted py-20">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((product) => (
              <Link
                key={product._id}
                to="/product/$slug"
                params={{ slug: product.slug }}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden mb-6 bg-card border border-border">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-silk group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] tracking-luxe uppercase text-silver-muted">{product.family}</p>
                  <h3 className="font-display text-2xl text-silver group-hover:text-silver-muted transition-silk">
                    {product.name}
                  </h3>
                  <p className="text-xs text-silver-muted italic line-clamp-1">{product.tagline}</p>
                  <p className="text-sm text-silver mt-2">PKR {product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
