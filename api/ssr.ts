import { createServerEntry } from "../dist/server/index.js";

// This is a bridge for Vercel Serverless Functions
export default async function handler(req: any, res: any) {
  // TanStack Start uses a Fetch handler internally
  // We can use the createServerEntry to handle the request
  // However, it's easier to just use the default export if it's already a handler
  
  const serverEntry = await import("../dist/server/index.js");
  
  // Since we are running in a Node environment, we need to adapt the Request/Response
  // But Vercel's Edge/Serverless functions have different signatures.
  
  // Actually, a better way is to use the 'node-server' preset and run it via a bridge
  // OR use the 'vercel' preset properly.
  
  // Let's try to use the existing built server
  try {
      const { default: handler } = serverEntry;
      return handler(req, res);
  } catch (err) {
      console.error(err);
      res.status(500).send("SSR Error");
  }
}
