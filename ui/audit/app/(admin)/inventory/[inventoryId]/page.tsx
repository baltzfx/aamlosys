"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function InventoryDetailPage() {
  const { inventoryId } = useParams();
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      const res = await fetch(`http://localhost:8000/inventory/${inventoryId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setForm({
        ...data,
        branch_id: String(data.branch_id),
      });
    };
    fetchInventory();
  }, [inventoryId]);

  if (!form) return <p className="text-gray-400">Loading inventory...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={form.asset_tag} readOnly placeholder="Asset Tag" />
        <Input value={form.name} readOnly placeholder="Name" />
        <Input value={form.category} readOnly placeholder="Category" />
        <Input value={form.serial_number} readOnly placeholder="Serial Number" />
        <Input value={form.branch_id} readOnly placeholder="Branch ID" />
        <Input value={form.status} readOnly placeholder="Status" />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_consumable} readOnly />
          <label>Is Consumable?</label>
        </div>
      </CardContent>
    </Card>
  );
}
