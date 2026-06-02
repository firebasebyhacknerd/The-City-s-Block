# Implementation Plan: User Panels

## Overview

Implement three role-specific authenticated panel experiences — Admin, Broker, and Customer — on top of the existing Next.js App Router + PostgreSQL stack. Tasks are ordered: DB schema first, then server actions, then shared components, then page-by-page from Admin through Broker to Customer.

## Tasks

- [x] 1. Create new database tables and TypeScript types
  - Add `src/types/index.ts` with `Notification`, `SavedSearch`, `Project`, `NotificationType`, and `ReferenceType` types as specified in the design
  - Create a `scripts/migrate.ts` (or SQL migration file) that runs the three `CREATE TABLE IF NOT EXISTS` statements for `projects`, `notifications`, and `saved_searches`, including all indexes
  - Verify the migration runs against the Neon database without errors
  - _Requirements: 3.1, 4.1, 12.1_

- [x] 2. Implement notifications server actions
  - [x] 2.1 Create `src/app/actions/notifications.ts` with all four public actions and two insert helpers
    - Implement `insertAdminNotification` — queries all `role='admin'` users and bulk-inserts one notification row per admin
    - Implement `insertUserNotification` — inserts a single notification for a given `user_id`
    - Implement `getMyNotificationsAction` — returns 20 most recent notifications for session user ordered by `created_at DESC`
    - Implement `getUnreadCountAction` — returns count of unread notifications for session user
    - Implement `markNotificationReadAction(id)` — sets `read=TRUE` only if notification belongs to session user
    - Implement `markAllNotificationsReadAction` — sets `read=TRUE` for all session user's notifications
    - _Requirements: 4.1, 4.2, 4.8, 4.9, 4.10_

  - [ ]* 2.2 Write property test for notification ordering and cap (Property 7)
    - **Property 7: Notifications are returned newest-first and capped at 20**
    - **Validates: Requirements 4.2, 4.7**

  - [ ]* 2.3 Write property test for mark-read idempotency (Property 11)
    - **Property 11: Mark-read is idempotent**
    - **Validates: Requirements 4.8**

  - [ ]* 2.4 Write property test for mark-all-read completeness (Property 12)
    - **Property 12: Mark-all-read sets all user notifications to read**
    - **Validates: Requirements 4.9, 4.10**

- [x] 3. Implement saved searches server actions
  - [x] 3.1 Create `src/app/actions/saved-searches.ts` with all three actions
    - Implement `saveSearchAction(filters, label?)` — requires session, auto-generates label from filters if not provided (e.g. `"3 BHK Sale in Mumbai"`), inserts into `saved_searches`
    - Implement `getMySavedSearchesAction` — returns all saved searches for session user ordered by `created_at DESC`
    - Implement `deleteSavedSearchAction(id)` — deletes only if record belongs to session user
    - All three actions must return `{ ok: false }` when no session exists
    - _Requirements: 12.2, 12.3, 12.4, 12.6, 12.8_

  - [ ]* 3.2 Write property test for saved search round-trip (Property 20)
    - **Property 20: Saved search creation round-trip**
    - **Validates: Requirements 12.3**

  - [ ]* 3.3 Write property test for saved search isolation (Property 21)
    - **Property 21: Saved searches are isolated per user**
    - **Validates: Requirements 12.4**

  - [ ]* 3.4 Write property test for saved search delete (Property 22)
    - **Property 22: Saved search delete removes the record**
    - **Validates: Requirements 12.6**

  - [ ]* 3.5 Write property test for unauthenticated rejection (Property 23)
    - **Property 23: Unauthenticated saved search action is rejected**
    - **Validates: Requirements 12.8**

