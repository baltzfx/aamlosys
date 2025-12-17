"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  // Check login session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUsername(data.username ?? "");
      } catch (error) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 flex flex-col">
        <Header username={username} />

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
