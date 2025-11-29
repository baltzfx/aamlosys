"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { IconPlus, IconEdit, IconTrash, IconLoader } from "@tabler/icons-react"

type Employee = {
  id: number
  eid: string
  last_name: string
  first_name: string
}

type User = {
  id: number
  username: string
  email: string
  role: string
  status: string
  employee_id?: number | null
  employee?: Employee | null
}

type UserForm = {
  username: string
  email: string
  password: string
  role: string
  status: string
  employee_id?: number | null
}

export default function UsersTable() {
  const [users, setUsers] = React.useState<User[]>([])
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<User | null>(null)
  const [form, setForm] = React.useState<UserForm>({
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
    employee_id: null,
  })

  // Fetch users
  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8000/users", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch employees
  const fetchEmployees = React.useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/employees", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch employees")
      const data = await res.json()
      setEmployees(data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  React.useEffect(() => {
    fetchUsers()
    fetchEmployees()
  }, [fetchUsers, fetchEmployees])

  function openCreate() {
    setEditing(null)
    setForm({
      username: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
      employee_id: null,
    })
    setDrawerOpen(true)
  }

  function openEdit(user: User) {
    setEditing(user)
    setForm({
      username: user.username,
      email: user.email,
      password: "", // leave empty for no change
      role: user.role,
      status: user.status,
      employee_id: user.employee_id ?? null,
    })
    setDrawerOpen(true)
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

  async function submitForm() {
    try {
      const payload: Partial<UserForm> = { ...form }
      if (editing && !form.password) payload.password = undefined

      const res = await fetch(
        `http://localhost:8000/users${editing ? `/${editing.id}` : ""}`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || "Failed to save")
      }

      const savedUser: User = await res.json()
      if (editing) {
        setUsers((prev) => prev.map((u) => (u.id === savedUser.id ? savedUser : u)))
        toast.success("User updated")
      } else {
        setUsers((prev) => [savedUser, ...prev])
        toast.success("User created")
      }
      setDrawerOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Save failed")
    }
  }

  async function deleteUser(id: number) {
    if (!confirm("Delete this user?")) return
    try {
      const res = await fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to delete")
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success("User deleted")
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Delete failed")
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Users</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers}>Refresh</Button>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button onClick={openCreate} size="sm"><IconPlus className="mr-2" /> Add User</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{editing ? "Edit User" : "Add User"}</DrawerTitle>
                <DrawerDescription>Fill in user details and optionally link to an employee</DrawerDescription>
              </DrawerHeader>
              <form onSubmit={(e) => { e.preventDefault(); submitForm() }} className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" value={form.username} onChange={onChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={form.email} onChange={onChange} />
                  </div>
                  <div>
                    <Label htmlFor="password">{editing ? "New Password (optional)" : "Password"}</Label>
                    <Input id="password" name="password" type="password" value={form.password} onChange={onChange} />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" value={form.role} onChange={onChange} />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" name="status" value={form.status} onChange={onChange} />
                  </div>
                  <div>
                    <Label htmlFor="employee_id">Link Employee</Label>
                    <Select
                      value={form.employee_id?.toString() || ""}
                      onValueChange={(val) => setForm((s) => ({ ...s, employee_id: val ? parseInt(val) : null }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {emp.eid} - {emp.first_name} {emp.last_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button type="submit">{editing ? "Save" : "Create"}</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </div>
              </form>
              <DrawerFooter />
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <Separator />

      <div className="overflow-auto rounded-lg border mt-4">
        {loading ? (
          <div className="p-6 text-center">
            <IconLoader className="mx-auto animate-spin" />
            <div className="mt-2 text-sm text-muted-foreground">Loading users…</div>
          </div>
        ) : fetchError ? (
          <div className="p-6 text-center text-red-500">Error: {fetchError}</div>
        ) : users.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Emp_ID</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.status}</TableCell>
                  <TableCell>{u.employee_id ? u.employee_id : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(u)}>
                        <IconEdit /><span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteUser(u.id)}>
                        <IconTrash /><span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">No users found.</div>
        )}
      </div>
    </div>
  )
}
