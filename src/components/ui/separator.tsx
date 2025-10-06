import * as React from "react"
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.ComponentPropsWithoutRef<"div"> {
    orientation?: "horizontal" | "vertical"
    decorative?: boolean
}

const Separator = React.forwardRef<
    React.ElementRef<"div">,
    SeparatorProps
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "shrink-0 bg-gray-200 dark:bg-gray-700",
            orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
            className
        )}
        {...props}
    />
))
Separator.displayName = "Separator"

export { Separator }