- [x] 4. Extend `listings.ts` and `auth.ts` with new actions and notification hooks
  - [x] 4.1 Add `getBrokerStatsAction` to `src/app/actions/listings.ts`
    - Query `listings` and `inquiries` filtered by `session.id`
    - Return `activeListings`, `pendingListings`, `totalInquiries`, `newInquiriesLast30Days`, and `listingsWithInquiryCounts`
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 4.2 Add `getBuyerInquiriesAction` to `src/app/actions/listings.ts`
    - Query `inquiries WHERE buyer_email = session.email` joined with `listings` for title
    - Return ordered by `created_at DESC`
    - _Requirements: 10.2, 10.3, 10.4_

  - [x] 4.3 Add `getCustomerStatsAction` to `src/app/actions/listings.ts`
    - Return counts for `savedListings`, `inquiries`, and `savedSearches` for session user
    - _Requirements: 9.2_

  - [x] 4.4 Wire `insertAdminNotification` into `createListingAction`
    - After successful `INSERT INTO listings`, call `insertAdminNotification("listing_pending", ...)` with the new listing's id
    - _Requirements: 4.3_

  - [x] 4.5 Wire `insertUserNotification` into `submitInquiryAction`
    - After successful `INSERT INTO inquiries`, look up the listing's `user_id` and title, then call `insertUserNotification` for the broker
    - _Requirements: 4.5_

  - [x] 4.6 Wire `insertAdminNotification` into `signUpAction` in `src/app/actions/auth.ts`
    - After successful user creation, call `insertAdminNotification("user_registered", ...)` with the new user's id
    - _Requirements: 4.4_

  - [ ]* 4.7 Write property test for listing submission triggering admin notifications (Property 8)
    - **Property 8: Listing submission triggers admin notifications**
    - **Validates: Requirements 4.3**

  - [ ]* 4.8 Write property test for user registration triggering admin notifications (Property 9)
    - **Property 9: User registration triggers admin notifications**
    - **Validates: Requirements 4.4**

  - [ ]* 4.9 Write property test for inquiry submission triggering broker notification (Property 10)
    - **Property 10: Inquiry submission triggers broker notification**
    - **Validates: Requirements 4.5**

  - [ ]* 4.10 Write property test for broker stats isolation (Property 15)
    - **Property 15: Broker stats reflect only the authenticated broker's data**
    - **Validates: Requirements 6.1, 6.2**

  - [ ]* 4.11 Write property test for per-listing inquiry counts (Property 16)
    - **Property 16: Per-listing inquiry counts are accurate**
    - **Validates: Requirements 6.3**

  - [ ]* 4.12 Write property test for buyer inquiry isolation (Property 18)
    - **Property 18: Buyer inquiry history is isolated by email**
    - **Validates: Requirements 10.2, 10.3**

  - [ ]* 4.13 Write property test for buyer inquiry required fields (Property 19)
    - **Property 19: Buyer inquiry records contain all required fields**
    - **Validates: Requirements 10.4**

