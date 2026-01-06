import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { User, Users, LayoutDashboard, LogOut, Server, MessageSquare, CandlestickChart } from "lucide-react";
import { SignOutButton } from "./sign-out-button"; // Separate client component for sign out
import { ModeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/login");
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Sidebar className="border-r border-border/50 bg-background/50 backdrop-blur-xl">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 my-4">
                                SIGNAL FORGE
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard">
                                                <LayoutDashboard />
                                                <span>Dashboard</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarGroup>
                            <SidebarGroupLabel>Management</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/users">
                                                <Users />
                                                <span>User Management</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/system">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-border/50 bg-background/50">
                                                    <Server className="h-3 w-3" />
                                                </div>
                                                <span>System Info</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarGroup>
                            <SidebarGroupLabel>Longbridge Accounts</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/accounts/message">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-border/50 bg-background/50">
                                                    <MessageSquare className="h-3 w-3" />
                                                </div>
                                                <span>Message Accounts</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/accounts/trading">
                                                <div className="flex h-5 w-5 items-center justify-center rounded-md border border-border/50 bg-background/50">
                                                    <CandlestickChart className="h-3 w-3" />
                                                </div>
                                                <span>Trading Accounts</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarGroup className="mt-auto">
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/profile">
                                                <User />
                                                <span>Profile</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SignOutButton />
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <main className="w-full relative">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background" />
                    <div className="p-4 flex items-center border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                        <SidebarTrigger />
                        <div className="ml-4 font-semibold">Dashboard</div>
                        <div className="ml-auto">
                            <ModeToggle />
                        </div>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
