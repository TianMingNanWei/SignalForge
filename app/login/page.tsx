"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client" // We'll assume user might need to adjust import path if needed, but this is standard
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { TechCard } from "@/components/tech-card"
import { Loader2 } from "lucide-react"
import { ModeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async () => {
        setLoading(true)
        await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard",
        }, {
            onRequest: () => {
                setLoading(true)
            },
            onSuccess: () => {
                router.push("/dashboard")
                setLoading(false)
            },
            onError: (ctx) => {
                alert(ctx.error.message)
                setLoading(false)
            },
        })
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
            <div className="absolute top-4 right-4">
                <ModeToggle />
            </div>

            <TechCard className="w-full max-w-md backdrop-blur-2xl">
                <div className="space-y-6">
                    <div className="space-y-2 text-center">
                        <div className="inline-block h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-2 shadow-lg shadow-blue-500/50" />
                        <h1 className="text-3xl font-bold tracking-tighter">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Enter your credentials to access the Forge.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="admin@signalforge.com"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-background/50 border-input/50 focus:border-blue-500 transition-colors"
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-background/50 border-input/50 focus:border-blue-500 transition-colors"
                                autoComplete="current-password"
                            />
                        </div>
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {loading ? "Authenticating..." : "Sign In"}
                        </Button>
                    </div>
                    <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Authorized personnel only. All activities are monitored.
                    </div>
                </div>
            </TechCard>
        </div>
    )
}