- [-] 5. Implement admin bulk and project server actions in `admin.ts`
  - [x] 5.1 Add bulk listing actions to `src/app/actions/admin.ts`
    - Implement `bulkApproveListingsAction(ids)` — sets `status='active'` and `verified=TRUE` for all ids; returns `{ ok: false }` for empty array
    - Implement `bulkRejectListingsAction(ids, reason)` — sets `status='rejected'` and `rejection_reason` for all ids
    - Implement `bulkDeleteListingsAction(ids)` — deletes all records with matching ids
    - All three call `revalidatePath("/admin/listings")`
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [x] 5.2 Add bulk user actions to `src/app/actions/admin.ts`
    - Implement `bulkVerifyUsersAction(ids)` — sets `verified=TRUE` for all ids
    - Implement `bulkBanUsersAction(ids)` — sets `banned=TRUE` for all ids
    - Both call `revalidatePath("/admin/users")`
    - _Requirements: 5.8, 5.9, 5.10_

  - [x] 5.3 Add project CRUD actions to `src/app/actions/admin.ts`
    - Implement `getProjectsAction` — returns all projects ordered by `created_at DESC`
    - Implement `getPublicProjectsAction` — returns only `status='published'` projects
    - Implement `createProjectAction(data)` — validates required fields (`name`, `city`), inserts, revalidates
    - Implement `updateProjectAction(id, data)` — updates record, revalidates
    - Implement `deleteProjectAction(id)` — deletes record, revalidates
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.7, 3.8, 3.9_

  - [x] 5.4 Add `getPipelineAction` to `src/app/actions/admin.ts`
    - Query inquiries for session user's listings, group by `status` into `{ new, contacted, closed }`
    - _Requirements: 7.1, 7.2_

  - [ ]* 5.5 Write property test for bulk listing operations (Property 13)
    - **Property 13: Bulk listing operations apply to all selected IDs**
    - **Validates: Requirements 5.4, 5.5, 5.6**

  - [ ]* 5.6 Write property test for bulk user operations (Property 14)
    - **Property 14: Bulk user operations apply to all selected IDs**
    - **Validates: Requirements 5.9, 5.10**

  - [ ]* 5.7 Write property test for projects ordering (Property 1)
    - **Property 1: Projects are always returned newest-first**
    - **Validates: Requirements 3.2**

  - [ ]* 5.8 Write property test for project creation round-trip (Property 2)
    - **Property 2: Project creation round-trip**
    - **Validates: Requirements 3.4**

  - [ ]* 5.9 Write property test for invalid project data rejection (Property 3)
    - **Property 3: Invalid project data is rejected without DB write**
    - **Validates: Requirements 3.5**

  - [ ]* 5.10 Write property test for project update round-trip (Property 4)
    - **Property 4: Project update round-trip**
    - **Validates: Requirements 3.7**

  - [ ]* 5.11 Write property test for project delete (Property 5)
    - **Property 5: Project delete removes the record**
    - **Validates: Requirements 3.8**

  - [ ]* 5.12 Write property test for published vs draft visibility (Property 6)
    - **Property 6: Published projects are visible publicly; drafts are not**
    - **Validates: Requirements 3.9**

  - [ ]* 5.13 Write property test for pipeline grouping (Property 17)
    - **Property 17: Pipeline grouping is exhaustive and correct**
    - **Validates: Requirements 7.2**

- [ ] 6. Checkpoint — Ensure all server actions compile and tests pass
  - Run `npm run typecheck` to confirm no TypeScript errors across all new action files
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Upgrade `PanelShell` component with role-based navigation
  - Modify `src/components/portal/PanelShell.tsx` to accept the new `role` and `currentPath` props alongside the existing `items`/`activeHref` props (keep old props for backward compatibility during transition)
  - Add `BROKER_NAV` and `BUYER_NAV` configurations as specified in the design, including icons from `lucide-react`
  - When `role` is provided, derive nav items and title from role config; when `items` is provided, use them as before
  - Active item highlighting uses `currentPath` comparison when `role` is provided
  - Default titles: `"Agent Dashboard"` for `role="agent"`, `"Owner Dashboard"` for `role="owner"`, `"My Dashboard"` for `role="buyer"`
  - _Requirements: 8.1, 8.2, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ]* 7.1 Write property test for PanelShell role-correct navigation (Property 24)
    - **Property 24: PanelShell renders role-correct navigation**
    - **Validates: Requirements 14.4, 14.5, 14.6**

