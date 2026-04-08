import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        tone === "default" && "border-panel-border bg-white/5 text-muted",
        tone === "success" && "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
        tone === "danger" && "border-rose-400/30 bg-rose-400/10 text-rose-200",
        className,
      )}
      {...props}
    />
  );
}
