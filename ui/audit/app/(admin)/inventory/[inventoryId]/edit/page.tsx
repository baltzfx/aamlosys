"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditInventoryPage() {
  const { inventoryId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>({
    asset_tag: "",
    name: "",
    category: "System Unit",
    serial_number: "",
    is_consumable: false,
    status: "available",
    branch_id: "",
  });

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch(`http://localhost:8000/inventory/${inventoryId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setForm({
        ...data,
        branch_id: String(data.branch_id), // ensure string for input
      });
    };
    fetchInventory();
  }, [inventoryId]);

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:8000/inventory/${inventoryId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        branch_id: Number(form.branch_id),
      }),
    });

    if (res.ok) router.push("/inventory");
    else alert("Failed to update inventory");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Inventory Item</CardTitle>
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
          placeholder="Category"
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
          placeholder="Status"
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
        <Button onClick={handleSubmit}>Update</Button>
      </CardContent>
    </Card>
  );
}
