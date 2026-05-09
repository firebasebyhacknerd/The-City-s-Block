# Design Document: User Panels

## Overview

This document describes the technical design for the user-panels feature on The City's Blocks real estate platform. The feature delivers three distinct authenticated panel experiences ??? Admin Panel, Broker Panel, and Customer Panel ??? all sharing the same JWT session system, PostgreSQL database, and Next.js App Router infrastructure.

The work falls into six areas:
1. **PanelShell upgrade** ??? extend the existing `PanelShell` component to accept a `role` prop and render role-appropriate navigation and titles.
2. **AdminShell mobile drawer** ??? add a responsive hamburger + overlay drawer to the existing desktop-only `AdminShell`.
3. **Admin Projects page** ??? connect the existing `/admin/projects` stub to a real `projects` DB table with full CRUD.
4. **Notification system** ??? new `notifications` table, server actions for insertion and retrieval, and bell UI components for both Admin and Broker panels.
5. **Admin bulk operations** ??? client-side selection state + new bulk server actions for listings and users.
6. **Broker and Customer panel pages** ??? new and upgraded RSC pages for pipeline, analytics, inquiry history, favorites, and saved searches.

All new pages follow the established pattern: async RSC page components call server actions directly; client interactions use `useTransition`; role guards use `getSession()` at the top of every page and action.


## Architecture

### System Layers

```
Browser
  └── Next.js App Router (RSC + Client Components)
        ├── Layout shells: AdminShell, PanelShell
        ├── Page components (RSC) — fetch data via server actions
        └── Client components — useTransition for mutations

Server Actions (src/app/actions/*.ts)
  ├── auth.ts          — signUp, signIn, signOut, updateProfile, changePassword
  ├── listings.ts      — CRUD, inquiries, favorites (existing + extended)
  ├── admin.ts         — admin operations (existing + bulk + projects)
  ├── notifications.ts — NEW: insert, fetch, mark-read
  └── saved-searches.ts — NEW: save, list, delete

Database (PostgreSQL via Neon)
  ├── users            — existing
  ├── listings         — existing
  ├── inquiries        — existing
  ├── favorites        — existing
  ├── projects         — NEW
  ├── notifications    — NEW
  └── saved_searches   — NEW
```

### Routing Structure

```
/admin                          → AdminPage (RSC, role=admin)
/admin/listings                 → AdminListingsPage (RSC)
/admin/users                    → AdminUsersPage (RSC)
/admin/inquiries                → AdminInquiriesPage (RSC)
/admin/localities               → AdminLocalitiesPage (RSC)
/admin/projects                 → AdminProjectsPage (RSC) — NEW (was stub)
/admin/mock-listings            → existing

/dashboard                      → DashboardPage (RSC)
                                  • role=admin   → redirect /admin
                                  • role=agent|owner → BrokerDashboard
                                  • role=buyer   → CustomerDashboard

/dashboard/listings             → BrokerListingsPage (RSC, agent|owner only)
/dashboard/new-listing          → NewListingPage (RSC, agent|owner only)
/dashboard/listings/[id]/edit   → EditListingPage (RSC, agent|owner only)
/dashboard/pipeline             → PipelinePage (RSC, agent|owner only) — NEW
/dashboard/leads                → LeadsPage (RSC, agent|owner only)
/dashboard/profile              → ProfilePage (RSC, all roles)

/dashboard/inquiries            → BuyerInquiriesPage (RSC, buyer only) — NEW
/dashboard/favorites            → FavoritesPage (RSC, buyer only) — NEW
/dashboard/saved-searches       → SavedSearchesPage (RSC, buyer only) — UPGRADED
```

### Role-Based Rendering Decision Tree

```
getSession() → null              → redirect("/login")
getSession() → role="admin"      → redirect("/admin")  [from /dashboard]
getSession() → role="agent"|"owner" → render BrokerPanel content
getSession() → role="buyer"      → render CustomerPanel content
```

The `/dashboard` page component handles all three non-admin cases in a single file using conditional rendering based on `session.role`. This avoids duplicating the route and keeps the redirect logic in one place.


## Components and Interfaces

### 1. PanelShell (upgraded)

**File:** `src/components/portal/PanelShell.tsx`

