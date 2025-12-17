"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BranchesTable from "@/components/BranchesTable";

export default function BranchesPage() {
  const router = useRouter();

  const [branches, setBranches] = useState<any[]>([]);
  const [totalBranches, setTotalBranches] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

const loadBranches = async () => {
  try {
    const res = await fetch("http://localhost:8000/branches", {
      credentials: "include",
    });

    if (res.status === 401) return router.push("/login");

    const data = await res.json();

    // ✅ ENSURE ARRAY
    const branchList = Array.isArray(data) ? data : data.data ?? [];

    setBranches(branchList);
    setTotalBranches(branchList.length);
  } catch (err) {
    router.push("/login");
  }
};


  const deleteBranch = async (id: number) => {
    if (!confirm("Delete this branch?")) return;

    const res = await fetch(`http://localhost:8000/branches/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      loadBranches();
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadBranches();
      setLoading(false);
    };
    loadData();
  }, [router]);

  if (loading) return <p className="text-gray-400">Loading branches...</p>;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Branches</CardTitle>
        </CardHeader>
        <CardContent>
          <BranchesTable
            branches={branches}
            onView={(id) => router.push(`/branches/${id}`)}
            onEdit={(id) => router.push(`/branches/${id}/edit`)}
            onDelete={(id) => deleteBranch(id)}
            onAddBranch={() => router.push("/branches/create_new")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
