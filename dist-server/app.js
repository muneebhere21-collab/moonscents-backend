"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const health_1 = require("./routes/health");
const products_1 = require("./routes/products");
const orders_1 = require("./routes/orders");
const upload_1 = require("./routes/upload");
const subscribers_1 = require("./routes/subscribers");
const admin_auth_1 = require("./routes/admin-auth");
const payments_1 = require("./routes/payments");
const error_1 = require("./middleware/error");
const path_1 = __importDefault(require("path"));
function createApp() {
    const env = (0, env_1.getEnv)();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: env.NODE_ENV === "development" ? true : env.CORS_ORIGIN,
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use((req, res, next) => {
        console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
        next();
    });
    app.use(express_1.default.json());
    app.use("/api/health", health_1.healthRouter);
    app.use("/api/products", products_1.productsRouter);
    app.use("/api/orders", orders_1.ordersRouter);
    app.use("/api/payments", payments_1.paymentsRouter);
    app.use("/api/upload", upload_1.uploadRouter);
    app.use("/api/subscribers", subscribers_1.subscribersRouter);
    app.use("/api/admin-auth", admin_auth_1.adminAuthRouter);
    app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "public/uploads")));
    app.use(error_1.notFoundHandler);
    app.use(error_1.errorHandler);
    return app;
}
