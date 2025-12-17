"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function ViewEmployeePage() {
  const router = useRouter();
  const { empId } = useParams(); // matches folder [empId]

  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [empId]);

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Employee Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>
            <strong>First Name:</strong> {employee.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {employee.last_name}
          </p>
          <p>
            <strong>Email:</strong> {employee.email}
          </p>
          <p>
            <strong>Position:</strong> {employee.position}
          </p>
          <p>
            <strong>User ID:</strong> {employee.user_id}
          </p>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
