"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Plus } from "lucide-react";

export type InventoryItem = {
  id: number;
  asset_tag?: string;
  name: string;
  category: string;
  serial_number?: string;
  is_consumable: boolean;
  status: string;
  branch_id: number;
  created_at?: string;
};

type InventoryTableProps = {
  inventory: InventoryItem[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
};

const PAGE_SIZE = 5;

export default function InventoryTable({
  inventory,
  onView,
  onEdit,
  onDelete,
  onAdd,
}: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const safeInventory = Array.isArray(inventory) ? inventory : [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return safeInventory.filter((i) => {
      const assetTag = i.asset_tag ?? "";
      const name = i.name ?? "";
      const category = i.category ?? "";
      const status = i.status ?? "";

      return (
        assetTag.toLowerCase().includes(q) ||
        name.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        status.toLowerCase().includes(q)
      );
    });
  }, [safeInventory, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Input
          placeholder="Search asset, name, category, status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus size={16} /> Add Inventory
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset Tag</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Branch ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginated.length > 0 ? (
            paginated.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.asset_tag ?? "-"}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>{i.category}</TableCell>
                <TableCell>{i.status}</TableCell>
                <TableCell>{i.branch_id}</TableCell>

                <TableCell className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onView(i.id)}>
                    <Eye size={16} />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(i.id)}>
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(i.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400">
                No inventory items found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="flex items-center text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
