"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import EmployeesTable from "@/components/emp_table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface UserProfile {
  username: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function Page() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/profile", { // <- note /user/profile
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        } else if (res.status === 401) {
          router.replace("/login")  // redirect to login if session missing
        } else {
          console.error("Failed to fetch profile")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader profile={profile} />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              {/* --- Tables --- */}
              <EmployeesTable />

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
