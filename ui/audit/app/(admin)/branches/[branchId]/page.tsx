"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ViewBranchPage() {
  const { branchId } = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<any>(null);

  useEffect(() => {
    const loadBranch = async () => {
      const res = await fetch(`http://localhost:8000/branches/${branchId}`, {
        credentials: "include",
      });

      if (res.status === 401) return router.push("/login");

      const data = await res.json();
      setBranch(data);
    };

    loadBranch();
  }, [branchId, router]);

  if (!branch) return <p className="text-gray-400">Loading branch...</p>;

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Branch Details</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p><b>Code:</b> {branch.branch_code}</p>
        <p><b>Name:</b> {branch.branch_name}</p>
        <p><b>Address:</b> {branch.branch_address}</p>
        <p><b>Date Established:</b> {branch.date_established}</p>

        <div className="flex gap-2 pt-4">
          <Button onClick={() => router.push(`/branches/${branchId}/edit`)}>
            Edit
          </Button>
          <Button variant="outline" onClick={() => router.push("/branches")}>
            Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
