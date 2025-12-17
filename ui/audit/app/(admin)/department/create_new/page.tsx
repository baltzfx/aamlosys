"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function CreateDepartmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    code: "",
    department: "",
    group: "",
    section: "",
    unit: "",
    remarks: "",
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/departments", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/department");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Department</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          key !== "remarks" ? (
            <Input
              key={key}
              placeholder={key.toUpperCase()}
              value={value}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ) : (
            <Textarea
              key={key}
              placeholder="Remarks"
              value={value}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          )
        ))}

        <Button onClick={handleSubmit}>Save</Button>
      </CardContent>
    </Card>
  );
}
