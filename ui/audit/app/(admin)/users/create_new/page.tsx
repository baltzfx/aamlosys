"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function CreateUserPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    status: "active",
    employee_id: null,
  });

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:8000/users/", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      console.error(await res.text());
      alert("Failed to create user");
      return;
    }

    router.push("/users");
  };

  return (
    <Card className="max-w-xl mx-auto mt-6">
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Username */}
        <div>
          <Label>Username</Label>
          <Input
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter username"
          />
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <Input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter email"
          />
        </div>

        {/* Password */}
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter password"
          />
        </div>

        {/* Role Dropdown */}
        <div>
          <Label>Role</Label>
          <Select
            onValueChange={(value) => setUser({ ...user, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="auditor">Auditor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </CardContent>
    </Card>
  );
}
