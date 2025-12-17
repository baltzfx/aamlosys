"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmployeesTable from "@/components/EmployeesTable";

export default function EmployeesPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<any[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadEmployees = async () => {
    try {
      const res = await fetch("http://localhost:8000/employees", {
        credentials: "include",
      });

      if (res.status === 401) return router.push("/login");

      const data = await res.json();
      setEmployees(data);
      setTotalEmployees(data.length);
    } catch (err) {
      router.push("/login");
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!confirm("Delete this employee?")) return;

    const res = await fetch(`http://localhost:8000/employees/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      loadEmployees();
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadEmployees();
      setLoading(false);
    };
    loadData();
  }, [router]);

  if (loading) return <p className="text-gray-400">Loading employees...</p>;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeesTable
            employees={employees}
            onView={(id) => router.push(`/employees/${id}`)}
            onEdit={(id) => router.push(`/employees/${id}/edit`)}
            onDelete={(id) => deleteEmployee(id)}
            onAddEmployee={() => router.push("/employees/create_new")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
