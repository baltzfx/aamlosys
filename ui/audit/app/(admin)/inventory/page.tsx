"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InventoryTable from "@/components/InventoryTable";

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    try {
      const res = await fetch("http://localhost:8000/inventory", {
        credentials: "include",
      });
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInventory = async (id: number) => {
    if (!confirm("Delete this item?")) return;

    const res = await fetch(`http://localhost:8000/inventory/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) loadInventory();
  };

  useEffect(() => {
    setLoading(true);
    loadInventory().finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading inventory...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <InventoryTable
          inventory={inventory}
          onView={(id) => router.push(`/inventory/${id}`)}
          onEdit={(id) => router.push(`/inventory/${id}/edit`)}
          onDelete={deleteInventory}
          onAdd={() => router.push("/inventory/create_new")}
        />
      </CardContent>
    </Card>
  );
}
