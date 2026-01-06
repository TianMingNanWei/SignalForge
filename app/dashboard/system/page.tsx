"use client"

import { useEffect, useState } from "react";
import { TechCard } from "@/components/tech-card";
import { Cpu, HardDrive, Laptop, Activity, Clock, Server } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SystemInfo {
    cpu: {
        model: string;
        cores: number;
        speed: number;
    };
    memory: {
        total: number;
        free: number;
        used: number;
    };
    uptime: number;
    platform: string;
    release: string;
    loadAvg: number[];
    hostname: string;
    arch: string;
}

export default function SystemInfoPage() {
    const [info, setInfo] = useState<SystemInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/system");
            if (res.ok) {
                const data = await res.json();
                setInfo(data);
            }
        } catch (error) {
            console.error("Failed to fetch system info", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatUptime = (seconds: number) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor(seconds % (3600 * 24) / 3600);
        const m = Math.floor(seconds % 3600 / 60);
        const s = Math.floor(seconds % 60);

        const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        const hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        const mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        const sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    };

    if (loading) {
        return <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        </div>
    }

    if (!info) return <div>Failed to load system info.</div>;

    const memoryUsagePercent = ((info.memory.used / info.memory.total) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-500">
                System Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TechCard>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">CPU Information</h3>
                        <Cpu className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-sm font-bold mt-2 truncate text-ellipsis" title={info.cpu.model}>{info.cpu.model}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Cores: <span className="text-foreground">{info.cpu.cores}</span> | Speed: <span className="text-foreground">{info.cpu.speed} MHz</span>
                    </div>
                </TechCard>

                <TechCard>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Memory Usage</h3>
                        <HardDrive className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold mt-2">{memoryUsagePercent}%</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Used: {formatBytes(info.memory.used)} / Total: {formatBytes(info.memory.total)}
                    </div>
                    {/* Simple progress bar */}
                    <div className="w-full bg-secondary h-1.5 mt-2 rounded-full overflow-hidden">
                        <div
                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${memoryUsagePercent}%` }}
                        />
                    </div>
                </TechCard>

                <TechCard>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Platform</h3>
                        <Laptop className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-lg font-bold mt-2">{info.platform} {info.release}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Arch: {info.arch}
                    </div>
                </TechCard>

                <TechCard>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">System Uptime</h3>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="text-sm font-bold mt-2">{formatUptime(info.uptime)}</div>
                </TechCard>

                <TechCard>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Load Average</h3>
                        <Activity className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex gap-4 mt-2">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">1 min</span>
                            <span className="font-bold">{info.loadAvg[0]?.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">5 min</span>
                            <span className="font-bold">{info.loadAvg[1]?.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">15 min</span>
                            <span className="font-bold">{info.loadAvg[2]?.toFixed(2)}</span>
                        </div>
                    </div>
                </TechCard>

                <TechCard>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Hostname</h3>
                        <Server className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="text-lg font-bold mt-2">{info.hostname}</div>
                </TechCard>
            </div>
        </div>
    )
}
