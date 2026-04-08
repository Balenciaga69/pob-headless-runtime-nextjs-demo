import { z } from "zod";

import { withRouteResult } from "@/app/api/_shared";
import { pobClient } from "@/server/pob/client";

const schema = z.object({
  fields: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  return withRouteResult(() => pobClient.getStats(body.fields));
}
