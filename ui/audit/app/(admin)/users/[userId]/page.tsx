"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewUserPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/users/${userId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  // ---------------------------------------
  // LOADING SKELETON
  // ---------------------------------------
  if (loading) {
    return (
      <Card className="max-w-xl mx-auto mt-6 p-6 space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-end gap-3 pt-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <p className="text-center text-red-500 mt-10">
        User not found or failed to load.
      </p>
    );
  }

  // ---------------------------------------
  // MAIN UI
  // ---------------------------------------
  return (
    <Card className="max-w-xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">User Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Username */}
        <div>
          <p className="text-sm text-muted-foreground">Username</p>
          <p className="font-medium">{user.username}</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        {/* Role */}
        <div>
          <p className="text-sm text-muted-foreground">Role</p>
          <Badge variant="secondary" className="capitalize px-3 py-1">
            {user.role}
          </Badge>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge
            className={`px-3 py-1 ${
              user.status === "active"
                ? "bg-green-600 text-white"
                : "bg-yellow-600 text-white"
            }`}
          >
            {user.status}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => router.push("/users")}>
            Back
          </Button>

          <Button onClick={() => router.push(`/users/${userId}/edit`)}>
            Edit User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
