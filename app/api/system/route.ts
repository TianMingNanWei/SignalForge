import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
    try {
        const cpus = os.cpus();
        const memory = {
            total: os.totalmem(),
            free: os.freemem(),
            used: os.totalmem() - os.freemem(),
        };
        const uptime = os.uptime();
        const platform = os.platform();
        const release = os.release();
        const loadAvg = os.loadavg();

        return NextResponse.json({
            cpu: {
                model: cpus[0]?.model || "Unknown",
                cores: cpus.length,
                speed: cpus[0]?.speed || 0,
            },
            memory,
            uptime,
            platform,
            release,
            loadAvg,
            hostname: os.hostname(),
            arch: os.arch(),
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch system info" },
            { status: 500 }
        );
    }
}
