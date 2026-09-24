import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// pnpm runs this package's scripts with apps/server as cwd, but the single
// .env file lives at the monorepo root
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  CLIENT_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
