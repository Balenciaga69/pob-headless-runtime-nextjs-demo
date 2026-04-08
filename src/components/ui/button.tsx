import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl border text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-linear-to-r from-[#7180ff] via-[#7c6df2] to-[#59c9ff] px-4 py-2.5 text-white shadow-[0_14px_32px_rgba(98,112,255,0.28)] hover:brightness-110",
        secondary:
          "border-panel-border bg-white/5 px-4 py-2.5 text-foreground hover:bg-white/10",
        ghost: "border-transparent bg-transparent px-3 py-2 text-muted hover:text-foreground",
        danger:
          "border-transparent bg-linear-to-r from-[#ff5a8a] to-[#ff7c7c] px-4 py-2.5 text-white hover:brightness-110",
      },
      size: {
        default: "h-11",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
