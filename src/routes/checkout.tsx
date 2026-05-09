import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Layout } from "@/components/site/Layout";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout — Moonscents" },
      { name: "description", content: "Complete your Moonscents order. Cash on delivery available across Pakistan." },
    ],
  }),
});

const schema = z.object({
  customer_name: z.string().trim().min(1, "Name is required").max(120),
  customer_email: z.string().trim().email("Valid email required").max(200),
  customer_phone: z.string().trim().min(5, "Phone required").max(30),
  address: z.string().trim().min(3, "Address required").max(500),
  city: z.string().trim().min(1, "City required").max(100),
  notes: z.string().trim().max(500).optional(),
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash" | "easypaisa" | "bank">("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: user?.email ?? "",
    customer_phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: "" }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.issues.forEach(i => {
        if (!newErrors[i.path[0]]) newErrors[i.path[0]] = i.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});

    setLoading(true);
    try {
      if (!user) {
        toast.error("Please sign in to continue checkout");
        navigate({ to: "/auth" });
        return;
      }

      const products = await apiRequest<Array<{ _id: string; slug: string }>>("/api/products");
      const productIdBySlug = new Map(products.map((p) => [p.slug, p._id]));
      const orderItems = items.map((item) => {
        const productId = productIdBySlug.get(item.slug);
        if (!productId) {
          throw new Error(`Product unavailable: ${item.name}`);
        }
        return { productId, quantity: item.quantity };
      });

      const order = await apiRequest<{ _id: string; payment?: { provider: string; status: string } }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          ...parsed.data,
          paymentMethod,
          items: orderItems,
        }),
      });

      clear();

      // Build WhatsApp message with order details
      const WHATSAPP_NUMBER = "923303965260";
      const total = subtotal + (subtotal >= 10000 ? 0 : 350);
      const paymentDisplay = {
        cod: "Cash on Delivery",
        jazzcash: "JazzCash",
        easypaisa: "Easypaisa",
        bank: "Bank Transfer"
      }[paymentMethod] || paymentMethod.toUpperCase();

      const shortOrderId = order._id.slice(-6).toUpperCase();

      const msg = [
        `✨ *MOONSCENTS — ORDER PLACED* ✨`,
        `Reference: #${shortOrderId}`,
        ``,
        `*CUSTOMER DETAILS*`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        `👤 Name: ${parsed.data.customer_name}`,
        `📞 Phone: ${parsed.data.customer_phone}`,
        `📧 Email: ${parsed.data.customer_email}`,
        `📍 Address: ${parsed.data.address}, ${parsed.data.city}`,
        ``,
        `*ORDER SUMMARY*`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        items.map((i) => `🔸 ${i.name} (x${i.quantity})  ........  PKR ${(i.price * i.quantity).toLocaleString()}`).join("\n"),
        ``,
        `*PAYMENT & TOTAL*`,
        `━━━━━━━━━━━━━━━━━━━━━`,
        `💳 Method: ${paymentDisplay}`,
        `💰 Total Amount: PKR ${total.toLocaleString()}`,
        parsed.data.notes ? `\n📝 *Notes:* ${parsed.data.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      toast.success("Order placed! Redirecting to WhatsApp...");
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        navigate({ to: "/order-confirmation", search: { id: order._id, payment: paymentMethod } });
      }, 1000);
    } catch (err) {
      console.error("!! Checkout: Payment/Order Failure:", err);
      const msg = err instanceof Error ? err.message : "Could not place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <Layout>
        <section className="pt-40 pb-24 max-w-xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl text-silver-gradient">Your cart is empty</h1>
          <Link to="/collection" className="inline-block mt-8 text-xs tracking-luxe uppercase text-silver border-b border-silver/40 pb-1">
            Explore the Collection
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-40 pb-24 max-w-6xl mx-auto px-6 lg:px-10">
        <p className="text-xs tracking-luxe uppercase text-silver-muted mb-4">Checkout</p>
        <h1 className="font-display text-4xl md:text-5xl text-silver-gradient mb-12">Complete your order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs tracking-luxe uppercase text-silver mb-4">Delivery details</p>
            {([
              ["customer_name", "Full name", "text"],
              ["customer_email", "Email", "email"],
              ["customer_phone", "Phone (e.g. 03001234567)", "tel"],
              ["address", "Street address", "text"],
              ["city", "City", "text"],
            ] as const).map(([k, label, type]) => (
              <div key={k} className="relative">
                <input
                  type={type}
                  placeholder={label}
                  value={form[k]}
                  onChange={set(k)}
                  required
                  className={`w-full bg-transparent border ${errors[k] ? 'border-red-900/50' : 'border-border'} px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk`}
                />
                {errors[k] && <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 uppercase tracking-luxe">{errors[k]}</p>}
              </div>
            ))}
            <textarea
              placeholder="Order notes (optional)"
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              maxLength={500}
              className="w-full bg-transparent border border-border px-4 py-4 text-sm text-silver placeholder:text-silver-muted/60 focus:border-silver outline-none transition-silk resize-none"
            />

            <div className="pt-6">
              <p className="text-xs tracking-luxe uppercase text-silver mb-4">Payment</p>
              <div className="space-y-2">
                {([
                  ["cod", "Cash on Delivery", "Pay in cash when your fragrance arrives."],
                  ["jazzcash", "JazzCash", "Pay via JazzCash — details sent on WhatsApp."],
                  ["easypaisa", "Easypaisa", "Pay via Easypaisa — details sent on WhatsApp."],
                  ["bank", "Bank Transfer", "Pay via bank transfer — details sent on WhatsApp."],
                ] as const).map(([method, title, caption]) => (
                  <label key={method} className="border border-silver/60 px-4 py-4 block cursor-pointer">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm text-silver">{title}</p>
                        <p className="text-[11px] text-silver-muted mt-1">{caption}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-silver text-primary-foreground px-8 py-4 text-xs tracking-luxe uppercase hover:bg-moonlight transition-silk shadow-moon disabled:opacity-50 mt-8"
            >
              {loading
                ? "Placing order..."
                : paymentMethod === "card"
                ? `Pay by Card — PKR ${subtotal.toLocaleString()}`
                : `Place order — PKR ${subtotal.toLocaleString()}`}
            </button>
          </form>

          <aside className="bg-card p-8 border border-border h-fit lg:sticky lg:top-28">
            <p className="text-xs tracking-luxe uppercase text-silver mb-6">Order summary</p>
            <ul className="space-y-5 mb-6">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-4">
                  <div className="w-14 h-16 bg-background overflow-hidden flex-shrink-0">
                    <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base text-silver">{i.name}</p>
                    <p className="text-[11px] text-silver-muted">Qty {i.quantity}</p>
                  </div>
                  <p className="text-xs text-silver">PKR {(i.price * i.quantity).toLocaleString()}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-xs text-silver-muted">
                <span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-silver-muted">
                <span>Shipping</span><span>{subtotal >= 10000 ? "Free" : "PKR 350"}</span>
              </div>
              <div className="flex justify-between font-display text-xl text-silver pt-3 border-t border-border mt-3">
                <span>Total</span>
                <span>PKR {(subtotal + (subtotal >= 10000 ? 0 : 350)).toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
