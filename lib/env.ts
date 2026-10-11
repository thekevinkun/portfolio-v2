import { z } from "zod";

const envSchema = z.object({
  // Scripts run with tsx leave NODE_ENV unset; Next always sets it
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  // Public origin without a trailing slash: canonical, sitemap and JSON-LD (D74)
  SITE_URL: z
    .string()
    .url()
    .transform((url) => url.replace(/\/+$/, "")),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`,
  );
}

export const env = parsed.data;
