import { z } from "zod";

// Kept out of lib/env.ts so `npm run db:seed` doesn't need these (D85)
const authEnvSchema = z.object({
  AUTH_SECRET: z.string().min(32),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  // Numeric GitHub user id, not the username (D83)
  ADMIN_GITHUB_ID: z
    .string()
    .regex(/^\d+$/, "Expected a numeric GitHub user id"),
});

const parsed = authEnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid auth environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`,
  );
}

export const authEnv = parsed.data;
