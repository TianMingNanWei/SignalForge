"use client"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function SignOutButton() {
    const router = useRouter();
    return (
        <SidebarMenuButton onClick={async () => {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login")
                    }
                }
            })
        }}>
            <LogOut />
            <span>Sign Out</span>
        </SidebarMenuButton>
    )
}
