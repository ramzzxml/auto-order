import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid system formatting for email." }),
  password: z.string().min(6, { message: "Security boundaries mandate minimum 6 character passwords." }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid system formatting for email." }),
  password: z.string().min(1, { message: "Password authentication element is required." }),
});

export const orderCreationSchema = z.object({
  creditPackage: z.enum(['tier1', 'tier2', 'tier3']),
});

export const automationSendSchema = z.object({
  email: z.string().email(),
});

export const automationVerifySchema = z.object({
  link: z.string().url(),
});
