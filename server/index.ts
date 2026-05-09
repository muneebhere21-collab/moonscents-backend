import "./config/load-env";
import { createApp } from "./app";
import { getEnv } from "./config/env";


async function bootstrap() {
  const env = getEnv();
  // We are now using Supabase exclusively
  // await connectDatabase();
  // await seedDatabase();
  const app = createApp();

  if (typeof env.PORT === "string") {
    app.listen(env.PORT, () => {
      console.log(`Moonscents API running on socket: ${env.PORT}`);
    });
  } else {
    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`Moonscents API running on http://0.0.0.0:${env.PORT}`);
    });
  }
}

bootstrap().catch((error: unknown) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
