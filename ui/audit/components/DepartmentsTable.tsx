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

type Department = {
  id: number;
  code?: string;
  department?: string;
  group?: string;
  section?: string;
  unit?: string;
  remarks?: string;
};

type DepartmentsTableProps = {
  departments: Department[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
};

const PAGE_SIZE = 5;

export default function DepartmentsTable({
  departments,
  onView,
  onEdit,
  onDelete,
  onAdd,
}: DepartmentsTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // 🔒 Always work with an array
  const safeDepartments = Array.isArray(departments) ? departments : [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return safeDepartments.filter((d) => {
      const code = d.code ?? "";
      const dept = d.department ?? "";
      const group = d.group ?? "";
      const section = d.section ?? "";
      const unit = d.unit ?? "";

      return (
        code.toLowerCase().includes(q) ||
        dept.toLowerCase().includes(q) ||
        group.toLowerCase().includes(q) ||
        section.toLowerCase().includes(q) ||
        unit.toLowerCase().includes(q)
      );
    });
  }, [safeDepartments, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Input
          placeholder="Search department, group, section..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus size={16} /> Add Department
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginated.length > 0 ? (
            paginated.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.code}</TableCell>
                <TableCell>{d.department}</TableCell>
                <TableCell>{d.group}</TableCell>
                <TableCell>{d.section}</TableCell>
                <TableCell>{d.unit}</TableCell>

                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(d.id)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(d.id)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(d.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400">
                No departments found.
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
