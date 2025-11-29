"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
  username: string
  email: string
  role: string
  status: string
  created_at: string
}

export function SiteHeader({ profile }: { profile?: UserProfile | null }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      if (res.ok) {
        toast.success("Logged out successfully!")
        router.replace("/login")
      } else {
        const err = await res.json()
        toast.error(err.detail || "Logout failed")
      }
    } catch (err) {
      console.error(err)
      toast.error("Logout failed")
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <h1 className="text-base font-medium">Dashboard</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/avatar.png" alt="User avatar" />
                <AvatarFallback>
                  {profile?.username
                    ? profile.username.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>


            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>
                {profile?.username ?? "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
