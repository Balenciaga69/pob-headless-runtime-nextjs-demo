"use client";

import { DisplayStatsPanel } from "@/features/pob/components/display-stats-panel";
import { JsonPreview } from "@/features/pob/components/json-preview";
import type { PreviewItemDisplayStatsResult } from "@/features/pob/types";

export function PreviewItemDisplayStatsPanel({
  value,
}: {
  value: PreviewItemDisplayStatsResult | null;
}) {
  if (!value) {
    return (
      <div className="rounded-2xl border border-dashed border-panel-border bg-[#050816] p-6 text-sm text-muted">
        No preview result yet.
      </div>
    );
  }

  const previewMeta = {
    kind: value.kind,
    restored: value.restored,
    simulationMode: value.simulationMode,
    slot: value.slot,
    currentItem: value.currentItem,
    candidateItem: value.candidateItem,
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
      <JsonPreview value={previewMeta} emptyLabel="Preview metadata unavailable." />
      <DisplayStatsPanel value={value.displayStats ?? null} />
    </div>
  );
}
