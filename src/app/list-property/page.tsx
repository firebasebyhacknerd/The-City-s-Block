import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function ListPropertyPage() {
  const session = await getSession();
  if (!session) redirect("/signup?role=owner");
  if (session.role === "buyer") redirect("/signup?role=owner");
  redirect("/dashboard/new-listing");
}
