import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="group block"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-card">
          <div className="absolute inset-0 bg-lunar opacity-60" />
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={900}
            height={1200}
            className="relative w-full h-full object-cover transition-silk group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-silk">
            <span className="inline-block text-[11px] tracking-luxe uppercase text-moonlight border border-silver/40 px-4 py-2 backdrop-blur-md bg-background/30">
              Discover
            </span>
          </div>
        </div>
        <div className="pt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-luxe uppercase text-silver-muted mb-2">
              {product.family}
            </p>
            <h3 className="font-display text-2xl text-silver">{product.name}</h3>
            <p className="text-sm text-silver-muted mt-1 italic">{product.tagline}</p>
          </div>
          <p className="text-sm text-silver whitespace-nowrap pt-7">
            PKR {product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
