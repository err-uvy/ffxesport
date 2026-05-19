import sanitizeHtml from "sanitize-html";
import { z } from "zod";

export const idSchema = z.string().min(8);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export function cleanText(value: string) {
  return sanitizeHtml(value.trim(), {
    allowedTags: [],
    allowedAttributes: {}
  });
}

export function cleanRichText(value: string) {
  return sanitizeHtml(value.trim(), {
    allowedTags: ["b", "strong", "i", "em", "ul", "ol", "li", "p", "br"],
    allowedAttributes: {}
  });
}

export const emailSchema = z.string().email().transform((value) => value.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8)
  .max(128)
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number");
