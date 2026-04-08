"use client";

import type { DisplayStatEntry, DisplayStatsResult } from "@/features/pob/types";

function getToneClasses(entry: DisplayStatEntry) {
  const signal = `${entry.key ?? ""} ${entry.label ?? ""} ${entry.colorHint ?? ""}`.toLowerCase();

  if (signal.includes("fire")) {
    return "text-orange-300";
  }
  if (signal.includes("cold")) {
    return "text-sky-300";
  }
  if (signal.includes("lightning")) {
    return "text-yellow-300";
  }
  if (signal.includes("chaos")) {
    return "text-fuchsia-300";
  }
  if (signal.includes("life")) {
    return "text-rose-300";
  }
  if (signal.includes("mana")) {
    return "text-indigo-300";
  }
  if (signal.includes("energy shield") || signal.includes("energyshield")) {
    return "text-cyan-300";
  }
  if (signal.includes("armour")) {
    return "text-stone-300";
  }
  if (signal.includes("evasion")) {
    return "text-emerald-300";
  }
  if (signal.includes("strength")) {
    return "text-orange-300";
  }
  if (signal.includes("dexterity")) {
    return "text-green-300";
  }
  if (signal.includes("intelligence")) {
    return "text-blue-300";
  }

  return "text-slate-100";
}

function StatRow({ entry }: { entry: DisplayStatEntry }) {
  const toneClasses = getToneClasses(entry);

  if (entry.type === "separator") {
    return <div className="my-2 border-t border-white/8" />;
  }

  if (entry.type === "skill_dps") {
    return (
      <div className="space-y-1 py-1">
        <div className="flex items-baseline justify-between gap-4">
          <span className={`text-sm ${toneClasses}`}>{entry.label}</span>
          <span className="font-mono text-sm text-slate-200">{entry.formatted}</span>
        </div>
        {entry.skillPart ? (
          <p className="text-right text-[11px] text-muted">{entry.skillPart}</p>
        ) : null}
        {entry.source ? (
          <p className="text-right text-[11px] text-cyan-300">from {entry.source}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className={`text-sm ${toneClasses}`}>{entry.label}</span>
      <span className="text-right font-mono text-sm text-slate-200">
        {entry.formatted}
      </span>
    </div>
  );
}

export function DisplayStatsPanel({ value }: { value: DisplayStatsResult | null }) {
  if (!value || value.entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-panel-border bg-[#050816] p-6 text-sm text-muted">
        Detailed stats not loaded.
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-2xl border border-panel-border bg-[#050816] p-5">
      <div className="mb-4 border-b border-white/8 pb-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Active Skill</p>
        <p className="mt-2 text-lg font-semibold text-white">
          {value._meta?.mainSkill ?? "Unknown skill"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
          {value._meta?.skillContext?.socketGroupLabel ? (
            <span>Group: {value._meta.skillContext.socketGroupLabel}</span>
          ) : null}
          {value._meta?.skillContext?.skillPartName ? (
            <span>Part: {value._meta.skillContext.skillPartName}</span>
          ) : null}
          {value._meta?.skillContext?.selectionSource ? (
            <span>Source: {value._meta.skillContext.selectionSource}</span>
          ) : null}
        </div>
      </div>

      <div className="space-y-0.5">
        {value.entries.map((entry, index) => (
          <StatRow
            key={`${entry.type}-${entry.key ?? entry.label ?? "separator"}-${index}`}
            entry={entry}
          />
        ))}
      </div>
    </div>
  );
}
