"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./config/load-env");
const app_1 = require("./app");
const env_1 = require("./config/env");
async function bootstrap() {
    const env = (0, env_1.getEnv)();
    // We are now using Supabase exclusively
    // await connectDatabase();
    // await seedDatabase();
    const app = (0, app_1.createApp)();
    app.listen(env.PORT, "0.0.0.0", () => {
        console.log(`Moonscents API running on http://0.0.0.0:${env.PORT}`);
    });
}
bootstrap().catch((error) => {
    console.error("Failed to start API", error);
    process.exit(1);
});
