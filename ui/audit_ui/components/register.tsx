"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  })

  const [successMessage, setSuccessMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  const handleChange = (e: any) => {
    const key = e.target.id || e.target.name // support both input + select
    setForm({ ...form, [key]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success("Account created successfully!")
        setForm({ username: "", email: "", password: "", role: "user" })
        setSuccessMessage("🎉 Account created successfully!")
        setShowMessage(true)

        // Hide message after 5 seconds
        setTimeout(() => setShowMessage(false), 5000)
      } else {
        const error = await res.json()
        toast.error(error.detail || "Registration failed")
        setShowMessage(false)
      }
    } catch (err) {
      console.error(err)
      toast.error("Network error. Please try again.")
      setShowMessage(false)
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          {successMessage && (
            <div
              className={cn(
                "text-green-600 text-center mt-2 transition-opacity duration-500",
                showMessage ? "opacity-100" : "opacity-0"
              )}
            >
              {successMessage}
            </div>
          )}
          <CardTitle className="text-xl">Create your account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Field>

              {/* Role */}
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>

                <Select
                  name="role"
                  value={form.role}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "role", value },
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
