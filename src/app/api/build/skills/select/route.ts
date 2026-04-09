import { z } from "zod";

import { withRouteResult } from "@/app/api/_shared";
import { pobClient } from "@/server/pob/client";

const schema = z.object({
  group: z.number().int().optional(),
  mainSocketGroup: z.number().int().optional(),
  skill: z.number().int().optional(),
  mainActiveSkill: z.number().int().optional(),
  part: z.number().int().optional(),
  skillPart: z.number().int().optional(),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  return withRouteResult(() => pobClient.selectSkill(body));
}
