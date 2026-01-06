"use client"

import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Welcome back, {session?.user?.name || "User"}
            </h1>
            <p>Select an option from the sidebar to verify functionalities.</p>
        </div>
    )
}
