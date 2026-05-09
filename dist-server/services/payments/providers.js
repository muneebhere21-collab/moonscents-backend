"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentProvider = getPaymentProvider;
class CodProvider {
    async createIntent() {
        return { provider: "cod", status: "pending" };
    }
}
class JazzCashProvider {
    async createIntent(input) {
        return {
            provider: "jazzcash",
            status: "requires_action",
            reference: `jazz_${input.orderId}`,
        };
    }
}
class EasypaisaProvider {
    async createIntent(input) {
        return {
            provider: "easypaisa",
            status: "requires_action",
            reference: `easy_${input.orderId}`,
        };
    }
}
function getPaymentProvider(method) {
    switch (method) {
        case "cod":
            return new CodProvider();
        case "jazzcash":
            return new JazzCashProvider();
        case "easypaisa":
            return new EasypaisaProvider();
    }
}
