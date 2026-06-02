# Requirements: The City's Block — Full Platform Completion

## Introduction

This document defines the functional requirements for completing The City's Block real estate portal. The platform already has working auth, listing creation, admin approval, and search. These requirements cover all remaining gaps: URL parameter bugs, mock-data pages, and missing features needed for a production-ready platform.

---

## Requirement 1: Fix URL Parameter Inconsistencies

**User Story**: As a user, when I use the homepage search form or click navigation links, I want to land on the correct search results page with the right filters applied.

### Acceptance Criteria

1.1 The homepage hero search form MUST submit `listing_type` (not `listingType`) as the query parameter for the intent selector.

1.2 The homepage hero search form MUST submit `asset_class` (not `assetClass`) as the query parameter for the asset class selector.

1.3 The `/commercial` page MUST redirect to `/search?asset_class=commercial` (not `?assetClass=commercial`).

1.4 After fixing, clicking "Buy" in the hero form MUST land on `/search?listing_type=sale` and show only sale listings.

1.5 After fixing, clicking "Rent" in the hero form MUST land on `/search?listing_type=rent` and show only rental listings.

---

## Requirement 2: Homepage Real Data

**User Story**: As a visitor, I want to see real featured listings and accurate platform metrics on the homepage, not placeholder data.

### Acceptance Criteria

2.1 The homepage MUST display up to 4 listings where `status = 'active' AND featured = true` in the "Featured inventory" section.

2.2 If fewer than 4 featured listings exist, the homepage MUST fall back to showing the most recent active listings to fill the grid.

2.3 The homepage metrics (active listings count, cities count) MUST be sourced from live DB queries, not hardcoded values.

2.4 The homepage commercial section MUST show up to 2 real active commercial listings from the DB.

2.5 Featured listings on the homepage MUST link to `/listings/[id]` (the DB-powered detail page), not `/property/[slug]`.

2.6 The homepage MUST render correctly even when the DB has zero active listings (empty state, no errors).

---

## Requirement 3: Dashboard Profile — Real Data and Edit

**User Story**: As a logged-in owner or agent, I want to view and edit my real profile information from the dashboard.

### Acceptance Criteria

3.1 The `/dashboard/profile` page MUST display the logged-in user's real data from the `users` table (name, email, phone, city, bio, role, verified status).

3.2 The profile page MUST include an edit form with fields for: name (required), phone, city, bio.

3.3 Submitting the edit form MUST update the `users` row in the DB for the current session's user ID.

3.4 After a successful profile update, the Navbar MUST reflect the updated name without requiring a full page reload or re-login.

3.5 The profile page MUST include a separate password change section with fields: current password, new password, confirm new password.

3.6 Password change MUST verify the current password against the stored bcrypt hash before updating.

3.7 Password change MUST reject new passwords shorter than 6 characters.

3.8 The profile page MUST be protected — unauthenticated users are redirected to `/login`.

---

## Requirement 4: Owner Can Edit Their Own Listing

**User Story**: As an owner or agent, I want to edit a listing I've posted so I can correct mistakes or update details.

### Acceptance Criteria

4.1 The `/dashboard/listings` page MUST include an "Edit" button/link for each listing.

4.2 Clicking "Edit" MUST navigate to `/dashboard/listings/[id]/edit` with a pre-populated form.

4.3 The edit form MUST contain the same fields as the new listing form (title, description, listing_type, asset_class, property_type, city, locality, address, price, price_unit, area, bhk, bathrooms, furnishing, possession, amenities, images).

4.4 Submitting the edit form MUST update the listing in the DB.

4.5 After editing, the listing's `status` MUST be reset to `'pending'` (requiring re-approval by admin).

4.6 The edit action MUST verify that `listing.user_id === session.id` — users cannot edit listings they don't own.

4.7 If a user attempts to edit a listing they don't own, the action MUST return an error and make no DB changes.

---

## Requirement 5: Inquiry Status Management by Owner

**User Story**: As an owner or agent, I want to mark inquiries as contacted or closed so I can track my lead pipeline.

### Acceptance Criteria

5.1 The `/dashboard/leads` page MUST display a status control for each inquiry.

5.2 The status control MUST allow transitioning between: `new` → `contacted` → `closed`.

5.3 Updating inquiry status MUST only be allowed if the inquiry belongs to a listing owned by the current session user.

5.4 The status change MUST persist to the DB immediately.

5.5 The leads page MUST visually distinguish between `new`, `contacted`, and `closed` statuses with different badge colors.

---

## Requirement 6: Admin — Feature/Unfeature Listings

**User Story**: As an admin, I want to mark listings as featured so they appear prominently on the homepage.

### Acceptance Criteria

6.1 The `/admin/listings` page MUST display a "Feature" toggle (star icon) for each active listing.

6.2 Clicking the toggle MUST flip the `featured` boolean on the listing in the DB.

6.3 The toggle MUST visually reflect the current `featured` state (filled star = featured, outline star = not featured).

6.4 After toggling, the homepage featured section MUST update to reflect the change (cache revalidated).

6.5 Only admin users can toggle the featured flag — the action MUST call `requireAdmin()`.

---

## Requirement 7: Admin — Change User Role

**User Story**: As an admin, I want to change a user's role so I can promote buyers to agents or correct role assignments.

### Acceptance Criteria

