export type PaymentMethod = "cod" | "jazzcash" | "easypaisa";

export type PaymentIntentResult = {
  provider: PaymentMethod;
  status: "pending" | "paid" | "requires_action";
  reference?: string;
  clientSecret?: string;
  metadata?: Record<string, string>;
};

export type PaymentIntentInput = {
  amount: number;
  currency: "PKR";
  orderId: string;
  customerEmail: string;
};

export interface PaymentProvider {
  createIntent(input: PaymentIntentInput): Promise<PaymentIntentResult>;
}
