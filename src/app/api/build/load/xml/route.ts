import { z } from "zod";

import { withRouteResult } from "@/app/api/_shared";
import { pobClient } from "@/server/pob/client";

const schema = z.object({
  xmlText: z.string().min(1),
  buildName: z.string().optional(),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  return withRouteResult(() => pobClient.loadBuildXml(body.xmlText, body.buildName));
}
