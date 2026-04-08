import { z } from "zod";

import { withRouteResult } from "@/app/api/_shared";
import { pobClient } from "@/server/pob/client";

const schema = z.record(z.string(), z.unknown());

export async function GET() {
  return withRouteResult(() => pobClient.getConfig());
}

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  return withRouteResult(() => pobClient.setConfig(body));
}
