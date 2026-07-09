import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes only"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().int().positive("Price must be a positive number"),
  thumbnail: z.string().url().optional().or(z.literal("")),
  active: z.coerce.boolean().optional()
});

export const stockBulkSchema = z.object({
  content: z.string().min(1, "Content is required")
});

export const checkoutSchema = z.object({
  productId: z.string().min(1),
  buyerName: z.string().min(2, "Name must be at least 2 characters"),
  buyerWhatsapp: z
    .string()
    .min(8, "WhatsApp number looks too short")
    .regex(/^[0-9+ ]+$/, "Invalid WhatsApp number")
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export const settingsSchema = z.object({
  storeName: z.string().min(1),
  storeLogo: z.string().url().optional().or(z.literal("")),
  gatewayApiKey: z.string().optional().or(z.literal("")),
  gatewayBaseUrl: z.string().url().optional().or(z.literal(""))
});
