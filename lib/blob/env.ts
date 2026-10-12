import { z } from "zod";

// Outside lib/env.ts so db:seed doesn't need it (D85)
const blobEnvSchema = z.object({
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

const parsed = blobEnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid Blob environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}`,
  );
}

export const blobEnv = parsed.data;
