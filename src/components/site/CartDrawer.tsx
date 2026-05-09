import { Link } from "@tanstack/react-router";
import { X, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";

export function CartDrawer() {
  const { isOpen, closeCart, items, setQty, remove, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[61] h-full w-full sm:w-[440px] bg-card border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-border">
              <p className="text-xs tracking-luxe uppercase text-silver">Your Cart</p>
              <button onClick={closeCart} aria-label="Close cart" className="text-silver-muted hover:text-silver transition-silk">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="font-display text-2xl text-silver-gradient">Your cart is empty</p>
                  <p className="text-xs text-silver-muted mt-3 tracking-wide">Begin with a fragrance.</p>
                  <Link
                    to="/collection"
                    onClick={closeCart}
                    className="mt-8 text-xs tracking-luxe uppercase text-silver border-b border-silver/40 pb-1"
                  >
                    Explore the Collection
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item.slug} className="flex gap-4">
                      <div className="w-20 h-24 bg-background overflow-hidden flex-shrink-0">
                        <img 
                          src={`${item.image}${item.image.includes("unsplash") ? "&w=200&h=260&fit=crop" : ""}`} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-lg text-silver">{item.name}</p>
                          <button
                            onClick={() => remove(item.slug)}
                            className="text-[10px] tracking-luxe uppercase text-silver-muted hover:text-silver"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <p className="text-xs text-silver-muted">
                            {item.ml}ml · PKR {item.price.toLocaleString()}
                          </p>
                          {item.customSelection && (
                            <p className="text-[10px] text-silver italic text-silver-muted/80 leading-tight border-l border-silver/20 pl-3 py-1 mt-1">
                              "{item.customSelection}"
                            </p>
                          )}
                        </div>
                        <div className="mt-3 inline-flex items-center border border-border">
                          <button onClick={() => setQty(item.slug, item.quantity - 1)} className="w-8 h-8 grid place-items-center text-silver-muted hover:text-silver">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs text-silver">{item.quantity}</span>
                          <button onClick={() => setQty(item.slug, item.quantity + 1)} className="w-8 h-8 grid place-items-center text-silver-muted hover:text-silver">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-6 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs tracking-luxe uppercase text-silver-muted">Subtotal</p>
                  <p className="font-display text-2xl text-silver">PKR {subtotal.toLocaleString()}</p>
                </div>
                <p className="text-[10px] text-silver-muted">Shipping calculated at checkout. Cash on delivery available across Pakistan.</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center bg-silver text-primary-foreground px-8 py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
