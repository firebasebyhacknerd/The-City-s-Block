# Tasks: The City's Block — Full Platform Completion

## Task List

- [x] 1. DB Migration — Create favorites table
  - [x] 1.1 Add `CREATE TABLE IF NOT EXISTS favorites` SQL to a migration script or run directly against Neon
  - [x] 1.2 Verify the UNIQUE constraint on `(user_id, listing_id)` is in place

- [x] 2. Fix URL Parameter Bugs (Req 1)
  - [x] 2.1 In `src/app/page.tsx`, change hero form `name="listingType"` to `name="listing_type"` and `name="assetClass"` to `name="asset_class"`
  - [x] 2.2 In `src/app/commercial/page.tsx`, change redirect target from `?assetClass=commercial` to `?asset_class=commercial`

- [x] 3. Homepage Real Data (Req 2)
  - [x] 3.1 Add `getHomepageListingsAction()` to `src/app/actions/listings.ts` — parallel queries for featured (up to 4), recent (up to 4), activeListings count, cities count
  - [x] 3.2 Rewrite `src/app/page.tsx` to call `getHomepageListingsAction()` and replace all `@/lib/portal` imports
  - [x] 3.3 Replace `ListingCard` with `DbListingCard` in the featured and commercial sections of the homepage
  - [x] 3.4 Update homepage metrics to use real DB counts (activeListings, cities)
  - [x] 3.5 Ensure homepage renders gracefully when DB has zero active listings

- [x] 4. Dashboard Profile — Real Data + Edit (Req 3)
  - [x] 4.1 Add `updateProfileAction(formData)` to `src/app/actions/auth.ts` — updates name/phone/city/bio, refreshes JWT session cookie
  - [x] 4.2 Add `changePasswordAction(currentPassword, newPassword)` to `src/app/actions/auth.ts` — verifies current password, updates hash
  - [x] 4.3 Create `src/components/dashboard/ProfileEditForm.tsx` — client component with name, phone, city, bio fields; calls `updateProfileAction`
  - [x] 4.4 Create `src/components/dashboard/PasswordChangeForm.tsx` — client component with currentPassword, newPassword, confirmPassword fields; calls `changePasswordAction`
  - [x] 4.5 Rewrite `src/app/dashboard/profile/page.tsx` — fetch real user from DB using `session.id`, render `ProfileEditForm` and `PasswordChangeForm`, remove `@/lib/portal` import

- [x] 5. Owner Edit Listing (Req 4)
  - [x] 5.1 Add `getMyListingByIdAction(id)` to `src/app/actions/listings.ts` — returns listing only if `user_id = session.id`
  - [x] 5.2 Add `updateMyListingAction(id, formData)` to `src/app/actions/listings.ts` — ownership check, updates listing, resets status to 'pending'
  - [x] 5.3 Create `src/components/dashboard/EditListingForm.tsx` — client component, same fields as `NewListingForm`, pre-populated, calls `updateMyListingAction`
  - [x] 5.4 Create `src/app/dashboard/listings/[id]/edit/page.tsx` — server page, fetches listing via `getMyListingByIdAction`, renders `EditListingForm`
  - [x] 5.5 Add "Edit" button/link to each listing row in `src/app/dashboard/listings/page.tsx`

- [x] 6. Inquiry Status Management (Req 5)
  - [x] 6.1 Add `updateInquiryStatusAction(id, status)` to `src/app/actions/listings.ts` — verifies inquiry belongs to a listing owned by session user, updates status
  - [x] 6.2 Create `src/components/dashboard/InquiryStatusButton.tsx` — client component with dropdown (new/contacted/closed), calls `updateInquiryStatusAction`
  - [x] 6.3 Add `InquiryStatusButton` to each inquiry row in `src/app/dashboard/leads/page.tsx`

- [x] 7. Admin — Feature/Unfeature Listings (Req 6)
  - [x] 7.1 Add `toggleFeaturedAction(id)` to `src/app/actions/admin.ts` — requireAdmin(), toggles `featured` boolean, revalidates `/admin/listings` and `/`
  - [x] 7.2 Create `src/components/admin/AdminListingFeatureToggle.tsx` — client component with star icon toggle, calls `toggleFeaturedAction`
  - [x] 7.3 Add `AdminListingFeatureToggle` to each listing row in `src/app/admin/listings/page.tsx`