- [x] 8. Build `AdminMobileNav` client component and wire into `AdminShell`
  - Create `src/components/admin/AdminMobileNav.tsx` as a `"use client"` component
    - Renders a hamburger `<button>` with `lg:hidden` class
    - Uses the existing shadcn `Sheet` component (`@radix-ui/react-dialog`) for the overlay drawer
    - Drawer contains the same nav items as the desktop sidebar, styled consistently
    - Clicking any nav link closes the drawer
    - Clicking the backdrop closes the drawer
    - Uses `useEffect` to toggle `overflow-hidden` on `document.body` while drawer is open
  - Modify `src/components/admin/AdminShell.tsx` to import and render `AdminMobileNav` in the top bar, left of the title, on mobile
  - Desktop sidebar layout remains unchanged
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 9. Build `NotificationBell` client component
  - Create `src/components/shared/NotificationBell.tsx` as a `"use client"` component
  - Accept `initialNotifications: Notification[]` and `initialUnreadCount: number` as props
  - Render a bell icon button with a badge showing unread count (hidden when count is 0)
  - Use the existing shadcn `Popover` component for the dropdown
  - List up to 20 notifications: message text, relative time (use `date-fns`), read/unread visual indicator
  - "Mark all as read" button at top calls `markAllNotificationsReadAction` via `useTransition`; optimistically sets all items to read and badge to 0
  - Clicking a notification item calls `markNotificationReadAction(id)` via `useTransition`, optimistically marks it read, then navigates to the reference URL (derived from `reference_type` and `reference_id` as specified in the design)
  - Empty state message when no notifications exist
  - _Requirements: 4.1, 4.2, 4.6, 4.7, 4.8, 4.9, 4.10, 4.11_

- [x] 10. Add `NotificationBell` to Admin and Broker panel top bars
  - In `src/components/admin/AdminShell.tsx`, fetch notifications server-side (call `getMyNotificationsAction` and `getUnreadCountAction` inside the RSC) and pass as props to `NotificationBell` rendered in the top bar
  - In the upgraded `/dashboard` page (task 12), fetch broker notifications and pass to `NotificationBell` rendered inside `PanelShell`'s top bar area
  - _Requirements: 4.1, 4.6_

- [x] 11. Build `BulkActionToolbar` client component
  - Create `src/components/admin/BulkActionToolbar.tsx` as a `"use client"` component
  - Accept `selectedIds: number[]`, `type: "listings" | "users"`, and `onSuccess: () => void` as props
  - Render only when `selectedIds.length > 0`
  - For `type="listings"`: Approve, Reject (with inline reason `<input>`), Delete buttons
  - For `type="users"`: Verify, Ban buttons
  - Destructive actions (Delete, Ban) show an `AlertDialog` confirmation before calling the action
  - All actions use `useTransition`; buttons are disabled while pending
  - On success, call `onSuccess()` to let the parent clear selection
  - _Requirements: 5.3, 5.8, 5.11_

- [x] 12. Upgrade Admin Listings page with bulk selection
  - Convert `src/app/admin/listings/page.tsx` to a client component (or extract a `AdminListingsClient` client wrapper)
  - Add `selectedIds: number[]` state and a `setSelectedIds` updater
  - Add a checkbox to each listing row that toggles the listing's id in `selectedIds`
  - Add a "select all" checkbox in the section header that sets `selectedIds` to all visible listing ids or clears it
  - Render `BulkActionToolbar` with `type="listings"` when `selectedIds.length > 0`
  - On bulk action success, clear `selectedIds` (RSC re-render via `revalidatePath` handles data refresh)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 13. Upgrade Admin Users page with bulk selection
  - Convert `src/app/admin/users/page.tsx` to use a `AdminUsersClient` client wrapper (same pattern as task 12)
  - Add per-row checkboxes and a "select all" checkbox
  - Render `BulkActionToolbar` with `type="users"` when `selectedIds.length > 0`
  - _Requirements: 5.7, 5.8, 5.9, 5.10, 5.11_

