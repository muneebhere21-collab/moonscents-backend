import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  ml?: number;
  customSelection?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "moonscents.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
    return {
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      add: (item, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((p) => 
            p.slug === item.slug && 
            p.ml === item.ml && 
            p.customSelection === item.customSelection
          );
          if (existing) {
            return prev.map((p) =>
              (p.slug === item.slug && p.ml === item.ml && p.customSelection === item.customSelection) 
                ? { ...p, quantity: p.quantity + qty } 
                : p,
            );
          }
          return [...prev, { ...item, quantity: qty }];
        }),
      remove: (slug) => setItems((prev) => prev.filter((p) => p.slug !== slug)),
      setQty: (slug, qty) =>
        setItems((prev) =>
          prev
            .map((p) => (p.slug === slug ? { ...p, quantity: Math.max(0, qty) } : p))
            .filter((p) => p.quantity > 0),
        ),
      clear: () => setItems([]),
      count,
      subtotal,
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
