import { useState } from "react";
import { apiRequest } from "@/lib/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCash: () => void; // fallback if Safepay not configured
  total: number;
  customerName: string;
  customerEmail: string;
  items: { name: string; quantity: number; price: number }[];
};

export function CardPaymentModal({
  isOpen,
  onClose,
  onConfirmCash,
  total,
  customerName,
  items,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleCardPayment() {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<{
        demo?: boolean;
        redirect_url?: string;
        message?: string;
      }>("/api/orders/payment-session", {
        method: "POST",
        body: JSON.stringify({ amount: total }),
      });

      if (result.demo || !result.redirect_url) {
        // Safepay not configured yet — inform the admin
        setError(
          "Card payments are not yet active. Please configure your Safepay API key or choose another payment method."
        );
        return;
      }

      // Redirect to Safepay hosted checkout
      window.location.href = result.redirect_url;
    } catch (err) {
      setError("Could not initiate card payment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0d0d0d] border border-[#2a2a2a] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="border-b border-[#1f1f1f] px-8 py-6 flex items-start justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#8a7a6a] mb-1">
              Moonscents · Secure Payment
            </p>
            <h2 className="font-serif text-2xl text-[#d4c9b8] tracking-wide">
              Card Payment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#5a5a5a] hover:text-[#d4c9b8] transition-colors mt-1"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Summary */}
        <div className="px-8 py-6 border-b border-[#1f1f1f]">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#5a5a5a] mb-4">
            Order Summary
          </p>
          <ul className="space-y-3 mb-5">
            {items.map((item) => (
              <li key={item.name} className="flex justify-between items-center">
                <span className="text-sm text-[#9a9a9a]">
                  {item.name}
                  <span className="text-[#5a5a5a] ml-1">×{item.quantity}</span>
                </span>
                <span className="text-sm text-[#d4c9b8]">
                  PKR {(item.price * item.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center pt-4 border-t border-[#1f1f1f]">
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#5a5a5a]">
              Total
            </span>
            <span className="font-serif text-xl text-[#b5a48b]">
              PKR {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card Icons */}
        <div className="px-8 pt-6">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#5a5a5a] mb-4">
            Accepted Cards
          </p>
          <div className="flex gap-3 mb-6">
            {["VISA", "MC", "MSTR"].map((card) => (
              <div
                key={card}
                className="border border-[#2a2a2a] px-3 py-2 text-[10px] tracking-wider text-[#6a6a6a]"
              >
                {card === "MC" ? "Mastercard" : card === "MSTR" ? "Maestro" : card}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#5a5a5a] leading-relaxed mb-6">
            You will be securely redirected to <span className="text-[#8a7a6a]">Safepay</span> — Pakistan's trusted payment gateway — to complete your card payment. Your card details are never shared with us.
          </p>

          {error && (
            <div className="bg-red-950/30 border border-red-900/40 px-4 py-3 mb-4">
              <p className="text-[11px] text-red-400 leading-relaxed">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 space-y-3">
          <button
            onClick={handleCardPayment}
            disabled={loading}
            className="w-full bg-[#b5a48b] text-[#0d0d0d] py-4 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#c9b89e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Redirecting to Safepay...
              </span>
            ) : (
              `Pay PKR ${total.toLocaleString()} Securely`
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-[10px] tracking-[0.15em] uppercase text-[#5a5a5a] hover:text-[#9a9a9a] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
