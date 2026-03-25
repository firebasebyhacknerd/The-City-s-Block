import { redirect } from "next/navigation";

export default function LegacyListPropertyPage() {
  redirect("/dashboard/new-listing");
}
