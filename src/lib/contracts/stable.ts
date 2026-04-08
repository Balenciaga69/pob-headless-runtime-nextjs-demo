import { z } from "zod";

export const stableMethods = [
  "load_build_xml",
  "load_build_code",
  "load_build_file",
  "save_build_xml",
  "save_build_code",
  "save_build_file",
  "get_summary",
  "get_stats",
  "get_display_stats",
  "equip_item",
  "list_equipment",
  "set_config",
  "get_config",
  "get_runtime_status",
  "health",
] as const;

export type StableMethod = (typeof stableMethods)[number];

export const requestEnvelopeSchema = z.object({
  id: z.string().nullable().optional(),
  method: z.enum(stableMethods),
  params: z.record(z.string(), z.unknown()).default({}),
});

export const responseMetaSchema = z.object({
  request_id: z.string().nullable().optional(),
  api_version: z.string(),
  engine_version: z.string(),
  duration_ms: z.number(),
});

export const successEnvelopeSchema = z.object({
  id: z.string().nullable().optional(),
  ok: z.literal(true),
  result: z.unknown(),
  meta: responseMetaSchema,
});

export const errorEnvelopeSchema = z.object({
  id: z.string().nullable().optional(),
  ok: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean().optional(),
    details: z.unknown().optional(),
  }),
  meta: responseMetaSchema,
});

export const responseEnvelopeSchema = z.union([
  successEnvelopeSchema,
  errorEnvelopeSchema,
]);

export type StableWorkerResponse = z.infer<typeof responseEnvelopeSchema>;
