"use client";

import { useState } from "react";
import { BulkActionToolbar } from "@/components/admin/BulkActionToolbar";
import { AdminUserActions } from "@/components/admin/AdminUserActions";
import { AdminUserRoleSelect } from "@/components/admin/AdminUserRoleSelect";
import { Checkbox } from "@/components/ui/checkbox";

interface AdminUsersClientProps {
  users: any[];
  currentUserId: number;
}

export function AdminUsersClient({ users, currentUserId }: AdminUsersClientProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Don't allow selecting yourself
  const selectableIds = users.filter((u) => u.id !== currentUserId).map((u) => u.id);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

  const toggleOne = (id: number) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelectedIds(allSelected ? [] : selectableIds);

  return (
    <>
      <BulkActionToolbar
        selectedIds={selectedIds}
        type="users"
        onSuccess={() => setSelectedIds([])}
      />

      {users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center text-gray-400">
          No users yet.
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center gap-2 px-1">
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleAll}
              id="select-all-users"
            />
            <label htmlFor="select-all-users" className="text-sm text-gray-500 cursor-pointer select-none">
              Select all ({selectableIds.length})
            </label>
          </div>

          <div className="space-y-3">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isSelected = selectedIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  className={`rounded-xl border bg-white p-4 shadow-sm transition ${
                    isSelected ? "border-blue-300 bg-blue-50/30" :
                    user.banned ? "border-red-200 opacity-60" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!isCurrentUser && (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(user.id)}
                        className="mt-1 shrink-0"
                      />
                    )}
                    {isCurrentUser && <span className="mt-1 h-4 w-4 shrink-0" />}

                    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-900">{user.name}</span>
                          {user.verified && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                              Verified
                            </span>
                          )}
                          {user.banned && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                              Banned
                            </span>
                          )}
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-600">
                            {user.role}
                          </span>
                        </div>
                        <div className="mt-0.5 text-sm text-gray-500">{user.email}</div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {user.city || "No city"} · Joined{" "}
                          {new Date(user.created_at).toLocaleDateString("en-IN")}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <AdminUserRoleSelect
                          id={user.id}
                          currentRole={user.role}
                          isCurrentUser={isCurrentUser}
                        />
                        <AdminUserActions
                          id={user.id}
                          verified={user.verified}
                          banned={user.banned}
                          isAdmin={user.role === "admin"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