- [x] 8. Admin — Change User Role (Req 7)
  - [x] 8.1 Add `changeUserRoleAction(id, role)` to `src/app/actions/admin.ts` — requireAdmin(), prevents self-role-change, updates `users.role`
  - [x] 8.2 Create `src/components/admin/AdminUserRoleSelect.tsx` — client component with role select dropdown, calls `changeUserRoleAction`
  - [x] 8.3 Add `AdminUserRoleSelect` to each user row in `src/app/admin/users/page.tsx`

- [x] 9. Buyer Favorites (Req 8)
  - [x] 9.1 Add `toggleFavoriteAction(listingId)` to `src/app/actions/listings.ts` — checks session, inserts or deletes from favorites table
  - [x] 9.2 Add `getMyFavoritesAction()` to `src/app/actions/listings.ts` — returns listings joined with favorites for session.id
  - [x] 9.3 Create `src/components/portal/FavoriteButton.tsx` — client component with heart icon, calls `toggleFavoriteAction`, shows filled/unfilled state
  - [x] 9.4 Add `FavoriteButton` to `src/components/portal/DbListingCard.tsx`
  - [x] 9.5 Add `FavoriteButton` to `src/app/listings/[id]/page.tsx` (listing detail page)
  - [x] 9.6 Rewrite `src/app/favorites/page.tsx` — require auth, call `getMyFavoritesAction()`, render `DbListingCard` grid, show empty state

- [x] 10. Commercial Page — Real Listings (Req 9)
  - [x] 10.1 Rewrite `src/app/commercial/page.tsx` as a full listings page — call `getPublicListingsAction({ asset_class: 'commercial' })`, render `DbListingCard` grid with city/type filters, show empty state

- [x] 11. Agent Profile Pages — Real Data (Req 10)
  - [x] 11.1 Add `getAgentBySlugAction(slug)` to `src/app/actions/admin.ts` — parse id from slug end, query user where `role='agent'`, return user + their active listings
  - [x] 11.2 Rewrite `src/app/agents/[slug]/page.tsx` — call `getAgentBySlugAction`, render real agent data and listings using `DbListingCard`, remove `@/lib/portal` import

- [x] 12. Fix /property/[slug] Route (Req 11)
  - [x] 12.1 Rewrite `src/app/property/[slug]/page.tsx` — parse numeric ID from slug, redirect to `/listings/[id]` if found, else `notFound()`

- [x] 13. Admin Localities Page — Real Data (Req 12)
  - [x] 13.1 Add `getLocalityStatsAction()` to `src/app/actions/admin.ts` — `SELECT city, COUNT(*) FROM listings WHERE status='active' GROUP BY city ORDER BY count DESC`
  - [x] 13.2 Rewrite `src/app/admin/localities/page.tsx` — call `getLocalityStatsAction()`, render city list with listing counts, remove `@/lib/portal` import

- [x] 14. Projects Pages — Polished Static State (Req 13)
  - [x] 14.1 Update `src/app/projects/page.tsx` to add a "Demo data — projects coming soon" banner while keeping mock project cards
  - [x] 14.2 Update `src/app/admin/projects/page.tsx` to show a clear "Project management not yet connected to DB" message, remove mock data rendering

- [x] 15. Account Page — Session-Aware (Req 14)
  - [x] 15.1 Rewrite `src/app/account/page.tsx` — require auth (redirect to `/login` if no session), show real inquiry count (query by buyer_email = session.email), show real favorites count, show user name/email from session, remove `@/lib/portal` import

- [x] 16. Dashboard Saved Searches — Clean Up
  - [x] 16.1 Rewrite `src/app/dashboard/saved-searches/page.tsx` — remove mock `savedSearches` import, show empty state with message "Saved search alerts coming soon"

- [x] 17. Remove All Remaining Mock Data Imports
  - [x] 17.1 Audit all files in `src/app/` for remaining imports from `@/lib/portal` (mock data functions/arrays)
  - [x] 17.2 Remove or replace each remaining mock import identified in the audit
  - [x] 17.3 Verify `src/app/lib/mock-data.ts` is no longer imported by any live page (can be kept as dead code or deleted)
