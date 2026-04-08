import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-panel-border bg-white/[0.04] px-3 text-sm text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent focus:bg-white/[0.06]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
