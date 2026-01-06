"use client"

import { TechCard } from "@/components/tech-card"
import { Activity, Users, Server, Shield } from "lucide-react"

export function DashboardStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TechCard>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">Total Users</h3>
                    <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                </p>
            </TechCard>
            <TechCard>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">Active Signals</h3>
                    <Activity className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                    +201 since last hour
                </p>
            </TechCard>
            <TechCard>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">System Status</h3>
                    <Server className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">Optimal</div>
                <p className="text-xs text-muted-foreground">
                    Latency: 12ms
                </p>
            </TechCard>
            <TechCard>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="text-sm font-medium">Security Level</h3>
                    <Shield className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">High</div>
                <p className="text-xs text-muted-foreground">
                    Zero threats detected
                </p>
            </TechCard>
        </div>
    )
}
