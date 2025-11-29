import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies(); // ← FIXED (await)
  const userId = cookieStore.get("user_id");

  if (userId?.value) {
    redirect("/dashboard");
  }

  redirect("/login");
}
