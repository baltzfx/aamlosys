"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateEmployeePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    user_id: "", // Optional, for admin
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:8000/employees/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Failed to create employee");

      setSuccess("Employee created successfully! Redirecting...");
      setTimeout(() => router.push("/employees"), 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Create Employee</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-600 text-green-700">
              <AlertTitle>{success}</AlertTitle>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                className="h-12"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                className="h-12"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                className="h-12"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                className="h-12"
                value={form.position}
                onChange={(e) => handleChange("position", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>User ID (Admin only)</Label>
              <Input
                className="h-12"
                value={form.user_id}
                onChange={(e) => handleChange("user_id", e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
              {loading ? "Creating..." : "Create Employee"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
