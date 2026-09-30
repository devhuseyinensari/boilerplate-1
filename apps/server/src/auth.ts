import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { env } from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [
    env.CLIENT_URL,
    "mobile://",
    // Expo Go / dev client during local development
    ...(env.NODE_ENV === "development" ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"] : []),
  ],
  secret: env.BETTER_AUTH_SECRET,
  plugins: [expo()],
});
