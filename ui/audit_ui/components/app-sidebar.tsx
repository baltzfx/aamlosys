"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconComponents,
  IconSearch,
  IconInnerShadowTop,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

// Sidebar data
const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Employee Management", url: "/employees", icon: IconUsers },
  { title: "User Management", url: "/users", icon: IconBuilding },
  { title: "Device Management", url: "/devices", icon: IconComponents },
  { title: "Audit Results", url: "/audit_results", icon: IconSearch },
]

// Example user info
const user = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar() {
  const pathname = usePathname() // get current route for active highlighting

  return (
    <Sidebar collapsible="offcanvas">
      {/* Sidebar header / logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/dashboard" className="flex items-center gap-2">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">AAMLO</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "bg-muted rounded" : ""}
                    >
                      <Link href={item.url} className="flex items-center gap-2 w-full">
                        <item.icon className="!size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar footer / user info */}
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <div className="flex flex-col text-sm">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
