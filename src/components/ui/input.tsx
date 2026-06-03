import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * RCD input — 44px pill field on paper, ink-muted placeholder,
 * ink focus ring matching the canonical .input rule from the
 * design system reference.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "box-border flex h-11 w-full rounded-pill border border-border-default bg-paper px-4 font-sans text-base text-ink shadow-rcd-sm",
          "placeholder:text-ink-muted",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
          "transition-[border-color,box-shadow] duration-200",
          "hover:border-ink/15",
          "focus-visible:border-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          "disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-disabled-bg disabled:text-disabled-fg",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