The existing `PanelShell` accepts a static `items` array and `title`/`description` strings. The upgrade adds a `role` prop so the shell can derive its own nav items and labels, while still accepting explicit overrides for backward compatibility.

```typescript
// Role-specific nav configurations
const BROKER_NAV = (role: "agent" | "owner") => [
  { label: "Overview",       href: "/dashboard",              icon: LayoutDashboard },
  { label: "Listings",       href: "/dashboard/listings",     icon: Home },
  { label: "Pipeline",       href: "/dashboard/pipeline",     icon: Kanban },
  { label: role === "agent" ? "Client Inquiries" : "Buyer Inquiries",
                             href: "/dashboard/leads",        icon: MessageSquare },
  { label: "Saved Searches", href: "/dashboard/saved-searches", icon: Search },
  { label: "Profile",        href: "/dashboard/profile",      icon: User },
];

const BUYER_NAV = [
  { label: "Overview",       href: "/dashboard",              icon: LayoutDashboard },
  { label: "Saved Listings", href: "/dashboard/favorites",    icon: Heart },
  { label: "Inquiries",      href: "/dashboard/inquiries",    icon: MessageSquare },
  { label: "Saved Searches", href: "/dashboard/saved-searches", icon: Search },
  { label: "Profile",        href: "/dashboard/profile",      icon: User },
];

interface PanelShellProps {
  role: "buyer" | "agent" | "owner";
  currentPath: string;
  children: React.ReactNode;
  // Optional overrides (for backward compat with existing pages)
  title?: string;
  description?: string;
}
```

The shell renders the sidebar nav derived from `role`, highlights the active item by comparing `currentPath` to each `href`, and wraps `children` in the two-column grid layout. The `title` defaults to `"Agent Dashboard"`, `"Owner Dashboard"`, or `"My Dashboard"` based on role.

The existing `items`/`activeHref` props are deprecated in favour of `role`/`currentPath` but kept for the transition period.

---

### 2. AdminShell (mobile drawer added)

**File:** `src/components/admin/AdminShell.tsx`

The existing component is a pure server component. Adding the mobile drawer requires a small client wrapper because drawer open/close state is interactive.

**Design decision:** Extract the drawer toggle into a thin `AdminMobileNav` client component. `AdminShell` itself stays a server component and renders `AdminMobileNav` alongside the existing desktop sidebar.

```typescript
// NEW: src/components/admin/AdminMobileNav.tsx  ("use client")
interface AdminMobileNavProps {
  navItems: NavItem[];
  currentPath: string;
}
// Renders: hamburger button (lg:hidden) + Sheet/Drawer overlay
// Uses Radix UI Sheet (already available via shadcn) for the drawer
// Closes on nav link click and backdrop click
// Adds overflow-hidden to document.body while open via useEffect
```

```typescript
// AdminShell.tsx changes:
// 1. Import AdminMobileNav
// 2. Add AdminMobileNav to the top bar (left of title) on mobile
// 3. Desktop sidebar unchanged
```

