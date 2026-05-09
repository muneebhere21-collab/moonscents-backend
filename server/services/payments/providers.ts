import type { PaymentIntentInput, PaymentIntentResult, PaymentMethod, PaymentProvider } from "./types";
import { getEnv } from "../../config/env";

class CodProvider implements PaymentProvider {
  async createIntent(): Promise<PaymentIntentResult> {
    return { provider: "cod", status: "pending" };
  }
}

class JazzCashProvider implements PaymentProvider {
  async createIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    return {
      provider: "jazzcash",
      status: "requires_action",
      reference: `jazz_${input.orderId}`,
    };
  }
}

class EasypaisaProvider implements PaymentProvider {
  async createIntent(input: PaymentIntentInput): Promise<PaymentIntentResult> {
    return {
      provider: "easypaisa",
      status: "requires_action",
      reference: `easy_${input.orderId}`,
    };
  }
}



export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  switch (method) {
    case "cod":
      return new CodProvider();
    case "jazzcash":
      return new JazzCashProvider();
    case "easypaisa":
      return new EasypaisaProvider();

  }
}
