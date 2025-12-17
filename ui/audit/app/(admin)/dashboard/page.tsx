"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "@/components/UsersTable";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUsers = async () => {
    const res = await fetch("http://localhost:8000/users", {
      credentials: "include",
    });
    if (res.status === 401) return router.push("/login");
    const data = await res.json();
    setUsers(data);
    setTotalUsers(data.length);
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;

    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      loadUsers(); // refresh list
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        await loadUsers();

        const empRes = await fetch("http://localhost:8000/employees", {
          credentials: "include",
        });
        const employees = await empRes.json();
        setTotalEmployees(employees.length);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  if (loading) return <p className="text-gray-400">Loading dashboard...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{totalUsers}</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Employees</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">{totalEmployees}</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Branches</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">—</p></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Clients</CardTitle></CardHeader>
          <CardContent><p className="text-4xl font-bold">—</p></CardContent>
        </Card>
      </div>

      {/* USERS TABLE */}
      <Card>
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            onView={(id) => router.push(`/users/${id}`)}
            onEdit={(id) => router.push(`/users/${id}/edit`)}
            onDelete={(id) => deleteUser(id)}
            onAddUser={() => router.push("/users/create_new")}
          />
        </CardContent>
      </Card>

    </>
  );
}
