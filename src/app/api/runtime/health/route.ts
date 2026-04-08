import { withRouteResult } from "@/app/api/_shared";
import { pobClient } from "@/server/pob/client";

export async function POST() {
  return withRouteResult(() => pobClient.health());
}
