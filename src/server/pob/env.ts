import path from "node:path";

import { z } from "zod";

const envSchema = z.object({
  POB_HEADLESS_DIR: z.string().min(1),
  POB_HEADLESS_LUA_BIN: z.string().min(1).default("luajit"),
  POB_HEADLESS_MAX_FRAMES: z.string().default("200"),
  POB_HEADLESS_MAX_SECONDS: z.string().default("5"),
  POB_HEADLESS_REQUEST_TIMEOUT_MS: z.string().default("30000"),
});

export type PobRuntimeEnv = {
  headlessDir: string;
  luaBin: string;
  maxFrames: number;
  maxSeconds: number;
  requestTimeoutMs: number;
  hostRepoRoot: string;
};

let cachedEnv: PobRuntimeEnv | null = null;

export function getPobRuntimeEnv(): PobRuntimeEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.parse(process.env);
  const headlessDir = path.resolve(parsed.POB_HEADLESS_DIR);

  cachedEnv = {
    headlessDir,
    luaBin: parsed.POB_HEADLESS_LUA_BIN,
    maxFrames: Number(parsed.POB_HEADLESS_MAX_FRAMES),
    maxSeconds: Number(parsed.POB_HEADLESS_MAX_SECONDS),
    requestTimeoutMs: Number(parsed.POB_HEADLESS_REQUEST_TIMEOUT_MS),
    hostRepoRoot: path.dirname(headlessDir),
  };

  return cachedEnv;
}
