import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth";
import { getSupabase } from "../config/supabase";
import { getEnv } from "../config/env";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  customer_email: z.string().trim().email().max(200),
  customer_phone: z.string().trim().min(5).max(30),
  address: z.string().trim().min(3).max(500),
  city: z.string().trim().min(1).max(100),
  notes: z.string().trim().max(500).optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
    }),
  ),
  paymentMethod: z.enum(["cod", "jazzcash", "easypaisa", "bank"]),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
});

// CREATE Safepay Payment Session (before order is saved)
ordersRouter.post("/payment-session", requireAuth, async (req, res) => {
  try {
    const { amount, orderId, customer_email, customer_name } = req.body;
    const env = getEnv();

    if (!env.SAFEPAY_SECRET_KEY) {
      // Demo mode: return a mock session when no key is configured
      return res.json({
        demo: true,
        redirect_url: null,
        message: "Safepay not configured. Add SAFEPAY_SECRET_KEY to .env.server to enable card payments.",
      });
    }

    const safepayBase = env.SAFEPAY_ENV === "production"
      ? "https://api.getsafepay.com"
      : "https://sandbox.api.getsafepay.com";

    const response = await fetch(`${safepayBase}/order/v1/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SFPY-MERCHANT-SECRET": env.SAFEPAY_SECRET_KEY,
      },
      body: JSON.stringify({
        merchant_api_key: env.SAFEPAY_SECRET_KEY,
        intent: "CYBERSOURCE",
        mode: "payment",
        currency: "PKR",
        amount: Math.round(amount * 100), // in paisas
      }),
    });

    const data = await response.json() as any;

    if (!data?.data?.tracker?.token) {
      throw new Error("Failed to create Safepay tracker");
    }

    const checkoutEnv = env.SAFEPAY_ENV === "production" ? "production" : "sandbox";
    const redirect_url = `https://checkout.getsafepay.com/?tracker=${data.data.tracker.token}&source=checkout&env=${checkoutEnv}&beacon=${orderId}`;

    return res.json({ redirect_url, token: data.data.tracker.token });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
});

// CREATE Order
ordersRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const input = createOrderSchema.parse(req.body);
    const supabase = getSupabase();

    // 1. Fetch products and check stock
    const productIds = input.items.map(i => i.productId);
    const { data: products, error: pError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    if (pError) throw pError;

    const orderItems = [];
    let totalAmount = 0;

    for (const item of input.items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity: item.quantity
      });

      // Update stock
      await supabase
        .from("products")
        .update({ stock: product.stock - item.quantity })
        .eq("id", product.id);
    }

    // 2. Create order
    const { data: order, error: oError } = await supabase
      .from("orders")
      .insert([{
        user_id: userId,
        customer_name: input.customer_name,
        customer_email: input.customer_email,
        customer_phone: input.customer_phone,
        address: input.address,
        city: input.city,
        items: orderItems,
        total_amount: totalAmount,
        payment_method: input.paymentMethod,
        status: "pending"
      }])
      .select()
      .single();

    if (oError) throw oError;
    
    // Trigger email in background
    supabase.functions.invoke("send-order-confirmation", {
      body: { orderId: order.id }
    }).catch(err => console.error("!! Email Trigger Failed:", err));

    res.status(201).json({
      ...order,
      _id: order.id, // For frontend compatibility
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// GET all orders (Admin)
ordersRouter.get("/", requireAuth, requireRole("admin"), async (_req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    const orders = data.map(o => ({
      ...o,
      _id: o.id,
      totalAmount: o.total_amount, // For frontend compatibility
    }));

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// UPDATE order status (Admin)
ordersRouter.patch("/:id/status", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const input = updateOrderStatusSchema.parse(req.body);
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("orders")
      .update({ status: input.status })
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Order not found" });

    // Trigger status update email in background
    supabase.functions.invoke("send-order-confirmation", {
      body: { orderId: data.id, type: "status-update" }
    }).catch(err => console.error("!! Status Email Trigger Failed:", err));

    return res.json({
      ...data,
      _id: data.id,
      totalAmount: data.total_amount
    });
  } catch (error) {
    next(error);
  }
});

// GET my orders
ordersRouter.get("/my", requireAuth, async (req, res, next) => {
  try {
    const userId = req.authUser?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    const orders = data.map(o => ({
      ...o,
      _id: o.id,
      totalAmount: o.total_amount
    }));

    res.json(orders);
  } catch (error) {
    next(error);
  }
});
