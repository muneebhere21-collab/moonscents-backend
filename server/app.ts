import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getEnv } from "./config/env";
import { healthRouter } from "./routes/health";
import { productsRouter } from "./routes/products";
import { ordersRouter } from "./routes/orders";
import { uploadRouter } from "./routes/upload";
import { subscribersRouter } from "./routes/subscribers";
import { adminAuthRouter } from "./routes/admin-auth";
import { paymentsRouter } from "./routes/payments";
import { errorHandler, notFoundHandler } from "./middleware/error";
import path from "path";

export function createApp() {
  const env = getEnv();
  const app = express();

  app.use(
    cors({
      origin: env.NODE_ENV === "development" ? true : env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
    next();
  });



  app.use(express.json());

  app.use("/api/health", healthRouter);

  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/subscribers", subscribersRouter);
  app.use("/api/admin-auth", adminAuthRouter);

  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}