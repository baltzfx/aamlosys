"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type DepartmentForm = {
  code: string;
  department: string;
  group: string;
  section: string;
  unit: string;
  remarks?: string;
};

export default function ViewDepartmentPage() {
  const { departmentId } = useParams();
  const [form, setForm] = useState<DepartmentForm | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/departments/${departmentId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: DepartmentForm) => setForm(data));
  }, [departmentId]);

  if (!form) return <p className="text-gray-400">Loading department...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.department}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(form).map(([key, value]) =>
          key !== "remarks" ? (
            <Input key={key} value={String(value)} readOnly />
          ) : (
            <Textarea key={key} value={String(value || "")} readOnly />
          )
        )}
      </CardContent>
    </Card>
  );
}
