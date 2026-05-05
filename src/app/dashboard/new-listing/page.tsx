import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { NewListingForm } from "@/components/dashboard/NewListingForm";

export const metadata = { title: "Post a Listing | The City's Block" };

export default async function NewListingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!["owner", "agent", "admin"].includes(session.role)) redirect("/dashboard");

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Post a New Listing</h1>
        <p className="mt-1 text-slate-500">Fill in the details below. Your listing will go live after admin approval.</p>
      </div>
      <NewListingForm />
    </main>
  );
}
