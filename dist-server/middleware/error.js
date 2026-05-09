"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(_req, res) {
    return res.status(404).json({ message: "Route not found" });
}
function errorHandler(err, _req, res, _next) {
    const message = err instanceof Error ? err.message : "Internal server error";
    const stack = err instanceof Error ? err.stack : "";
    const fs = require("fs");
    const path = require("path");
    const logPath = path.join(process.cwd(), "server_errors.log");
    fs.appendFileSync(logPath, `${new Date().toISOString()} - Global Error: ${message}\n${stack}\n\n`);
    console.error("!! Global Error:", message, stack);
    return res.status(500).json({ message });
}
