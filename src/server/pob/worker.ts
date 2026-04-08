import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import path from "node:path";
import readline from "node:readline";

import type { StableWorkerResponse } from "@/lib/contracts/stable";
import { parseWorkerResponse } from "@/server/pob/contract";
import { PobWorkerBootError } from "@/server/pob/errors";
import { getPobRuntimeEnv } from "@/server/pob/env";

type PendingRequest = {
  resolve: (value: StableWorkerResponse) => void;
  reject: (reason?: unknown) => void;
  timeout: NodeJS.Timeout;
};

class PersistentPobWorker {
  private process: ChildProcessWithoutNullStreams | null = null;
  private lines: readline.Interface | null = null;
  private pending = new Map<string, PendingRequest>();
  private bootPromise: Promise<void> | null = null;

  async send(payload: string, requestId: string): Promise<StableWorkerResponse> {
    await this.ensureStarted();

    if (!this.process) {
      throw new PobWorkerBootError("PoB worker failed to start");
    }

    const { requestTimeoutMs } = getPobRuntimeEnv();

    return new Promise<StableWorkerResponse>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`PoB worker request timed out after ${requestTimeoutMs}ms`));
      }, requestTimeoutMs);

      this.pending.set(requestId, { resolve, reject, timeout });
      this.process!.stdin.write(`${payload}\n`);
    });
  }

  private async ensureStarted() {
    if (this.process) {
      return;
    }

    if (!this.bootPromise) {
      this.bootPromise = this.start();
    }

    return this.bootPromise;
  }

  private async start() {
    const runtimeEnv = getPobRuntimeEnv();
    const workerScript = path.join(process.cwd(), "src", "server", "pob", "persistent_worker.lua");

    this.process = spawn(runtimeEnv.luaBin, [workerScript], {
      cwd: path.join(runtimeEnv.hostRepoRoot, "src"),
      env: {
        ...process.env,
        POB_HEADLESS_DIR: runtimeEnv.headlessDir,
        POB_HEADLESS_MAX_FRAMES: String(runtimeEnv.maxFrames),
        POB_HEADLESS_MAX_SECONDS: String(runtimeEnv.maxSeconds),
      },
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.process.once("error", (error) => {
      this.rejectAll(error);
      this.reset();
    });

    this.process.once("exit", (code, signal) => {
      this.rejectAll(
        new Error(
          `PoB worker exited unexpectedly (code=${String(code)}, signal=${String(signal)})`,
        ),
      );
      this.reset();
    });

    this.process.stderr.on("data", (chunk) => {
      const message = chunk.toString().trim();
      if (!message) {
        return;
      }

      if (process.env.NODE_ENV !== "production") {
        console.error("[pob-worker]", message);
      }
    });

    this.lines = readline.createInterface({
      input: this.process.stdout,
      crlfDelay: Infinity,
    });

    this.lines.on("line", (line) => {
      if (!line.trim()) {
        return;
      }

      const response = parseWorkerResponse(line);
      const requestId = response.id ?? response.meta.request_id ?? "";
      const pending = this.pending.get(requestId);

      if (!pending) {
        return;
      }

      clearTimeout(pending.timeout);
      this.pending.delete(requestId);
      pending.resolve(response);
    });
  }

  private rejectAll(reason: unknown) {
    for (const [requestId, pending] of this.pending.entries()) {
      clearTimeout(pending.timeout);
      pending.reject(reason);
      this.pending.delete(requestId);
    }
  }

  private reset() {
    this.lines?.close();
    this.lines = null;
    this.process = null;
    this.bootPromise = null;
  }
}

declare global {
  var __pobWorkerSingleton__: PersistentPobWorker | undefined;
}

export function getPersistentPobWorker() {
  if (!globalThis.__pobWorkerSingleton__) {
    globalThis.__pobWorkerSingleton__ = new PersistentPobWorker();
  }

  return globalThis.__pobWorkerSingleton__;
}
