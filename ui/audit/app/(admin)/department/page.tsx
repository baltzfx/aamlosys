"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DepartmentsTable from "@/components/DepartmentsTable";

export default function DepartmentsPage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDepartments = async () => {
    try {
      const res = await fetch("http://localhost:8000/departments", {
        credentials: "include",
      });

      if (res.status === 401) return router.push("/login");

      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch {
      router.push("/login");
    }
  };

  useEffect(() => {
    loadDepartments().finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading departments...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Departments</CardTitle>
      </CardHeader>
      <CardContent>
        <DepartmentsTable
          departments={departments}
          onView={(id) => router.push(`/department/${id}`)}
          onEdit={(id) => router.push(`/department/${id}/edit`)}
          onDelete={async (id) => {
            if (!confirm("Delete this department?")) return;
            await fetch(`http://localhost:8000/departments/${id}`, {
              method: "DELETE",
              credentials: "include",
            });
            loadDepartments();
          }}
          onAdd={() => router.push("/department/create_new")}
        />
      </CardContent>
    </Card>
  );
}
