"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Plus } from "lucide-react";

type User = {
  id: number;
  username: string;
  email: string;
  status: string;
  role: string;
};

type UsersTableProps = {
  users: User[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddUser: () => void;
};

const PAGE_SIZE = 5;

export default function UsersTable({ users, onView, onEdit, onDelete, onAddUser }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Input
          placeholder="Search by username or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page
          }}
          className="max-w-sm"
        />
        <Button variant="default" onClick={onAddUser} className="flex items-center gap-2">
          + Add User
        </Button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className={user.status === "active" ? "text-green-600" : "text-yellow-600"}>
                  {user.status}
                </TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => onView(user.id)} disabled={!user.id}><Eye size={16} /></Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(user.id)} disabled={!user.id}><Pencil size={16} /></Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)} disabled={!user.id}><Trash size={16} /></Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-400">
                No users found.
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
