import { z } from "zod";

export const nonEmpty = z.string().trim().min(1, "Required.");

export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, digits and dashes",
  );

// "YYYY-MM", same rule as the CHECK constraints in the database
export const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM");

export const sortOrder = z.number().int().nonnegative();

const isHttpUrl = (value: string) => {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
};

// Links go into href attributes, so only http(s) is allowed
export const httpUrl = z.string().refine(isHttpUrl, "Expected an http(s) URL");

// Files: a site path (/images/x.png) or a full URL (Vercel Blob later)
export const assetUrl = z
  .string()
  .refine(
    (value) =>
      (value.startsWith("/") && !value.startsWith("//")) || isHttpUrl(value),
    "Expected a site path or an http(s) URL",
  );

// The clock calls Intl with this value, so a bad id would break rendering
export const ianaTimezone = z.string().refine((value) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}, "Expected an IANA timezone id");
