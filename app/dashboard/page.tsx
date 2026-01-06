"use client"

import { useSession } from "@/lib/auth-client";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Dashboard Overview
                </h2>
            </div>

            <DashboardStats />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <OverviewChart />
                <RecentActivity />
            </div>
        </div>
    )
}
