import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 animate-fade-in",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary-highlight shadow-soft hover:shadow-elegant",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-soft hover:shadow-elegant",
        outline: "text-foreground border-border hover:bg-muted/50",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success-highlight shadow-soft hover:shadow-elegant",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning-highlight shadow-soft hover:shadow-elegant",
        info:
          "border-transparent bg-info text-info-foreground hover:bg-info-highlight shadow-soft hover:shadow-elegant",
        danger:
          "border-transparent bg-danger text-danger-foreground hover:bg-danger-highlight shadow-soft hover:shadow-elegant",
        "priority-high":
          "border-transparent bg-priority-high text-priority-high-foreground hover:bg-danger-highlight shadow-glow animate-glow",
        "priority-medium":
          "border-transparent bg-priority-medium text-priority-medium-foreground hover:bg-warning-highlight shadow-soft hover:shadow-elegant",
        "priority-low":
          "border-transparent bg-priority-low text-priority-low-foreground hover:bg-success-highlight shadow-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
