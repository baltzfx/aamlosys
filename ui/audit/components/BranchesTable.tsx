"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Plus } from "lucide-react";

type Branch = {
  id: number;
  branch_code?: string;
  branch_name?: string;
  branch_address?: string;
  date_established?: string;
};

type BranchesTableProps = {
  branches: Branch[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddBranch: () => void;
};

const PAGE_SIZE = 5;

export default function BranchesTable({ branches, onView, onEdit, onDelete, onAddBranch }: BranchesTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return branches.filter((b) => {
      const code = b.branch_code ?? "";
      const name = b.branch_name ?? "";
      const address = b.branch_address ?? "";
      const date = b.date_established ?? "";
      const query = search.toLowerCase();
      return (
        code.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        address.toLowerCase().includes(query) ||
        date.toLowerCase().includes(query)
      );
    });
  }, [branches, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Input
          placeholder="Search by code, name, address..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <Button variant="default" onClick={onAddBranch} className="flex items-center gap-2">
          <Plus size={16} /> Add Branch
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Date Established</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length > 0 ? (
            paginated.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.branch_code}</TableCell>
                <TableCell>{b.branch_name}</TableCell>
                <TableCell>{b.branch_address}</TableCell>
                <TableCell>{b.date_established}</TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => onView(b.id)}>
                    <Eye size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(b.id)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(b.id)}>
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-400">
                No branches found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-2">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
