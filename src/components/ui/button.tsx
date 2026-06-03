import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * RCD button — mirrors Figma frame 95:302.
 *
 *   role  : primary (ink) · secondary (copper) · ghost (ink outline)
 *           outline / link / destructive kept for shadcn back-compat
 *   size  : default 44px · sm 36px · lg 48px · icon 44sq
 *
 * Base styling uses the pill radius from the RCD token system. All
 * states (hover / active / focus / disabled) come from the canonical
 * RCD palette via the Tailwind aliases declared in tailwind.config.ts.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "rounded-pill font-sans font-semibold leading-none",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
    "disabled:pointer-events-none disabled:bg-disabled-bg disabled:text-disabled-fg",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // RCD primary — charcoal ink pill
        default:
          "bg-ink text-paper hover:bg-ink-soft active:bg-black",
        // RCD secondary — copper pill
        copper:
          "bg-copper text-paper hover:bg-copper-hover active:bg-copper-active",
        // RCD ghost — ink outline on transparent
        ghost:
          "bg-transparent text-ink border border-ink hover:bg-cream active:bg-cream-soft",
        // shadcn aliases kept for compatibility
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background text-foreground hover:bg-cream",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:
          "rounded-none px-0 h-auto text-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-base",      // 44 / 24 / 16
        sm: "h-9 px-[18px] text-sm",         // 36 / 18 / 14
        lg: "h-12 px-8 text-base",           // 48 / 32 / 16
        icon: "h-11 w-11 p-0",
        "icon-sm": "h-9 w-9 p-0",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
