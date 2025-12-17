"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateBranchPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    branch_code: "",
    branch_name: "",
    branch_address: "",
    date_established: "",
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/branches", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/branches");
    else alert("Failed to create branch");
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Create Branch</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Branch Code</Label>
          <Input
            value={form.branch_code}
            onChange={(e) => setForm({ ...form, branch_code: e.target.value })}
          />
        </div>

        <div>
          <Label>Branch Name</Label>
          <Input
            value={form.branch_name}
            onChange={(e) => setForm({ ...form, branch_name: e.target.value })}
          />
        </div>

        <div>
          <Label>Address</Label>
          <Input
            value={form.branch_address}
            onChange={(e) => setForm({ ...form, branch_address: e.target.value })}
          />
        </div>

        <div>
          <Label>Date Established</Label>
          <Input
            type="date"
            value={form.date_established}
            onChange={(e) => setForm({ ...form, date_established: e.target.value })}
          />
        </div>

        <Button onClick={handleSubmit}>Create Branch</Button>
      </CardContent>
    </Card>
  );
}
