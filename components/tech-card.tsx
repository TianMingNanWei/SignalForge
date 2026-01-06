"use client"

import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface TechCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
    className?: string
}

export function TechCard({ children, className, ...props }: TechCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "relative overflow-hidden rounded-xl border bg-background/50 p-6 backdrop-blur-xl transition-all hover:bg-background/80",
                "border-border/50 shadow-2xl hover:shadow-[0_0_2rem_-0.5rem_#3b82f6]",
                "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-blue-500/10 before:via-purple-500/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            {children}
        </motion.div>
    )
}