- [x] 14. Build Admin Projects page connected to database
  - Replace the stub in `src/app/admin/projects/page.tsx` with a full RSC that calls `getProjectsAction` and renders the project list inside `AdminShell`
  - Create `src/components/admin/ProjectForm.tsx` — a client component with a controlled form for create/edit with fields: `name`, `developer`, `city`, `locality`, `description`, `status` (select: draft/published), `image_url`
  - Create `src/components/admin/ProjectRow.tsx` — renders a single project row with edit (inline or modal) and delete (with `AlertDialog` confirmation) controls
  - Wire create form to `createProjectAction`, edit form to `updateProjectAction`, delete button to `deleteProjectAction`
  - Display validation errors returned by actions inline in the form
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 15. Update public `/projects` page to use `getPublicProjectsAction`
  - Modify `src/app/projects/page.tsx` to call `getPublicProjectsAction` instead of any existing data source
  - Ensure only `status='published'` projects are displayed
  - _Requirements: 3.9_

- [ ] 16. Checkpoint — Admin panel complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Upgrade `/dashboard` page for role-based rendering
  - Rewrite `src/app/dashboard/page.tsx` to handle all three non-admin roles in one file
  - `role='admin'` → `redirect("/admin")` (already exists)
  - `role='agent'|'owner'` → render `BrokerOverview` content wrapped in `PanelShell` with `role` prop and `currentPath="/dashboard"`
  - `role='buyer'` → render `CustomerOverview` content wrapped in `PanelShell` with `role="buyer"` and `currentPath="/dashboard"`
  - Broker overview: call `getBrokerStatsAction`, display stat cards (active listings, pending, total inquiries, new inquiries last 30 days), verification status badge, empty state with "Post your first listing" prompt when zero listings
  - Customer overview: call `getCustomerStatsAction`, display summary counts (saved listings, inquiries, saved searches), navigation links to each section, welcome message with search prompt when all counts are zero
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.4, 6.5, 8.1, 8.2, 9.1, 9.2, 9.3, 9.4_

- [x] 18. Build `PipelineBoard` client component and Pipeline page
  - Create `src/components/dashboard/PipelineBoard.tsx` as a `"use client"` component
    - Accept `initialInquiries: Inquiry[]` as props
    - Render three columns: "New", "Contacted", "Closed"
    - Each inquiry card shows: buyer name, phone, email, listing title, date received
    - Status change calls `updateInquiryStatusAction` via `useTransition`; optimistically moves card to new column, reverts on error
    - Empty state per column when no inquiries
  - Create `src/app/dashboard/pipeline/page.tsx` as an RSC
    - Guard: `role` must be `agent` or `owner`, else `redirect("/dashboard")`
    - Call `getPipelineAction`, pass result to `PipelineBoard`
    - Wrap in `PanelShell` with `role` prop and `currentPath="/dashboard/pipeline"`
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 19. Upgrade Broker Leads page with PanelShell and role labels
  - Modify `src/app/dashboard/leads/page.tsx` to wrap content in `PanelShell` with `role` prop and `currentPath="/dashboard/leads"`
  - Guard: redirect buyers (`role='buyer'`) to `/dashboard`
  - Display section heading as "Client Inquiries" for `role='agent'` and "Buyer Inquiries" for `role='owner'`
  - _Requirements: 8.1, 8.2, 8.3, 14.2_

- [x] 20. Upgrade Broker Listings pages with PanelShell and per-listing inquiry counts
  - Modify `src/app/dashboard/listings/page.tsx` to wrap in `PanelShell` with `role` prop and `currentPath="/dashboard/listings"`
  - Call `getBrokerStatsAction` to get `listingsWithInquiryCounts`; display inquiry count badge next to each listing
  - Guard: redirect buyers to `/dashboard`
  - Apply same PanelShell wrapping to `src/app/dashboard/listings/[id]/edit/page.tsx` and `src/app/dashboard/new-listing/page.tsx`
  - _Requirements: 6.3, 14.2_

- [x] 21. Upgrade Broker Profile page with PanelShell and role badge
  - Modify `src/app/dashboard/profile/page.tsx` to wrap in `PanelShell` with `role` prop and `currentPath="/dashboard/profile"`
  - Display role badge (Agent / Owner / Buyer) as a read-only element
  - _Requirements: 8.4, 13.6, 14.2, 14.3_

