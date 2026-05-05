"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeUserRoleAction } from "@/app/actions/admin";

const ROLE_OPTIONS = ["buyer", "owner", "agent", "admin"] as const;

export function AdminUserRoleSelect({
  id,
  currentRole,
  isCurrentUser,
}: {
  id: number;
  currentRole: string;
  isCurrentUser: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    startTransition(async () => {
      await changeUserRoleAction(id, newRole);
      router.refresh();
    });
  };

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={isCurrentUser || pending}
      title={isCurrentUser ? "Cannot change your own role" : "Change user role"}
      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer capitalize"
    >
      {ROLE_OPTIONS.map((role) => (
        <option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </option>
      ))}
    </select>
  );
}
