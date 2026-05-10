import { createApp } from "../server/app";
import { getEnv } from "../server/config/env";

const app = createApp();

// Vercel handles the listening, we just need to export the app
export default app;
