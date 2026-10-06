import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";
import * as schema from "./schema";

// HTTP driver: one query per request, suits serverless on Vercel
export const db = drizzle(neon(env.DATABASE_URL), { schema });