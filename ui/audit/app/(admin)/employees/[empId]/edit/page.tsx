"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function EditEmployeePage() {
  const router = useRouter();
  const { empId } = useParams(); // matches folder [empId]/edit

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    user_id: "",
  });

  const [loading, setLoading] = useState(true); // start with loading
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!empId) return;

    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/employees/${empId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch employee");
        const data = await res.json();
        setForm({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          position: data.position,
          user_id: data.user_id,
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [empId]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`http://localhost:8000/employees/${empId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Update failed");

      setSuccess("Employee updated successfully! Redirecting...");
      setTimeout(() => router.push("/admin/employees"), 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Edit Employee</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-12" disabled={loading}>
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
