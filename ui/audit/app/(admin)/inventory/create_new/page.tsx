"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default function CreateInventoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    asset_tag: "",
    name: "",
    category: "System Unit", // default category
    serial_number: "",
    is_consumable: false,
    status: "available", // default status
    branch_id: "", // should select or input branch ID
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/inventory", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        branch_id: Number(form.branch_id),
      }),
    });

    if (res.ok) router.push("/inventory");
    else alert("Failed to create inventory");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Inventory Item</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Asset Tag (Device Name)"
          value={form.asset_tag}
          onChange={(e) => setForm({ ...form, asset_tag: e.target.value })}
        />
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Category (device, equipment, consumable)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <Input
          placeholder="Serial Number (SKU)"
          value={form.serial_number}
          onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
        />
        <Input
          placeholder="Branch ID"
          type="number"
          value={form.branch_id}
          onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
        />
        <Input
          placeholder="Status (available, assigned, damaged, retired)"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_consumable}
            onChange={(e) => setForm({ ...form, is_consumable: e.target.checked })}
          />
          <label>Is Consumable?</label>
        </div>

        <Button onClick={handleSubmit}>Save</Button>
      </CardContent>
    </Card>
  );
}
