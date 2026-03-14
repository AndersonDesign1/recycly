import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 font-medium text-xs transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/15 bg-primary/10 text-primary",
        secondary:
          "border-border bg-background/70 text-[color:var(--ink-soft)]",
        success: "border-emerald-200/70 bg-emerald-100/80 text-emerald-900",
        warning: "border-amber-200/70 bg-amber-100/80 text-amber-900",
        destructive: "border-orange-200/70 bg-orange-100/80 text-orange-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ className, variant }))} {...props} />
  );
}

export { Badge, badgeVariants };
