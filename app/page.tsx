"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TechCard } from "@/components/tech-card"
import { ModeToggle } from "@/components/theme-toggle"
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />
            <span>Signal Forge</span>
          </div>
          <nav className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_1rem_-0.25rem_#2563eb]">
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-24">
        <section className="container px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-500 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-ping" />
                V1.0 System Online
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-600">
                Next-Gen Signal Processing
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Advanced telemetry, real-time analytics, and secure user management. Built for the future of data transmission.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200 w-full md:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#">
                  <Button variant="outline" size="lg" className="w-full md:w-auto">
                    Documentation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TechCard className="md:col-span-2">
                <ShieldCheck className="h-10 w-10 text-blue-500 mb-2" />
                <h3 className="font-bold text-lg">Secure Core</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enterprise-grade encryption and role-based access control (RBAC) ensuring data integrity.
                </p>
              </TechCard>
              <TechCard>
                <Zap className="h-10 w-10 text-yellow-500 mb-2" />
                <h3 className="font-bold text-lg">Real-time</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Zero-latency signal processing pipeline.
                </p>
              </TechCard>
              <TechCard>
                <Globe className="h-10 w-10 text-purple-500 mb-2" />
                <h3 className="font-bold text-lg">Global Scale</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Distributed edge computing architecture.
                </p>
              </TechCard>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
