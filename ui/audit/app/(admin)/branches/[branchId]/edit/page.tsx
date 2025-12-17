"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditBranchPage() {
  const { branchId } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    branch_code: "",
    branch_name: "",
    branch_address: "",
    date_established: "",
  });

  useEffect(() => {
    const loadBranch = async () => {
      const res = await fetch(`http://localhost:8000/branches/${branchId}`, {
        credentials: "include",
      });

      const data = await res.json();
      setForm(data);
    };

    loadBranch();
  }, [branchId]);

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:8000/branches/${branchId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) router.push(`/branches/${branchId}`);
    else alert("Update failed");
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Branch</CardTitle>
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

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Save Changes</Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
