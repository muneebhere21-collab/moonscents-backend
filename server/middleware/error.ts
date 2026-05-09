import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : "Internal server error";
  const stack = err instanceof Error ? err.stack : "";
  
  const fs = require("fs");
  const path = require("path");
  const logPath = path.join(process.cwd(), "server_errors.log");
  fs.appendFileSync(logPath, `${new Date().toISOString()} - Global Error: ${message}\n${stack}\n\n`);
  
  console.error("!! Global Error:", message, stack);
  return res.status(500).json({ message });
}
