"use client";

import {
  Activity,
  HardDriveDownload,
  ScrollText,
  Shield,
  Swords,
  Zap,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiPost } from "@/features/pob/api";
import {
  configFieldDefinitions,
  equipmentSlots,
  statFieldPresets,
} from "@/features/pob/constants";
import { DisplayStatsPanel } from "@/features/pob/components/display-stats-panel";
import { JsonPreview } from "@/features/pob/components/json-preview";
import { SectionHeading } from "@/features/pob/components/section-heading";
import type { ConsoleEntry, DisplayStatsResult } from "@/features/pob/types";
import { asErrorMessage } from "@/lib/utils";

function SidebarButton({
  icon: Icon,
  label,
}: {
  icon: typeof Activity;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-panel-border bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
      <Icon className="h-4 w-4 text-accent-secondary" />
      <span>{label}</span>
    </div>
  );
}

export function Dashboard() {
  const [isPending, startTransition] = useTransition();
  const [health, setHealth] = useState<unknown>(null);
  const [runtimeStatus, setRuntimeStatus] = useState<unknown>(null);
  const [summary, setSummary] = useState<unknown>(null);
  const [stats, setStats] = useState<unknown>(null);
  const [displayStats, setDisplayStats] = useState<DisplayStatsResult | null>(null);
  const [equipment, setEquipment] = useState<unknown>(null);
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [saveOutput, setSaveOutput] = useState<unknown>(null);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);

  const [buildFilePath, setBuildFilePath] = useState("");
  const [buildCode, setBuildCode] = useState("");
  const [buildXml, setBuildXml] = useState("");
  const [buildName, setBuildName] = useState("");
  const [statsFields, setStatsFields] = useState(statFieldPresets.join(", "));
  const [savePath, setSavePath] = useState("");
  const [itemText, setItemText] = useState("");
  const [itemSlot, setItemSlot] = useState("");

  function pushConsole(entry: Omit<ConsoleEntry, "id" | "createdAt">) {
    setConsoleEntries((current) => [
      {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date().toLocaleTimeString(),
      },
      ...current,
    ].slice(0, 18));
  }

  function runAction<T>({
    title,
    endpoint,
    payload,
    request,
    onSuccess,
  }: {
    title: string;
    endpoint: string;
    payload?: unknown;
    request: () => Promise<T>;
    onSuccess?: (result: T) => void;
  }) {
    startTransition(async () => {
      try {
        const result = await request();
        onSuccess?.(result);
        pushConsole({
          title,
          endpoint,
          payload,
          response: result,
          status: "success",
        });
        toast.success(`${title} completed`);
      } catch (error) {
        const message = asErrorMessage(error);
        pushConsole({
          title,
          endpoint,
          payload,
          response: { message },
          status: "error",
        });
        toast.error(message);
      }
    });
  }

  function normalizeFieldValue(kind: "text" | "number" | "boolean", value: unknown) {
    if (kind === "number") {
      return typeof value === "number" ? String(value) : "";
    }

    if (kind === "boolean") {
      return Boolean(value);
    }

    return typeof value === "string" ? value : "";
  }

  return (
    <div className="grid-shell min-h-screen gap-6 p-6">
      <aside className="sticky top-0 flex h-screen flex-col gap-6 rounded-[30px] border border-panel-border bg-panel-strong px-5 py-6">
        <div className="space-y-4">
          <Badge className="bg-white/10 text-slate-100">Desktop MVP</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              PoB Headless Desktop
            </h1>
            <p className="text-sm leading-7 text-muted">
              Single-worker control panel for the stable Path of Building headless contract.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <SidebarButton icon={Activity} label="Runtime" />
          <SidebarButton icon={HardDriveDownload} label="Build Loader" />
          <SidebarButton icon={Zap} label="Stats" />
          <SidebarButton icon={Swords} label="Equipment" />
          <SidebarButton icon={Shield} label="Config" />
          <SidebarButton icon={ScrollText} label="Request Console" />
        </div>

        <div className="mt-auto rounded-2xl border border-panel-border bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-muted">Runtime Source</p>
          <p className="mt-2 font-mono text-xs leading-6 text-slate-200">
            Desktop app uses the server-side `POB_HEADLESS_DIR` env value.
          </p>
        </div>
      </aside>

      <main className="space-y-6 pb-10">
        <section className="rounded-[30px] border border-panel-border bg-panel-strong p-8">
          <SectionHeading
            eyebrow="Overview"
            title="Desktop-first stable API control surface"
            description="This MVP keeps a single Lua worker alive on the server, exposes typed Route Handlers, and lets you drive the stable API without touching raw stdin or stdout."
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Card>
            <CardHeader>
              <CardTitle>Runtime Panel</CardTitle>
              <CardDescription>
                Boot and inspect the persistent worker. Health and runtime status are separate so you can see readiness vs. internal session state.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "Health check",
                      endpoint: "/api/runtime/health",
                      request: () => apiPost("/api/runtime/health"),
                      onSuccess: setHealth,
                    })
                  }
                >
                  Ping Health
                </Button>
                <Button
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "Runtime status",
                      endpoint: "/api/runtime/status",
                      request: () => apiPost("/api/runtime/status"),
                      onSuccess: setRuntimeStatus,
                    })
                  }
                >
                  Fetch Status
                </Button>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <JsonPreview value={health} emptyLabel="Health response not loaded." />
                <JsonPreview value={runtimeStatus} emptyLabel="Runtime status not loaded." />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save Controls</CardTitle>
              <CardDescription>
                Export the currently loaded session back to file, XML, or build code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="save-path">Save file path</Label>
                <Input
                  id="save-path"
                  value={savePath}
                  placeholder="G:\\Builds\\MyBuild.xml"
                  onChange={(event) => setSavePath(event.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "Save build file",
                      endpoint: "/api/build/save/file",
                      payload: { path: savePath || undefined },
                      request: () =>
                        apiPost("/api/build/save/file", { path: savePath || undefined }),
                      onSuccess: setSaveOutput,
                    })
                  }
                >
                  Save File
                </Button>
                <Button
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "Save build code",
                      endpoint: "/api/build/save/code",
                      request: () => apiPost("/api/build/save/code"),
                      onSuccess: setSaveOutput,
                    })
                  }
                >
                  Save Code
                </Button>
                <Button
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "Save build XML",
                      endpoint: "/api/build/save/xml",
                      request: () => apiPost("/api/build/save/xml"),
                      onSuccess: setSaveOutput,
                    })
                  }
                >
                  Save XML
                </Button>
              </div>
              <JsonPreview value={saveOutput} emptyLabel="No export output yet." />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <Card>
            <CardHeader>
              <CardTitle>Build Loader</CardTitle>
              <CardDescription>
                Load a build by file path, PoB code, or raw XML. The single worker keeps the session alive after each request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="build-name">Optional build name</Label>
                <Input
                  id="build-name"
                  value={buildName}
                  placeholder="League Starter Snapshot"
                  onChange={(event) => setBuildName(event.target.value)}
                />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="build-file-path">Build file path</Label>
                  <div className="flex gap-3">
                    <Input
                      id="build-file-path"
                      value={buildFilePath}
                      placeholder="G:\\Builds\\Champion.xml"
                      onChange={(event) => setBuildFilePath(event.target.value)}
                    />
                    <Button
                      disabled={isPending}
                      onClick={() =>
                        runAction({
                          title: "Load build file",
                          endpoint: "/api/build/load/file",
                          payload: { path: buildFilePath },
                          request: () => apiPost("/api/build/load/file", { path: buildFilePath }),
                          onSuccess: setSummary,
                        })
                      }
                    >
                      Load File
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="build-code">Build code</Label>
                  <Textarea
                    id="build-code"
                    value={buildCode}
                    placeholder="Paste a PoB build code"
                    onChange={(event) => setBuildCode(event.target.value)}
                  />
                  <Button
                    disabled={isPending}
                    onClick={() =>
                      runAction({
                        title: "Load build code",
                        endpoint: "/api/build/load/code",
                        payload: { code: buildCode, buildName },
                        request: () =>
                          apiPost("/api/build/load/code", { code: buildCode, buildName }),
                        onSuccess: setSummary,
                      })
                    }
                  >
                    Load Code
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="build-xml">Build XML</Label>
                  <Textarea
                    id="build-xml"
                    className="min-h-48"
                    value={buildXml}
                    placeholder="<PathOfBuilding>...</PathOfBuilding>"
                    onChange={(event) => setBuildXml(event.target.value)}
                  />
                  <Button
                    disabled={isPending}
                    onClick={() =>
                      runAction({
                        title: "Load build XML",
                        endpoint: "/api/build/load/xml",
                        payload: { xmlText: buildXml, buildName },
                        request: () =>
                          apiPost("/api/build/load/xml", {
                            xmlText: buildXml,
                            buildName,
                          }),
                        onSuccess: setSummary,
                      })
                    }
                  >
                    Load XML
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Snapshot</CardTitle>
              <CardDescription>
                Pull the latest build summary from the active session at any time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="secondary"
                disabled={isPending}
                onClick={() =>
                  runAction({
                    title: "Get summary",
                    endpoint: "/api/build/summary",
                    request: () => apiPost("/api/build/summary"),
                    onSuccess: setSummary,
                  })
                }
              >
                Refresh Summary
              </Button>
              <JsonPreview
                value={summary}
                emptyLabel="Load a build to see summary output."
                height="min-h-[32rem]"
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <Card>
            <CardHeader>
              <CardTitle>Stats Explorer</CardTitle>
              <CardDescription>
                Request only the fields you care about. Start with the preset list and trim as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stats-fields">Comma-separated fields</Label>
                <Textarea
                  id="stats-fields"
                  className="min-h-32"
                  value={statsFields}
                  onChange={(event) => setStatsFields(event.target.value)}
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() => {
                  const fields = statsFields
                    .split(",")
                    .map((field) => field.trim())
                    .filter(Boolean);

                  runAction({
                    title: "Get stats",
                    endpoint: "/api/build/stats",
                    payload: { fields },
                    request: () => apiPost("/api/build/stats", { fields }),
                    onSuccess: setStats,
                  });
                }}
              >
                Fetch Stats
              </Button>
              <JsonPreview
                value={stats}
                emptyLabel="Stats response not loaded."
                height="min-h-[24rem]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Stats</CardTitle>
              <CardDescription>
                GUI-like sidebar stats rendered from the runtime display stat catalog, not a hand-picked field list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="secondary"
                disabled={isPending}
                onClick={() =>
                  runAction({
                    title: "Get display stats",
                    endpoint: "/api/build/display-stats",
                    request: () => apiPost<DisplayStatsResult>("/api/build/display-stats"),
                    onSuccess: setDisplayStats,
                  })
                }
              >
                Refresh Detailed Stats
              </Button>
              <DisplayStatsPanel value={displayStats} />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Editor</CardTitle>
              <CardDescription>
                Inspect current equipment and push one raw item block into a target slot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "List equipment",
                      endpoint: "/api/equipment",
                      request: () => apiGet("/api/equipment"),
                      onSuccess: setEquipment,
                    })
                  }
                >
                  Refresh Equipment
                </Button>
              </div>
              <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-2">
                  <Label htmlFor="item-slot">Slot</Label>
                  <Select
                    id="item-slot"
                    value={itemSlot}
                    onChange={(event) => setItemSlot(event.target.value)}
                  >
                    {equipmentSlots.map((slot) => (
                      <option key={slot || "auto"} value={slot}>
                        {slot || "Auto-detect"}
                      </option>
                    ))}
                  </Select>
                  <Label htmlFor="item-text" className="pt-2">
                    Item text
                  </Label>
                  <Textarea
                    id="item-text"
                    className="min-h-[22rem]"
                    value={itemText}
                    placeholder={"Rarity: Rare\n..."}
                    onChange={(event) => setItemText(event.target.value)}
                  />
                  <Button
                    disabled={isPending}
                    onClick={() =>
                      runAction({
                        title: "Equip item",
                        endpoint: "/api/equipment/equip",
                        payload: { itemText, slot: itemSlot || undefined },
                        request: () =>
                          apiPost("/api/equipment/equip", {
                            itemText,
                            slot: itemSlot || undefined,
                          }),
                        onSuccess: setEquipment,
                      })
                    }
                  >
                    Equip Item
                  </Button>
                </div>
                <JsonPreview
                  value={equipment}
                  emptyLabel="Equipment output not loaded."
                  height="min-h-[30rem]"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <Card>
            <CardHeader>
              <CardTitle>Stable Config Form</CardTitle>
              <CardDescription>
                This form only targets the stable contract fields declared in the runtime manifest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "Get config",
                      endpoint: "/api/config",
                      request: () => apiGet<Record<string, unknown>>("/api/config"),
                      onSuccess: setConfig,
                    })
                  }
                >
                  Load Config
                </Button>
                <Button
                  disabled={isPending}
                  onClick={() =>
                    runAction({
                      title: "Set config",
                      endpoint: "/api/config",
                      payload: config,
                      request: () => apiPost<Record<string, unknown>>("/api/config", config),
                      onSuccess: setConfig,
                    })
                  }
                >
                  Apply Config
                </Button>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {configFieldDefinitions.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-2xl border border-panel-border bg-white/[0.03] p-4"
                  >
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.kind === "boolean" ? (
                      <div className="mt-3 flex items-center gap-3">
                        <Checkbox
                          id={field.key}
                          checked={Boolean(normalizeFieldValue("boolean", config[field.key]))}
                          onChange={(event) =>
                            setConfig((current) => ({
                              ...current,
                              [field.key]: event.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm text-slate-200">Enabled</span>
                      </div>
                    ) : (
                      <Input
                        id={field.key}
                        className="mt-3"
                        value={String(normalizeFieldValue(field.kind, config[field.key]))}
                        onChange={(event) =>
                          setConfig((current) => ({
                            ...current,
                            [field.key]:
                              field.kind === "number"
                                ? event.target.value === ""
                                  ? undefined
                                  : Number(event.target.value)
                                : event.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Console</CardTitle>
              <CardDescription>
                Recent calls are mirrored here so MVP debugging stays inside the app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consoleEntries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-panel-border p-6 text-sm text-muted">
                  No requests yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {consoleEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-panel-border bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{entry.title}</p>
                          <p className="font-mono text-xs text-muted">{entry.endpoint}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge tone={entry.status === "success" ? "success" : "danger"}>
                            {entry.status}
                          </Badge>
                          <span className="font-mono text-xs text-muted">{entry.createdAt}</span>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 xl:grid-cols-2">
                        <JsonPreview value={entry.payload} emptyLabel="No payload." height="min-h-28" />
                        <JsonPreview
                          value={entry.response}
                          emptyLabel="No response."
                          height="min-h-28"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
