import { z } from "zod";

export const VALID_LEAD_STATUSES = ["inquiry", "discovery", "proposal", "in_progress", "completed", "lost"];
export const VALID_CLIENT_STATUSES = ["onboarding", "active", "at_risk", "inactive", "churned"];
export const VALID_PROPOSAL_STATUSES = ["draft", "sent", "viewed", "accepted", "rejected"];
export const VALID_INVOICE_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"];
export const VALID_PROJECT_STATUSES = ["planning", "in_progress", "review", "completed", "on_hold", "cancelled"];

const VALID_COLUMNS = [
  "name", "email", "status", "created_at", "invoice_number", "total",
  "budget", "deadline", "title", "company", "phone",
];

const phoneRegex = /^[\d\s\-\+\(\)\.]{6,20}$/;

export const idSchema = z.union([z.number(), z.string()]).transform((v) => Number(v));

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(320, "Email too long")
  .transform((v) => v.toLowerCase().trim());

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(200, "Name too long")
  .transform((v) => v.trim());

export const phoneSchema = z
  .string()
  .max(20)
  .regex(phoneRegex, "Invalid phone number")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v.trim() : null));

export const companySchema = z
  .string()
  .max(200)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v.trim() : null));

export const statusSchema = (validStatuses) =>
  z.enum(validStatuses, { message: "Invalid status value" });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(15),
  search: z.string().max(200).default(""),
  status: z.string().max(50).default("all"),
  col: z
    .string()
    .refine((v) => v === "" || VALID_COLUMNS.includes(v), "Invalid sort column")
    .default(""),
  dir: z.enum(["asc", "desc"]).default("asc"),
  sort: z.string().max(50).default("newest"),
});

export const leadSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema,
  services: z.string().max(500).optional().or(z.literal("")).transform((v) => v?.trim() || null),
  budget: z.string().max(200).optional().or(z.literal("")).transform((v) => v?.trim() || null),
});

export const clientSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional().or(z.literal("")),
  phone: phoneSchema,
  company: companySchema,
});

export const proposalSchema = z.object({
  id: idSchema.optional(),
  lead_id: z.string().optional().or(z.literal("")).transform((v) => v || null),
  title: nameSchema,
  status: statusSchema(VALID_PROPOSAL_STATUSES).optional(),
  content: z.any().optional(),
  pricing: z.any().optional(),
  timeline: z.string().max(5000).optional().or(z.literal("")).transform((v) => v?.trim() || null),
  terms: z.string().max(10000).optional().or(z.literal("")).transform((v) => v?.trim() || null),
});

const invoiceItemSchema = z.object({
  description: z.string().max(500),
  quantity: z.coerce.number().min(0).max(99999),
  rate: z.coerce.number().min(0).max(9999999),
});

export const invoiceSchema = z.object({
  id: idSchema.optional(),
  client_id: z.string().optional().or(z.literal("")).transform((v) => v || null),
  proposal_id: z.string().optional().or(z.literal("")).transform((v) => v || null),
  status: statusSchema(VALID_INVOICE_STATUSES).optional(),
  items: z.array(invoiceItemSchema).optional().default([]),
  tax: z.coerce.number().min(0).max(9999999).optional().default(0),
  currency: z.string().max(10).optional().default("USD"),
  notes: z.string().max(5000).optional().or(z.literal("")).transform((v) => v?.trim() || null),
  terms: z.string().max(10000).optional().or(z.literal("")).transform((v) => v?.trim() || null),
  due_date: z.string().max(20).optional().or(z.literal("")).transform((v) => v || null),
});

export const projectSchema = z.object({
  id: idSchema.optional(),
  client_id: z.string().optional().or(z.literal("")).transform((v) => v || null),
  name: nameSchema,
  description: z.string().max(5000).optional().or(z.literal("")).transform((v) => v?.trim() || null),
  status: statusSchema(VALID_PROJECT_STATUSES).optional(),
  start_date: z.string().max(20).optional().or(z.literal("")).transform((v) => v || null),
  deadline: z.string().max(20).optional().or(z.literal("")).transform((v) => v || null),
  budget: z.coerce.number().min(0).max(999999999).optional().nullable().transform((v) => v ?? null),
  services: z.string().max(1000).optional().or(z.literal("")).transform((v) => v?.trim() || null),
  notes: z.string().max(10000).optional().or(z.literal("")).transform((v) => v?.trim() || null),
});

export function sanitizeHtml(input) {
  if (typeof input !== "string") return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "");
}

export function sanitizeProposalContent(content) {
  if (!content) return content;
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch {
      return content;
    }
  }
  function walk(node) {
    if (node && typeof node === "object") {
      const attrs = node.attrs || {};
      if (attrs.href && typeof attrs.href === "string") {
        attrs.href = attrs.href.replace(/javascript\s*:/gi, "").trim();
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(walk);
      }
    }
    return node;
  }
  return walk(content);
}

export function validateFormData(schema, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    const messages = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`Validation failed: ${messages.join("; ")}`);
  }
  return result.data;
}