7.1 The `/admin/users` page MUST display a role selector for each non-admin user.

7.2 The role selector MUST offer: `buyer`, `owner`, `agent`, `admin`.

7.3 Selecting a new role MUST update `users.role` in the DB immediately.

7.4 An admin MUST NOT be able to change their own role (self-demotion guard).

7.5 After a role change, the users list MUST refresh to show the updated role.

---

## Requirement 8: Buyer Favorites

**User Story**: As a buyer, I want to save listings to my favorites so I can revisit them later.

### Acceptance Criteria

8.1 A `favorites` table MUST be created in the DB with columns: `id`, `user_id`, `listing_id`, `created_at`, and a UNIQUE constraint on `(user_id, listing_id)`.

8.2 A heart/bookmark icon MUST appear on each `DbListingCard` and on the `/listings/[id]` detail page.

8.3 Clicking the icon MUST toggle the favorite state (save if not saved, unsave if already saved).

8.4 The favorite toggle MUST require authentication — unauthenticated users see a prompt to sign in.

8.5 The `/favorites` page MUST display all listings the current user has saved, using real DB data.

8.6 The `/favorites` page MUST show an empty state message when no favorites exist.

8.7 The `/account` page MUST show the real count of the user's saved favorites.

8.8 Removing a favorite from the `/favorites` page MUST immediately remove it from the list.

---

## Requirement 9: Commercial Page — Real Listings

**User Story**: As a buyer looking for commercial property, I want to browse a dedicated commercial listings page with real inventory.

### Acceptance Criteria

9.1 The `/commercial` page MUST be a full listings page (not just a redirect) showing active listings where `asset_class = 'commercial'`.

9.2 The page MUST support filtering by city, listing_type (sale/rent), and property_type.

9.3 The page MUST use `DbListingCard` components linking to `/listings/[id]`.

9.4 The page MUST show an appropriate empty state when no commercial listings exist.

9.5 The page MUST be publicly accessible (no auth required).

---

## Requirement 10: Agent Profile Pages — Real Data

**User Story**: As a buyer, I want to view an agent's profile page with their real listings so I can evaluate their expertise.

### Acceptance Criteria

10.1 The `/agents/[slug]` page MUST resolve the agent from the DB using the slug format `{name-kebab}-{id}`.

10.2 The page MUST display the agent's real name, city, bio, company, and verified status from the `users` table.

10.3 The page MUST display the agent's active listings from the `listings` table.

10.4 If the slug resolves to a user who is not an agent (role ≠ 'agent'), the page MUST return a 404.

10.5 If the slug ID does not match any user, the page MUST return a 404.

---

## Requirement 11: Fix /property/[slug] Route

**User Story**: As a user who clicks a link to `/property/[slug]`, I want to be redirected to the correct DB-powered listing page.

### Acceptance Criteria

11.1 The `/property/[slug]` page MUST attempt to parse a numeric ID from the slug.

11.2 If a numeric ID is found, the page MUST redirect to `/listings/[id]`.

11.3 If no valid ID can be parsed, the page MUST return a 404.

11.4 All internal links that previously pointed to `/property/[slug]` MUST be updated to point to `/listings/[id]`.

---

## Requirement 12: Admin Localities Page — Real Data

**User Story**: As an admin, I want to see real locality/city statistics from the DB, not mock data.

### Acceptance Criteria

12.1 The `/admin/localities` page MUST display cities derived from real listing data (GROUP BY city with listing counts).

12.2 The page MUST show the number of active listings per city.

12.3 The page MUST be accessible only to admin users.

---

## Requirement 13: Projects Pages — Polished Static State

**User Story**: As a visitor, I want the `/projects` and `/project/[slug]` pages to look complete and professional even though project data is not yet in the DB.

### Acceptance Criteria

13.1 The `/projects` page MUST display the existing mock project data with a clear "Coming Soon" or "Demo" indicator.

13.2 The `/admin/projects` page MUST display a clear message that project management is not yet connected to the DB.

13.3 Neither page MUST throw errors or show broken UI.

---

## Requirement 14: Account Page — Session-Aware

**User Story**: As a logged-in buyer, I want my `/account` page to show real data about my activity.

### Acceptance Criteria

14.1 The `/account` page MUST require authentication — unauthenticated users are redirected to `/login`.

14.2 The page MUST display the real count of the user's submitted inquiries (from the `inquiries` table, matched by buyer_email or session).

14.3 The page MUST display the real count of the user's saved favorites.

14.4 The page MUST display the user's name and email from the session.

---

## Non-Functional Requirements

### NFR-1: Zero Mock Data on Live Pages
All public-facing and authenticated pages MUST source data from the Neon Postgres DB. Imports from `@/lib/portal` (mock data) MUST be removed from all pages except `/projects` (which is explicitly static per Requirement 13).

### NFR-2: Consistent Error Handling
All Server Actions MUST return `{ ok: boolean; message: string }` — never throw unhandled exceptions to the client.

### NFR-3: Auth Protection
All dashboard and admin pages MUST call `getSession()` and redirect to `/login` if no session exists.

### NFR-4: Ownership Enforcement at DB Level
All owner-scoped mutations MUST include `AND user_id = session.id` in the SQL WHERE clause, not just application-level checks.

### NFR-5: Cache Invalidation
Every Server Action that mutates data MUST call `revalidatePath()` on all affected routes.
