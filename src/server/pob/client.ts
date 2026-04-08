import type { StableMethod } from "@/lib/contracts/stable";
import { createWorkerRequest } from "@/server/pob/contract";
import { PobClientError } from "@/server/pob/errors";
import { getPersistentPobWorker } from "@/server/pob/worker";

async function callWorker<T>(
  method: StableMethod,
  params: Record<string, unknown> = {},
): Promise<T> {
  const request = createWorkerRequest(method, params);
  const response = await getPersistentPobWorker().send(JSON.stringify(request), request.id ?? "");

  if (!response.ok) {
    throw new PobClientError(response.error.message, {
      code: response.error.code,
      details: response.error.details,
      retryable: response.error.retryable,
    });
  }

  return response.result as T;
}

export const pobClient = {
  health: () => callWorker<Record<string, unknown>>("health"),
  getRuntimeStatus: () => callWorker<Record<string, unknown>>("get_runtime_status"),
  loadBuildFile: (path: string) => callWorker("load_build_file", { path }),
  loadBuildCode: (code: string, buildName?: string) =>
    callWorker("load_build_code", {
      code,
      ...(buildName ? { build_name: buildName } : {}),
    }),
  loadBuildXml: (xmlText: string, buildName?: string) =>
    callWorker("load_build_xml", {
      xmlText,
      ...(buildName ? { build_name: buildName } : {}),
    }),
  saveBuildFile: (path?: string) => callWorker("save_build_file", path ? { path } : {}),
  saveBuildCode: () => callWorker("save_build_code"),
  saveBuildXml: () => callWorker("save_build_xml"),
  getSummary: () => callWorker<Record<string, unknown>>("get_summary"),
  getStats: (fields: string[]) => callWorker<Record<string, unknown>>("get_stats", { fields }),
  getDisplayStats: () => callWorker<Record<string, unknown>>("get_display_stats"),
  listEquipment: () => callWorker<Record<string, unknown>>("list_equipment"),
  equipItem: (itemText: string, slot?: string) =>
    callWorker("equip_item", {
      item_text: itemText,
      ...(slot ? { slot } : {}),
    }),
  getConfig: () => callWorker<Record<string, unknown>>("get_config"),
  setConfig: (config: Record<string, unknown>) => callWorker("set_config", config),
};
