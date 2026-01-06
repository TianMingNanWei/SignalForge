"use client"

import { TechCard } from "@/components/tech-card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
    { name: "00:00", signal: 4000 },
    { name: "04:00", signal: 3000 },
    { name: "08:00", signal: 2000 },
    { name: "12:00", signal: 2780 },
    { name: "16:00", signal: 1890 },
    { name: "20:00", signal: 2390 },
    { name: "23:59", signal: 3490 },
]

export function OverviewChart() {
    // Fix for Recharts ResponsiveContainer width/height issue
    // Ensure chart is only rendered on client side after mount
    // This prevents the "width(-1) and height(-1)" error during hydration or initial layout
    return (
        <TechCard className="col-span-4 lg:col-span-3">
            <div className="mb-4">
                <h3 className="text-lg font-medium">Signal Activity</h3>
                <p className="text-sm text-muted-foreground">
                    Real-time signal processing throughput over the last 24 hours.
                </p>
            </div>
            <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSignal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value} Gbps`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="signal"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorSignal)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </TechCard>
    )
}
