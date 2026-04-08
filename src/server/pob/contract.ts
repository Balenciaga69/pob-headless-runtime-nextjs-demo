import { randomUUID } from "node:crypto";

import {
  requestEnvelopeSchema,
  responseEnvelopeSchema,
  type StableMethod,
  type StableWorkerResponse,
} from "@/lib/contracts/stable";

export function createWorkerRequest(method: StableMethod, params: Record<string, unknown> = {}) {
  return requestEnvelopeSchema.parse({
    id: randomUUID(),
    method,
    params,
  });
}

export function parseWorkerResponse(payload: string): StableWorkerResponse {
  const parsed = JSON.parse(payload) as unknown;
  return responseEnvelopeSchema.parse(parsed);
}
