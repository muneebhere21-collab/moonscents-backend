import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import heroImg from "@/assets/hero-moon.jpg";

type Product = {
  _id: string;
  slug: string;
  name: string;
  family: string;
  tagline: string;
  price: number;
  image: string;
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Moonscents" },
      { name: "description", content: "Luxury moon-inspired perfumes from Pakistan. Crafted in small batches." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    if (!email) return;

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to subscribe");
      
      toast.success("Welcome to the Moonscents society.");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to subscribe");
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const results = await apiRequest<Product[]>("/api/products");
        const standardProducts = (results || []).filter(p => p.slug !== "discovery-kit");
        setProducts(standardProducts.slice(0, 4)); // Show first 4 on home
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
      {/* HERO ... */}
      {/* HERO */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <motion.img
          src={heroImg}
          alt="Crystal perfume bottle suspended beside a luminous moon"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xs tracking-luxe uppercase text-silver-muted mb-6"
          >
            New Collection · MMXXVI
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-3xl text-silver-gradient"
          >
            Worn by the night.<br />Composed by the moon.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-8 max-w-md text-base text-silver-muted leading-relaxed"
          >
            A house of fragrances inspired by the quiet of moonlight crafted in small batches in Karachi, made to be worn close.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.7 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <Link
              to="/collection"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-silver text-primary-foreground text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk"
            >
              Explore the Collection
              <span className="transition-silk group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/discovery-kit"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-silver/40 text-silver text-xs tracking-luxe uppercase hover:bg-silver/10 transition-silk"
            >
              Build Your Discovery Kit
            </Link>
            <Link
              to="/about"
              className="text-xs tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk border-b border-silver/30 pb-1"
            >

            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-luxe uppercase text-silver-muted">
          Scroll
        </div>
      </section>

      {/* COLLECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex items-end justify-between mb-16 flex-wrap gap-6"
        >
          <div>
            <p className="text-xs tracking-luxe uppercase text-silver-muted mb-4">The Collection</p>
            <h2 className="font-display text-4xl md:text-5xl text-silver-gradient max-w-xl">
              Our Timeless Unique Scents
            </h2>
          </div>
          <Link
            to="/collection"
            className="text-xs tracking-luxe uppercase text-silver-muted hover:text-silver transition-silk border-b border-silver/30 pb-1"
          >
            View All
          </Link>
        </motion.div>

        {loading ? (
          <div className="text-silver-muted">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* MANIFESTO */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-lunar" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="text-xs tracking-luxe uppercase text-silver-muted mb-8"
          >
            The House
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            className="font-display text-3xl md:text-5xl leading-[1.15] text-silver-gradient italic"
          >
            "We compose for the hour the world quiets — when the moon is the only witness, and a scent becomes a memory."
          </motion.blockquote>
          <p className="mt-10 text-xs tracking-luxe uppercase text-silver-muted">
            — Moonscents Atelier, Karachi
          </p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h3 className="font-display text-3xl md:text-4xl text-silver-gradient mb-4">
          Receive the new moon
        </h3>
        <p className="text-sm text-silver-muted mb-8">
          Quiet letters on releases, rituals, and the art of scent.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className="flex-1 bg-transparent border border-border px-4 py-3 text-sm placeholder:text-silver-muted text-silver focus:outline-none focus:border-silver transition-silk"
          />
          <button
            type="submit"
            className="bg-silver text-primary-foreground px-6 py-3 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk"
          >
            Subscribe
          </button>
        </form>
      </section>
    </Layout>
  );
}
