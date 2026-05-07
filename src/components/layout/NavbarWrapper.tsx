import { getSession } from "@/lib/auth";
import { NavbarClient } from "./Navbar";

export default async function NavbarWrapper() {
  const session = await getSession();
  const sessionData = session ? { name: session.name, role: session.role } : null;
  return <NavbarClient session={sessionData} />;
}
