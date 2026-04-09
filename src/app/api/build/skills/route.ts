import { withRouteResult } from "@/app/api/_shared";
import { pobClient } from "@/server/pob/client";

export async function GET() {
  return withRouteResult(() => pobClient.listSkills());
}
