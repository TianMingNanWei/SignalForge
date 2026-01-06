"use client"

import { TechCard } from "@/components/tech-card"
import { ShieldAlert, UserPlus, FileUp, Settings } from "lucide-react"

export function RecentActivity() {
    return (
        <TechCard className="col-span-4 lg:col-span-1">
            <div className="mb-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                    System logs and audit trail.
                </p>
            </div>
            <div className="space-y-8">
                <div className="flex items-center">
                    <span className="relative flex h-2 w-2 mr-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">New User Registered</p>
                        <p className="text-sm text-muted-foreground">
                            user@example.com joined.
                        </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">Just now</div>
                </div>
                <div className="flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-4 text-yellow-500" />
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Firewall Update</p>
                        <p className="text-sm text-muted-foreground">
                            Ruleset v4.2.0 applied.
                        </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">2h ago</div>
                </div>
                <div className="flex items-center">
                    <FileUp className="h-4 w-4 mr-4 text-green-500" />
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">Data Export</p>
                        <p className="text-sm text-muted-foreground">
                            Audit logs exported.
                        </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">5h ago</div>
                </div>
                <div className="flex items-center">
                    <Settings className="h-4 w-4 mr-4 text-gray-500" />
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">System Maintenance</p>
                        <p className="text-sm text-muted-foreground">
                            Scheduled for 02:00 AM
                        </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">1d ago</div>
                </div>
            </div>
        </TechCard>
    )
}
