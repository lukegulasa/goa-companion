
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  boostedValue?: number;
  baseColor?: string;
  boostedColor?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, boostedValue, baseColor, boostedColor, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    {/* Base value indicator */}
    <ProgressPrimitive.Indicator
      className={cn("h-full flex-1 transition-all", baseColor || "bg-primary")}
      style={{ width: `${value || 0}%` }}
    />
    
    {/* Boosted value indicator (if provided) */}
    {boostedValue !== undefined && boostedValue > (value || 0) && (
      <ProgressPrimitive.Indicator
        className={cn("h-full flex-1 transition-all absolute top-0", boostedColor || "bg-purple-500")}
        style={{ 
          left: `${value || 0}%`,
          width: `${boostedValue - (value || 0)}%`
        }}
      />
    )}
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
