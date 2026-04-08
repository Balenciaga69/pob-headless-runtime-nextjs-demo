import { z } from "zod";

import { withRouteResult } from "@/app/api/_shared";
import { pobClient } from "@/server/pob/client";

const schema = z.object({
  path: z.string().optional(),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  return withRouteResult(() => pobClient.saveBuildFile(body.path));
}
