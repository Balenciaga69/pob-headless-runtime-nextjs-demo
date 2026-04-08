import * as React from "react";

import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-panel-border bg-white/5 accent-[#7b82ff]",
        className,
      )}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";
