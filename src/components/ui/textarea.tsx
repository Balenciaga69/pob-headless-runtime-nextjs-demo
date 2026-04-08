import * as React from "react";

import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-xl border border-panel-border bg-white/[0.04] px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent focus:bg-white/[0.06]",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
