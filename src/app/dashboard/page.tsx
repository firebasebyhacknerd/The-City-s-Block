import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getMyListingsAction, getMyInquiriesAction } from "@/app/actions/listings";
import { signOutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { PlusCircle, Home, MessageSquare, User, LogOut } from "lucide-react";

export const metadata = { title: "Dashboard | The City's Block" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "admin") redirect("/admin");

  const [listings, inquiries] = await Promise.all([
    getMyListingsAction(),
    getMyInquiriesAction(),
  ]);

  const active = listings.filter((l) => l.status === "active").length;
  const pending = listings.filter((l) => l.status === "pending").length;
  const newLeads = inquiries.filter((i) => i.status === "new").length;

  return (
    <main className="container-shell py-10 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Welcome, {session.name}</h1>
          <p className="mt-1 text-slate-500 capitalize">{session.role} account</p>
        </div>
        <form action={signOutAction}>
          <Button variant="outline" className="rounded-full gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { label: "Active listings", value: active },
          { label: "Pending approval", value: pending },
          { label: "Total listings", value: listings.length },
          { label: "New leads", value: newLeads },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">{stat.label}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2">
          <Link href="/dashboard/new-listing"><PlusCircle className="h-4 w-4" /> Post New Listing</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full gap-2">
          <Link href="/dashboard/listings"><Home className="h-4 w-4" /> My Listings</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full gap-2">
          <Link href="/dashboard/leads"><MessageSquare className="h-4 w-4" /> Leads ({inquiries.length})</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full gap-2">
          <Link href="/dashboard/profile"><User className="h-4 w-4" /> Profile</Link>
        </Button>
      </div>

      {/* Recent listings */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-950">Recent Listings</h2>
          <Button asChild size="sm" className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
            <Link href="/dashboard/new-listing">+ Post listing</Link>
          </Button>
        </div>
        {listings.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            No listings yet.{" "}
            <Link href="/dashboard/new-listing" className="text-slate-950 underline">
              Post your first property
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.slice(0, 5).map((listing) => (
              <div key={listing.id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-medium text-slate-950">{listing.title}</div>
                  <div className="text-sm text-slate-500">{listing.city} • {listing.property_type}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    listing.status === "active" ? "bg-green-100 text-green-700" :
                    listing.status === "pending" ? "bg-amber-100 text-amber-700" :
                    listing.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {listing.status}
                  </span>
                  <span className="font-medium text-slate-950">
                    ₹{Number(listing.price).toLocaleString("en-IN")}
                    {listing.price_unit === "month" ? "/mo" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
