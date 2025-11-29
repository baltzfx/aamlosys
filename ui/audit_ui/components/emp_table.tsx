"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { IconPlus, IconEdit, IconTrash, IconLoader } from "@tabler/icons-react"

type Employee = {
  id: number
  user_id?: number
  eid?: string
  last_name: string
  first_name: string
  middle_name?: string | null
  date_of_birth?: string
  gender?: string
  email_personal?: string
  phone_work?: string
  phone_mobile?: string
  address?: string
  hire_date?: string
  termination_date?: string
  employment_status?: string
  job_title?: string
  position_level?: string
  grade?: string
  salary?: number
}

type User = {
  id: number
  username: string
  role?: string
}

export default function EmployeesTable() {
  const router = useRouter()

  // State
  const [employees, setEmployees] = React.useState<Employee[] | null>(null)
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(false)
  const [fetchError, setFetchError] = React.useState<string | null>(null)

  // Drawer & form
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Employee | null>(null)
  const [form, setForm] = React.useState<any>({
    user_id: "",
    eid: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    date_of_birth: "",
    gender: "",
    email_personal: "",
    phone_work: "",
    phone_mobile: "",
    address: "",
    hire_date: "",
    termination_date: "",
    employment_status: "",
    job_title: "",
    position_level: "",
    grade: "",
    salary: "",
  })

  const [deletingId, setDeletingId] = React.useState<number | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  // Fetch employees
  const fetchEmployees = React.useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch("http://localhost:8000/employees/", { credentials: "include" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEmployees(data)
    } catch (err: any) {
      console.error(err)
      setFetchError(err.message || "Failed to load employees")
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch users for admin
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/users", { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUsers()
  }, [])

  React.useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // Drawer handlers
  const openCreate = () => {
    setEditing(null)
    setForm({
      user_id: "",
      eid: "",
      last_name: "",
      first_name: "",
      middle_name: "",
      date_of_birth: "",
      gender: "",
      email_personal: "",
      phone_work: "",
      phone_mobile: "",
      address: "",
      hire_date: "",
      termination_date: "",
      employment_status: "",
      job_title: "",
      position_level: "",
      grade: "",
      salary: "",
    })
    setDrawerOpen(true)
  }

  const openEdit = (emp: Employee) => {
    setEditing(emp)
    setForm({ ...emp })
    setDrawerOpen(true)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((s: any) => ({ ...s, [e.target.name]: e.target.value }))
  }

  // Submit form
  const submitForm = async () => {
    try {
      const payload = { ...form }
      if (payload.user_id === "") payload.user_id = undefined

      const url = editing ? `http://localhost:8000/employees/${editing.id}` : "http://localhost:8000/employees/"
      const method = editing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error("API Error:", error);

        const msg = Array.isArray(error.detail)
          ? error.detail.map((e: any) => e.msg).join(", ")
          : error.detail || "Failed to save";

        throw new Error(msg);
      }


      const newEmployee: Employee = await res.json()
        setEmployees((prev) =>
          editing
            ? prev
                ? prev.map((e) => (e.id === newEmployee.id ? newEmployee : e))
                : [newEmployee] // fallback if prev is null
            : prev
            ? [newEmployee, ...prev]
            : [newEmployee]
        )

      toast.success(editing ? "Employee updated!" : "Employee created!")
      setDrawerOpen(false)
      setEditing(null)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Save failed")
    }
  }

  const confirmDelete = async (id: number) => {
    if (!confirm("Delete this employee?")) return
    setDeletingId(id)
    setDeleting(true)
    try {
      const res = await fetch(`http://localhost:8000/employees/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      toast.success("Employee deleted")
      
      setEmployees((prev): Employee[] => prev ? prev.filter((e) => e.id !== id) : [])
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || "Delete failed")
    } finally {
      setDeleting(false)
      setDeletingId(null)
    }
  }


  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 lg:px-6 mb-4">
        <h2 className="text-lg font-medium">Employees</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchEmployees}>Refresh</Button>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button onClick={openCreate} size="sm">
                <IconPlus className="mr-2" /> Add Employee
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{editing ? "Edit Employee" : "Add Employee"}</DrawerTitle>
                <DrawerDescription>Fill in all details. Admin can assign a user.</DrawerDescription>
              </DrawerHeader>
              <div className="max-h-[80vh] overflow-y-auto px-4 pb-6">
                <form onSubmit={(e) => { e.preventDefault(); submitForm() }} className="flex flex-col gap-4 p-4">
                  {/* Admin user selector */}
                  {users.length > 0 && (
                    <div>
                      <Label htmlFor="user_id">Assign To User</Label>
                      <select id="user_id" name="user_id" className="border rounded p-2 w-full" value={form.user_id} onChange={onChange}>
                        <option value="">Select User</option>
                        {users.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label htmlFor="eid">Employee ID</Label>
                      <Input id="eid" name="eid" value={form.eid ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Surname</Label>
                      <Input id="last_name" name="last_name" value={form.last_name ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="first_name">First name</Label>
                      <Input id="first_name" name="first_name" value={form.first_name ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="middle_name">Middle name</Label>
                      <Input id="middle_name" name="middle_name" value={form.middle_name ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input type="date" id="date_of_birth" name="date_of_birth" value={form.date_of_birth ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Input id="gender" name="gender" value={form.gender ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="email_personal">Email</Label>
                      <Input id="email_personal" name="email_personal" value={form.email_personal ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone_work">Work Phone</Label>
                      <Input id="phone_work" name="phone_work" value={form.phone_work ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone_mobile">Mobile Phone</Label>
                      <Input id="phone_mobile" name="phone_mobile" value={form.phone_mobile ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={form.address ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="hire_date">Hire Date</Label>
                      <Input type="date" id="hire_date" name="hire_date" value={form.hire_date ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="termination_date">Termination Date</Label>
                      <Input type="date" id="termination_date" name="termination_date" value={form.termination_date ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="employment_status">Employment Status</Label>
                      <Input id="employment_status" name="employment_status" value={form.employment_status ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="job_title">Job Title</Label>
                      <Input id="job_title" name="job_title" value={form.job_title ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="position_level">Position Level</Label>
                      <Input id="position_level" name="position_level" value={form.position_level ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="grade">Grade</Label>
                      <Input id="grade" name="grade" value={form.grade ?? ""} onChange={onChange} />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary</Label>
                      <Input type="number" id="salary" name="salary" value={form.salary ?? ""} onChange={onChange} />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button type="submit">{editing ? "Save changes" : "Create employee"}</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </div>
                </form>
              </div>

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
            <div className="mt-2 text-sm text-muted-foreground">Loading employees…</div>
          </div>
        ) : fetchError ? (
          <div className="p-6 text-center text-red-500">Error: {fetchError}</div>
        ) : employees?.length ? (
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead>EID</TableHead>
                <TableHead>Surname</TableHead>
                <TableHead>First name</TableHead>
                <TableHead>Employment Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.eid}</TableCell>
                  <TableCell>{emp.last_name}</TableCell>
                  <TableCell>{emp.first_name}</TableCell>
                  <TableCell>{emp.employment_status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(emp)}>
                        <IconEdit />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(emp.id)} disabled={deleting && deletingId === emp.id}>
                        <IconTrash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">No employees found.</div>
        )}
      </div>
    </div>
  )
}


