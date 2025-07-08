import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "nexus-btn-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg shadow-[var(--nexus-shadow-sm)]",
        outline: "nexus-btn-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg shadow-[var(--nexus-shadow-sm)]",
        ghost: "nexus-btn-tertiary",
        link: "text-primary underline-offset-4 hover:underline bg-transparent",
        nexus: "nexus-btn-primary",
        "nexus-secondary": "nexus-btn-secondary", 
        "nexus-tertiary": "nexus-btn-tertiary"
      },
      size: {
        default: "text-sm",
        sm: "nexus-btn-small text-xs",
        lg: "nexus-btn-large text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
