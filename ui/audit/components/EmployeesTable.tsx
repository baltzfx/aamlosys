"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Plus } from "lucide-react";

type Employee = {
  id: number;
  eid?: string;
  first_name?: string;
  last_name?: string;
  email_personal?: string;
  job_title?: string;
  position_level?: string;
  employment_status?: string;
};

type EmployeesTableProps = {
  employees: Employee[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddEmployee: () => void;
};

const PAGE_SIZE = 5;

export default function EmployeesTable({
  employees,
  onView,
  onEdit,
  onDelete,
  onAddEmployee,
}: EmployeesTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Safe filtering with defaults
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const eid = e.eid ?? "";
      const name = `${e.first_name ?? ""} ${e.last_name ?? ""}`;
      const email = e.email_personal ?? "";
      const job = e.job_title ?? "";
      const position = e.position_level ?? "";
      const status = e.employment_status ?? "";

      const query = search.toLowerCase();
      return (
        eid.toLowerCase().includes(query) ||
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        job.toLowerCase().includes(query) ||
        position.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query)
      );
    });
  }, [employees, search]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const paginatedEmployees = filteredEmployees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Input
          placeholder="Search by EID, name, email, job..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <Button variant="default" onClick={onAddEmployee} className="flex items-center gap-2">
          <Plus size={16} /> Add Employee
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>EID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell>{emp.eid}</TableCell>
                <TableCell>{`${emp.first_name ?? ""} ${emp.last_name ?? ""}`}</TableCell>
                <TableCell>{emp.email_personal}</TableCell>
                <TableCell>{emp.job_title}</TableCell>
                <TableCell>{emp.position_level}</TableCell>
                <TableCell
                  className={
                    emp.employment_status === "active" ? "text-green-600" : "text-yellow-600"
                  }
                >
                  {emp.employment_status}
                </TableCell>

                <TableCell className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => onView(emp.id)}>
                    <Eye size={16} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(emp.id)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(emp.id)}>
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-400">
                No employees found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
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