- [x] 22. Build Customer Favorites page
  - Create `src/components/dashboard/FavoriteCard.tsx` as a `"use client"` component
    - Accept `listing: Listing` and `onRemove: (listingId: number) => void` as props
    - Display: listing title, city, price, property type, remove button
    - Remove calls `toggleFavoriteAction` via `useTransition`; parent handles optimistic removal
  - Create `src/app/dashboard/favorites/page.tsx` as an RSC
    - Guard: `role` must be `buyer`, else `redirect("/dashboard")`
    - Call `getMyFavoritesAction`, pass listings to a client wrapper that manages optimistic removal
    - Wrap in `PanelShell` with `role="buyer"` and `currentPath="/dashboard/favorites"`
    - Empty state with link to `/search`
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 14.3_

- [x] 23. Build Customer Inquiries page
  - Create `src/app/dashboard/inquiries/page.tsx` as an RSC
    - Guard: `role` must be `buyer`, else `redirect("/dashboard")`
    - Call `getBuyerInquiriesAction`, render inquiry list ordered by date
    - Each row: listing title, message, date, status badge
    - Wrap in `PanelShell` with `role="buyer"` and `currentPath="/dashboard/inquiries"`
    - Empty state with link to `/search`
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 14.3_

- [x] 24. Upgrade Customer Saved Searches page
  - Create `src/components/dashboard/SavedSearchItem.tsx` as a `"use client"` component
    - Accept `search: SavedSearch` and `onDelete: (id: number) => void` as props
    - Display: label, filter summary chips (one chip per filter key-value pair), date saved, delete button
    - Delete calls `deleteSavedSearchAction` via `useTransition`; parent handles optimistic removal
    - "Search again" link reconstructs `/search?city=...&listing_type=...` from `search.filters`
  - Replace the stub in `src/app/dashboard/saved-searches/page.tsx` with a full RSC
    - Guard: `role` must be `buyer`, else `redirect("/dashboard")`
    - Call `getMySavedSearchesAction`, pass to a client wrapper managing optimistic deletion
    - Wrap in `PanelShell` with `role="buyer"` and `currentPath="/dashboard/saved-searches"`
    - Empty state with link to `/search`
  - _Requirements: 12.1, 12.4, 12.5, 12.6, 12.7, 14.3_

- [x] 25. Add "Save this search" button to the Search page
  - Modify `src/app/search/page.tsx` (or its client search component) to show a "Save this search" button when the user is authenticated and at least one filter is active
  - Button calls `saveSearchAction` with current URL search params as the filters object
  - Show a toast confirmation on success
  - _Requirements: 12.2, 12.3_

- [x] 26. Add role-based routing guards to all new and upgraded pages
  - Audit every page modified or created in tasks 17–25 to confirm the correct `getSession()` guard is at the top
  - Admin-only pages: redirect non-admin to `/dashboard`
  - Broker-only pages (`/dashboard/pipeline`, `/dashboard/listings`, `/dashboard/new-listing`, `/dashboard/leads`): redirect buyers to `/dashboard`
  - Buyer-only pages (`/dashboard/favorites`, `/dashboard/inquiries`, `/dashboard/saved-searches`): redirect non-buyers to `/dashboard`
  - All protected pages: redirect unauthenticated users to `/login`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 27. Final checkpoint — Ensure all tests pass
  - Run `npm run typecheck` to confirm zero TypeScript errors across the entire project
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** (install with `npm install --save-dev fast-check`) and mock `@/lib/db` via Jest
- Test files live in `src/__tests__/actions/` and `src/__tests__/components/` as specified in the design
- Each task references specific requirements for traceability
- The `PanelShell` upgrade (task 7) keeps old `items`/`activeHref` props so existing pages continue to work during the transition — remove them once all pages are migrated
- Notification inserts are fire-and-forget: if they fail, the primary operation is not rolled back
