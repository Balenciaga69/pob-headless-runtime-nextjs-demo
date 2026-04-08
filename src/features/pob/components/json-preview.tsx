"use client";

import { formatJson } from "@/lib/utils";

export function JsonPreview({
  value,
  emptyLabel = "No data yet.",
  height = "min-h-44",
}: {
  value: unknown;
  emptyLabel?: string;
  height?: string;
}) {
  return (
    <pre
      className={`scrollbar-thin overflow-auto rounded-2xl border border-panel-border bg-[#050816] p-4 font-mono text-xs leading-6 text-slate-200 ${height}`}
    >
      {value ? formatJson(value) : emptyLabel}
    </pre>
  );
}
