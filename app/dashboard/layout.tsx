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
import { User, Users, LayoutDashboard, LogOut } from "lucide-react";
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
            <div className="flex min-h-screen w-full">
                <Sidebar>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Signal Forge</SidebarGroupLabel>
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
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="/dashboard/users">
                                                <Users />
                                                <span>User Management</span>
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
                <main className="w-full">
                    <div className="p-4 flex items-center border-b">
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