The `Sheet` component from `@radix-ui/react-dialog` (already in the project as shadcn's Sheet) provides the overlay drawer with built-in focus trap and scroll lock. No new dependencies needed.

---

### 3. NotificationBell (client component)

**File:** `src/components/shared/NotificationBell.tsx` — NEW

```typescript
"use client";

interface NotificationBellProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

// Renders:
// - Bell icon button with unread count badge
// - Radix Popover dropdown listing up to 20 notifications
// - Each item: message text, relative time, read/unread indicator
// - "Mark all as read" button at top of dropdown
// - Empty state when no notifications
// - On item click: calls markNotificationReadAction(id), then navigates to reference URL
```

The component receives initial data as props (fetched server-side by the parent RSC page) and uses `useTransition` for mark-read mutations. After marking read, it updates local state optimistically so the badge count drops immediately without a page reload.

---

### 4. BulkActionToolbar (client component)

**File:** `src/components/admin/BulkActionToolbar.tsx` — NEW

```typescript
"use client";

interface BulkActionToolbarProps {
  selectedIds: number[];
  type: "listings" | "users";
  onSuccess: () => void;
}

// Renders when selectedIds.length > 0:
// - Count badge: "X selected"
// - For listings: Approve, Reject (with reason input), Delete buttons
// - For users: Verify, Ban buttons
// - Destructive actions (Delete, Ban) show AlertDialog confirmation first
// - Uses useTransition for all bulk server action calls
```

---

### 5. PipelineBoard (client component)

**File:** `src/components/dashboard/PipelineBoard.tsx` — NEW

```typescript
"use client";

interface PipelineBoardProps {
  initialInquiries: Inquiry[];
}

// Three-column Kanban layout
// Each column: "New" | "Contacted" | "Closed"
// Inquiry cards show: buyer name, phone, email, listing title, date
// Status change via existing updateInquiryStatusAction
// Optimistic UI: move card to new column immediately, revert on error
// useTransition for status updates
```

---

### 6. SavedSearchItem (client component)

**File:** `src/components/dashboard/SavedSearchItem.tsx` — NEW

```typescript
"use client";

interface SavedSearchItemProps {
  search: SavedSearch;
  onDelete: (id: number) => void;
}

// Renders: label, filter summary chips, date saved, delete button
// Delete calls deleteSavedSearchAction via useTransition
// Parent page uses optimistic removal from list
```

---

### 7. FavoriteCard (client component)

**File:** `src/components/dashboard/FavoriteCard.tsx` — NEW

```typescript
"use client";

interface FavoriteCardProps {
  listing: Listing;
  onRemove: (listingId: number) => void;
}

// Renders: listing title, city, price, property type, remove button
// Remove calls toggleFavoriteAction via useTransition
// Parent page uses optimistic removal from list
```


## Data Models

### New Table: `projects`

```sql
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  developer   TEXT,
  city        TEXT NOT NULL,
  locality    TEXT,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'draft',  -- draft | published
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

The public `/projects` page queries `WHERE status = 'published'`. The admin projects page queries all records.

---

### New Table: `notifications`

```sql
CREATE TABLE IF NOT EXISTS notifications (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type           TEXT NOT NULL,  -- listing_pending | user_registered | inquiry_received
  message        TEXT NOT NULL,
  reference_id   INTEGER,        -- listing_id, user_id, or inquiry_id
  reference_type TEXT,           -- 'listing' | 'user' | 'inquiry'
  read           BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;
```

**Reference URL derivation** (done client-side in `NotificationBell`):
- `reference_type = 'listing'` → `/admin/listings` (admin) or `/dashboard/listings` (broker)
- `reference_type = 'user'` → `/admin/users`
- `reference_type = 'inquiry'` → `/dashboard/leads` (broker) or `/dashboard/pipeline`

---

### New Table: `saved_searches`

```sql
CREATE TABLE IF NOT EXISTS saved_searches (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label      TEXT NOT NULL DEFAULT '',
  filters    JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
```

The `filters` JSONB column stores the search parameters as a plain object, e.g.:
```json
{ "city": "Mumbai", "listing_type": "sale", "asset_class": "residential", "bhk": "3" }
```

The `label` is either user-provided or auto-generated from the filter values (e.g. `"3 BHK Sale in Mumbai"`).

---

### TypeScript Types

```typescript
// src/types/index.ts (new file)

export type NotificationType = "listing_pending" | "user_registered" | "inquiry_received";
export type ReferenceType = "listing" | "user" | "inquiry";

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  message: string;
  reference_id: number | null;
  reference_type: ReferenceType | null;
  read: boolean;
  created_at: string;
}

export interface SavedSearch {
  id: number;
  user_id: number;
  label: string;
  filters: Record<string, string>;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  developer: string | null;
  city: string;
  locality: string | null;
  description: string | null;
  status: "draft" | "published";
  image_url: string | null;
  created_at: string;
  updated_at: string;
}
```


## Server Actions

### `src/app/actions/notifications.ts` — NEW

```typescript
// Insert helpers (called internally by other actions, not exposed as public actions)
export async function insertAdminNotification(
  type: NotificationType,
  message: string,
  referenceId: number | null,
  referenceType: ReferenceType | null
): Promise<void>
// Queries all users with role='admin', inserts one notification row per admin

export async function insertUserNotification(
  userId: number,
  type: NotificationType,
  message: string,
  referenceId: number | null,
  referenceType: ReferenceType | null
): Promise<void>
// Inserts a single notification for a specific user

// Public server actions (called from client components)
export async function getMyNotificationsAction(): Promise<Notification[]>
// Returns 20 most recent notifications for session user, ordered by created_at DESC

export async function getUnreadCountAction(): Promise<number>
// Returns count of unread notifications for session user

export async function markNotificationReadAction(id: number): Promise<{ ok: boolean }>
// Sets read=TRUE for the given notification, only if it belongs to session user

export async function markAllNotificationsReadAction(): Promise<{ ok: boolean }>
// Sets read=TRUE for all notifications belonging to session user
```

---

### `src/app/actions/listings.ts` — MODIFIED

**`createListingAction`** — after successful insert, call `insertAdminNotification`:
```typescript
// After INSERT INTO listings ...
const listing = rows[0]; // get the new listing id
await insertAdminNotification(
  "listing_pending",
  `New listing pending approval: "${formData.title}" in ${formData.city}`,
  listing.id,
  "listing"
);
```

**`submitInquiryAction`** — after successful insert, call `insertUserNotification` for the listing owner:
```typescript
// After INSERT INTO inquiries ...
const listingRow = await sql`SELECT user_id, title FROM listings WHERE id = ${formData.listing_id}`;
if (listingRow[0]) {
  await insertUserNotification(
    listingRow[0].user_id,
    "inquiry_received",
    `New inquiry on your listing: "${listingRow[0].title}"`,
    inquiry.id,
    "inquiry"
  );
}
```

**New: `getBrokerStatsAction`**:
```typescript
export async function getBrokerStatsAction(): Promise<{
  activeListings: number;
  pendingListings: number;
  totalInquiries: number;
  newInquiriesLast30Days: number;
  listingsWithInquiryCounts: Array<{ id: number; title: string; inquiry_count: number; status: string }>;
}>
// Queries listings and inquiries filtered by session.id
```

**New: `getBuyerInquiriesAction`**:
```typescript
export async function getBuyerInquiriesAction(): Promise<Array<{
  id: number;
  listing_title: string;
  message: string;
  status: string;
  created_at: string;
}>>
// Queries inquiries WHERE buyer_email = session.email, JOINs listings for title
// Ordered by created_at DESC
```

**New: `getCustomerStatsAction`**:
```typescript
export async function getCustomerStatsAction(): Promise<{
  savedListings: number;
  inquiries: number;
  savedSearches: number;
}>
```

---

### `src/app/actions/auth.ts` — MODIFIED

**`signUpAction`** — after successful user creation, call `insertAdminNotification`:
```typescript
await insertAdminNotification(
  "user_registered",
  `New user registered: ${formData.name} (${formData.email}) as ${role}`,
  user.id,
  "user"
);
```

---

### `src/app/actions/saved-searches.ts` — NEW

```typescript
export async function saveSearchAction(filters: Record<string, string>, label?: string): Promise<{ ok: boolean; message: string }>
// Requires session; inserts into saved_searches
// Auto-generates label from filters if not provided

export async function getMySavedSearchesAction(): Promise<SavedSearch[]>
// Returns all saved searches for session user, ordered by created_at DESC

export async function deleteSavedSearchAction(id: number): Promise<{ ok: boolean }>
// Deletes saved search only if it belongs to session user
```

---

### `src/app/actions/admin.ts` — MODIFIED

**New bulk listing actions:**
```typescript
export async function bulkApproveListingsAction(ids: number[]): Promise<{ ok: boolean; count: number }>
export async function bulkRejectListingsAction(ids: number[], reason: string): Promise<{ ok: boolean; count: number }>
export async function bulkDeleteListingsAction(ids: number[]): Promise<{ ok: boolean; count: number }>
```

**New bulk user actions:**
```typescript
export async function bulkVerifyUsersAction(ids: number[]): Promise<{ ok: boolean; count: number }>
export async function bulkBanUsersAction(ids: number[]): Promise<{ ok: boolean; count: number }>
```

**New project actions:**
```typescript
export async function getProjectsAction(): Promise<Project[]>
// Returns all projects ordered by created_at DESC

export async function getPublicProjectsAction(): Promise<Project[]>
// Returns projects WHERE status = 'published', ordered by created_at DESC

export async function createProjectAction(data: {
  name: string;
  developer?: string;
  city: string;
  locality?: string;
  description?: string;
  status: "draft" | "published";
  image_url?: string;
}): Promise<{ ok: boolean; message: string }>

export async function updateProjectAction(id: number, data: Partial<Project>): Promise<{ ok: boolean; message: string }>

export async function deleteProjectAction(id: number): Promise<{ ok: boolean }>
```

**New pipeline action:**
```typescript
export async function getPipelineAction(): Promise<{
  new: Inquiry[];
  contacted: Inquiry[];
  closed: Inquiry[];
}>
// Queries inquiries for session user's listings, groups by status
```


## Data Flow

### Notification Insertion Flow

```
User Action                    Server Action              DB Write
─────────────────────────────────────────────────────────────────
Broker submits listing    →  createListingAction       →  INSERT listings
                          →  insertAdminNotification   →  INSERT notifications (one per admin)

New user registers        →  signUpAction              →  INSERT users
                          →  insertAdminNotification   →  INSERT notifications (one per admin)

Buyer submits inquiry     →  submitInquiryAction       →  INSERT inquiries
                          →  insertUserNotification    →  INSERT notifications (for listing owner)
```

The notification insert helpers are called synchronously within the same server action, after the primary DB write succeeds. They do not use transactions — if the notification insert fails, the primary operation is not rolled back. This is acceptable for in-app notifications (non-critical path).

### Notification Read Flow

```
Page Load (RSC)
  └── getMyNotificationsAction()  →  SELECT notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
  └── getUnreadCountAction()      →  SELECT COUNT(*) WHERE user_id = ? AND read = FALSE
  └── Pass as props to NotificationBell (client component)

User clicks notification item
  └── markNotificationReadAction(id)  →  UPDATE notifications SET read=TRUE WHERE id=? AND user_id=?
  └── Optimistic: decrement local unread count, mark item as read in local state
  └── Navigate to reference URL

User clicks "Mark all as read"
  └── markAllNotificationsReadAction()  →  UPDATE notifications SET read=TRUE WHERE user_id=?
  └── Optimistic: set all items to read, set badge count to 0
```

### Saved Search Flow

```
Search page (/search)
  └── User applies filters → URL params update
  └── "Save this search" button visible when session exists AND filters non-empty
  └── Click → saveSearchAction({ city, listing_type, ... }, autoLabel)
           → INSERT saved_searches
           → Toast confirmation

Saved Searches page (/dashboard/saved-searches)
  └── getMySavedSearchesAction() → SELECT saved_searches WHERE user_id = ?
  └── Each item shows filter chips + "Search again" link (reconstructs /search?city=...&...)
  └── Delete → deleteSavedSearchAction(id) → DELETE WHERE id=? AND user_id=?
            → Optimistic removal from list
```

### Bulk Operation Flow

```
Admin Listings Page
  └── Client component manages selectedIds: number[] in useState
  └── Checkbox per row → toggle id in selectedIds
  └── Select-all → set selectedIds to all visible listing ids
  └── BulkActionToolbar renders when selectedIds.length > 0
  └── Approve → bulkApproveListingsAction(selectedIds) → UPDATE listings SET status='active'...
  └── Reject → AlertDialog for reason → bulkRejectListingsAction(selectedIds, reason)
  └── Delete → AlertDialog confirm → bulkDeleteListingsAction(selectedIds)
  └── On success: clear selectedIds, revalidatePath triggers RSC re-render
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**PBT applicability assessment:** This feature includes server actions that perform data transformations, filtering, sorting, and access-control logic — all pure enough to test with generated inputs. The UI rendering and routing rules are better covered by example-based tests. The properties below focus on the server-side logic layer where PBT adds the most value.

**Property reflection:** After reviewing all prework items, several properties were consolidated:
- Notification ordering (4.2 and 4.7) are the same invariant — merged into one property.
- Bulk operations (5.4, 5.5, 5.6, 5.9, 5.10) share the same "all selected IDs are updated" pattern — expressed as two consolidated properties (listings bulk, users bulk).
- Data isolation properties (6.2, 10.3, 12.4) are each distinct enough to keep separate.
- PanelShell nav properties (14.4, 14.5, 14.6) are subsumed by one role-nav property.

---

### Property 1: Projects are always returned newest-first

*For any* set of project records with varying `created_at` timestamps, `getProjectsAction` and `getPublicProjectsAction` SHALL return them ordered strictly by `created_at` descending — no two adjacent results shall be out of order.

**Validates: Requirements 3.2**

---

### Property 2: Project creation round-trip

*For any* valid project data (with required fields `name` and `city` present), calling `createProjectAction` SHALL result in a record retrievable by `getProjectsAction` whose fields match the submitted data exactly.

**Validates: Requirements 3.4**

---

### Property 3: Invalid project data is rejected without DB write

*For any* project creation payload where `name` or `city` is absent or empty, `createProjectAction` SHALL return `{ ok: false }` and no new record SHALL appear in the `projects` table.

**Validates: Requirements 3.5**

---

### Property 4: Project update round-trip

*For any* existing project and any valid update payload, calling `updateProjectAction` SHALL result in the stored record reflecting the new field values when subsequently retrieved.

**Validates: Requirements 3.7**

---

### Property 5: Project delete removes the record

*For any* existing project, calling `deleteProjectAction` SHALL result in that project no longer being returned by `getProjectsAction`.

**Validates: Requirements 3.8**

---

### Property 6: Published projects are visible publicly; drafts are not

*For any* set of projects with mixed `status` values, `getPublicProjectsAction` SHALL return only records where `status = 'published'` — no draft project SHALL appear in the result.

**Validates: Requirements 3.9**

---

### Property 7: Notifications are returned newest-first and capped at 20

*For any* user with N notifications (N ≥ 0), `getMyNotificationsAction` SHALL return at most 20 records, and the returned list SHALL be sorted by `created_at` descending — for every adjacent pair (a, b) in the result, `a.created_at >= b.created_at`.

**Validates: Requirements 4.2, 4.7**

---

### Property 8: Listing submission triggers admin notifications

*For any* valid listing submission by a broker, after `createListingAction` completes, the `notifications` table SHALL contain exactly one record with `type = 'listing_pending'` and `reference_id = listing.id` for each user with `role = 'admin'` in the system.

**Validates: Requirements 4.3**

---

### Property 9: User registration triggers admin notifications

*For any* successful user registration via `signUpAction`, the `notifications` table SHALL contain exactly one record with `type = 'user_registered'` and `reference_id = user.id` for each user with `role = 'admin'` in the system.

**Validates: Requirements 4.4**

---

### Property 10: Inquiry submission triggers broker notification

*For any* inquiry submitted on a listing owned by broker B, after `submitInquiryAction` completes, the `notifications` table SHALL contain exactly one record with `type = 'inquiry_received'`, `user_id = B.id`, and `reference_id = inquiry.id`.

**Validates: Requirements 4.5**

---

### Property 11: Mark-read is idempotent

*For any* notification that is already `read = TRUE`, calling `markNotificationReadAction` again SHALL leave the record unchanged and return `{ ok: true }` — the operation has no additional effect when repeated.

**Validates: Requirements 4.8**

---

### Property 12: Mark-all-read sets all user notifications to read

*For any* user with any number of unread notifications, after `markAllNotificationsReadAction` completes, every notification belonging to that user SHALL have `read = TRUE`, and `getUnreadCountAction` SHALL return 0.

**Validates: Requirements 4.9, 4.10**

---

### Property 13: Bulk listing operations apply to all selected IDs

*For any* non-empty set of listing IDs S:
- `bulkApproveListingsAction(S)` SHALL set `status = 'active'` and `verified = TRUE` for every id in S.
- `bulkRejectListingsAction(S, reason)` SHALL set `status = 'rejected'` and `rejection_reason = reason` for every id in S.
- `bulkDeleteListingsAction(S)` SHALL result in no listing with an id in S being retrievable from the DB.

**Validates: Requirements 5.4, 5.5, 5.6**

---

### Property 14: Bulk user operations apply to all selected IDs

*For any* non-empty set of user IDs S:
- `bulkVerifyUsersAction(S)` SHALL set `verified = TRUE` for every id in S.
- `bulkBanUsersAction(S)` SHALL set `banned = TRUE` for every id in S.

**Validates: Requirements 5.9, 5.10**

---

### Property 15: Broker stats reflect only the authenticated broker's data

*For any* two brokers A and B with distinct listings and inquiries, `getBrokerStatsAction` called in broker A's session SHALL return counts that match broker A's data exactly and SHALL NOT include any data belonging to broker B.

**Validates: Requirements 6.1, 6.2**

---

### Property 16: Per-listing inquiry counts are accurate

*For any* broker with any set of listings, each listing's `inquiry_count` returned by `getBrokerStatsAction` SHALL equal the actual number of inquiry records in the DB with that `listing_id`.

**Validates: Requirements 6.3**

---

### Property 17: Pipeline grouping is exhaustive and correct

*For any* set of inquiries belonging to a broker, `getPipelineAction` SHALL return every inquiry in exactly one column, and each inquiry SHALL appear in the column whose name matches its `status` field.

**Validates: Requirements 7.2**

---

### Property 18: Buyer inquiry history is isolated by email

*For any* two buyers with different email addresses, `getBuyerInquiriesAction` called in buyer A's session SHALL return only inquiries where `buyer_email = A.email` and SHALL NOT return any inquiry submitted by buyer B.

**Validates: Requirements 10.2, 10.3**

---

### Property 19: Buyer inquiry records contain all required fields

*For any* inquiry submitted by a buyer, the record returned by `getBuyerInquiriesAction` SHALL include non-null values for `listing_title`, `message`, `created_at`, and `status`.

**Validates: Requirements 10.4**

---

### Property 20: Saved search creation round-trip

*For any* authenticated buyer and any non-empty filter object, calling `saveSearchAction` SHALL result in a record retrievable by `getMySavedSearchesAction` whose `filters` field equals the submitted filter object.

**Validates: Requirements 12.3**

---

### Property 21: Saved searches are isolated per user

*For any* two buyers A and B, `getMySavedSearchesAction` called in buyer A's session SHALL return only records where `user_id = A.id` and SHALL NOT return any saved search belonging to buyer B.

**Validates: Requirements 12.4**

---

### Property 22: Saved search delete removes the record

*For any* saved search belonging to the authenticated user, calling `deleteSavedSearchAction` SHALL result in that record no longer being returned by `getMySavedSearchesAction`.

**Validates: Requirements 12.6**

---

### Property 23: Unauthenticated saved search action is rejected

*For any* call to `saveSearchAction`, `getMySavedSearchesAction`, or `deleteSavedSearchAction` without a valid session, the action SHALL return `{ ok: false }` and SHALL NOT modify the `saved_searches` table.

**Validates: Requirements 12.8**

---

### Property 24: PanelShell renders role-correct navigation

*For any* valid role value (`"buyer"`, `"agent"`, `"owner"`), rendering `PanelShell` with that role SHALL produce a nav that contains exactly the items specified for that role in the nav configuration, and SHALL NOT contain items from another role's configuration.

**Validates: Requirements 14.4, 14.5, 14.6**


## Error Handling

### Server Action Errors

All server actions follow the existing pattern: return `{ ok: boolean; message: string }` for user-facing errors. Internal errors (DB failures) are allowed to throw and will surface as Next.js error boundaries.

| Scenario | Handling |
|---|---|
| No session on protected action | Return `{ ok: false, message: "Not authenticated." }` |
| Wrong role on protected action | Return `{ ok: false, message: "Access denied." }` |
| Missing required field | Return `{ ok: false, message: "..." }` identifying the field |
| DB constraint violation | Catch and return `{ ok: false, message: "..." }` |
| Notification insert failure | Log error, do not fail the primary operation |
| Bulk operation with empty IDs array | Return `{ ok: false, message: "No items selected." }` |

### Client Component Errors

- All `useTransition` calls display inline error messages using the existing `bg-red-50 text-red-700` pattern.
- Optimistic UI updates are reverted on action failure.
- The `BulkActionToolbar` disables buttons while a transition is pending to prevent double-submission.

### Route Guards

Every page and action uses the same guard pattern:
```typescript
const session = await getSession();
if (!session) redirect("/login");
if (session.role !== "admin") redirect("/dashboard"); // for admin pages
if (!["agent", "owner"].includes(session.role)) redirect("/dashboard"); // for broker-only pages
if (session.role !== "buyer") redirect("/dashboard"); // for buyer-only pages
```


## Testing Strategy

### Unit Tests (example-based)

Focus on specific routing rules, UI rendering, and edge cases that don't benefit from input variation.

**Routing rules (Requirements 1.x):**
- Admin session → `/dashboard` redirects to `/admin`
- Buyer session → `/admin` redirects to `/dashboard`
- No session → `/dashboard` and `/admin` redirect to `/login`
- Agent/owner session → `/admin` redirects to `/dashboard`

**AdminShell mobile drawer (Requirements 2.x):**
- Hamburger button has `lg:hidden` class (desktop hidden)
- Clicking hamburger opens the Sheet drawer
- Clicking a nav link inside the drawer closes it
- Clicking the backdrop closes the drawer
- Body has `overflow-hidden` while drawer is open

**Role labels (Requirements 8.x):**
- `role="agent"` → leads label is "Client Inquiries", subtitle is "Agent Dashboard"
- `role="owner"` → leads label is "Buyer Inquiries", subtitle is "Owner Dashboard"

**Empty states:**
- Broker with zero listings shows prompt to post first listing
- Pipeline column with no inquiries shows empty state
- Buyer with no favorites shows link to search
- Buyer with no inquiries shows link to search
- Buyer with no saved searches shows link to search
- User with no notifications shows empty state in dropdown

### Property-Based Tests

Use **fast-check** (TypeScript-native PBT library, no new dependency needed for Node.js projects) with a minimum of **100 runs per property**.

Each test is tagged with a comment:
```typescript
// Feature: user-panels, Property N: <property text>
```

**Test file locations:**
- `src/__tests__/actions/notifications.test.ts` — Properties 7–12
- `src/__tests__/actions/projects.test.ts` — Properties 1–6
- `src/__tests__/actions/bulk.test.ts` — Properties 13–14
- `src/__tests__/actions/broker.test.ts` — Properties 15–17
- `src/__tests__/actions/buyer.test.ts` — Properties 18–23
- `src/__tests__/components/PanelShell.test.tsx` — Property 24

**Test setup:** Each property test uses a test database (or mocks the `sql` tagged template via `jest.mock("@/lib/db")`) to avoid hitting production Neon. The mock returns controlled data generated by fast-check arbitraries.

**Example property test structure:**
```typescript
import fc from "fast-check";
import { getProjectsAction } from "@/app/actions/admin";

// Feature: user-panels, Property 1: Projects are always returned newest-first
it("projects are returned newest-first for any set of projects", async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.record({ id: fc.integer(), created_at: fc.date() }), { minLength: 1 }),
      async (projects) => {
        mockSql.mockResolvedValue(projects.sort(() => Math.random() - 0.5));
        const result = await getProjectsAction();
        for (let i = 0; i < result.length - 1; i++) {
          expect(new Date(result[i].created_at) >= new Date(result[i + 1].created_at)).toBe(true);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Tests

For end-to-end flows that involve multiple DB operations:
- Full notification flow: submit listing → verify admin notification exists in DB
- Full saved search flow: save → list → delete → verify gone
- Bulk approve flow: create listings → bulk approve → verify all active

These run against a dedicated test schema in Neon (separate `DATABASE_URL_TEST` env var) and are tagged `@integration` to run separately from unit tests.

### Diagram: Component Hierarchy

```
/dashboard (RSC)
├── [role=admin]   → redirect /admin
├── [role=agent|owner]
│   └── PanelShell (role="agent"|"owner")
│       ├── NotificationBell (client, broker notifications)
│       ├── BrokerOverview (RSC content)
│       └── [sub-pages via currentPath]
└── [role=buyer]
    └── PanelShell (role="buyer")
        ├── CustomerOverview (RSC content)
        └── [sub-pages via currentPath]

/admin (RSC)
└── AdminShell
    ├── AdminMobileNav (client, hamburger + drawer)
    ├── NotificationBell (client, admin notifications)
    └── [page content]
```

