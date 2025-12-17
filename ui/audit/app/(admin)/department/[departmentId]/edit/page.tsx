"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type DepartmentForm = {
  code: string;
  department: string;
  group: string;
  section: string;
  unit: string;
  remarks?: string;
};

export default function EditDepartmentPage() {
  const { departmentId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<DepartmentForm | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/departments/${departmentId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: DepartmentForm) => setForm(data));
  }, [departmentId]);

  const handleSubmit = async () => {
    if (!form) return;

    const res = await fetch(`http://localhost:8000/departments/${departmentId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push(`/department/${departmentId}`);
  };

  if (!form) return <p className="text-gray-400">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Department</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(form).map(([key, value]) =>
          key !== "remarks" ? (
            <Input
              key={key}
              placeholder={key.toUpperCase()}
              value={String(value)} // 🔹 cast to string
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value } as DepartmentForm)
              }
            />
          ) : (
            <Textarea
              key={key}
              placeholder="Remarks"
              value={String(value || "")} // 🔹 cast to string and handle undefined
              onChange={(e) => setForm({ ...form, remarks: e.target.value } as DepartmentForm)}
            />
          )
        )}
        <Button onClick={handleSubmit}>Update</Button>
      </CardContent>
    </Card>
  );
}
