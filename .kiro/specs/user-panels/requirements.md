# Requirements Document

## Introduction

This feature delivers role-specific dashboard panels for all four user types on The City's Blocks real estate platform. Three distinct panel experiences are required:

1. **Admin Panel** — enhances the existing `/admin/*` area with a responsive mobile sidebar, a database-connected Projects page, an in-app notification system, and bulk operations on listings and users.
2. **Broker Panel** — upgrades the existing `/dashboard/*` area for `agent` and `owner` roles with performance analytics, a client pipeline view, and role-differentiated navigation and content.
3. **Customer Panel** — creates a full `/dashboard/*` experience for `buyer` role users, covering saved searches, inquiry history, favorites management, and profile settings.

All panels share the existing JWT-based session system (`getSession()`), PostgreSQL database via Neon, and the Next.js App Router with React Server Components and Server Actions.

---

## Glossary

- **Admin_Panel**: The authenticated area at `/admin/*` accessible only to users with `role = 'admin'`.
- **Broker_Panel**: The authenticated area at `/dashboard/*` accessible to users with `role = 'agent'` or `role = 'owner'`.
- **Customer_Panel**: The authenticated area at `/dashboard/*` accessible to users with `role = 'buyer'`.
- **AdminShell**: The existing sidebar layout component used by the Admin Panel.
- **PanelShell**: The existing two-column sidebar layout component used by the Broker Panel.
- **Session**: The JWT cookie-based authentication token managed by `getSession()` / `createSession()`.
- **Listing**: A property record in the `listings` database table with fields including `status`, `user_id`, `featured`, `city`, `price`, etc.
- **Inquiry**: A buyer contact record in the `inquiries` database table linked to a `listing_id`.
- **Favorite**: A saved listing record in the `favorites` database table linking `user_id` to `listing_id`.
- **Saved_Search**: A persisted set of search filter criteria linked to a `user_id`, to be stored in a new `saved_searches` database table.
- **Notification**: An in-app alert record linked to a `user_id`, to be stored in a new `notifications` database table.
- **Project**: A real estate development project record in the `projects` database table (to be created).
- **Broker**: A user with `role = 'agent'` or `role = 'owner'`.
- **Agent**: A user with `role = 'agent'` — represents a licensed real estate professional.
- **Owner**: A user with `role = 'owner'` — represents a private property owner.
- **Buyer**: A user with `role = 'buyer'` — represents a property seeker with no listing privileges.
- **Bulk_Operation**: An admin action applied simultaneously to multiple selected records.
- **Pipeline**: A Kanban-style view of inquiries grouped by status (`new`, `contacted`, `closed`).

---

## Requirements

### Requirement 1: Role-Based Panel Routing

**User Story:** As a platform user, I want to be redirected to the correct panel for my role after signing in, so that I land on a page relevant to my account type.

#### Acceptance Criteria

1. WHEN a user with `role = 'admin'` accesses `/dashboard`, THE Router SHALL redirect the user to `/admin`.
2. WHEN a user with `role = 'agent'` or `role = 'owner'` accesses `/dashboard`, THE Router SHALL render the Broker_Panel dashboard.
3. WHEN a user with `role = 'buyer'` accesses `/dashboard`, THE Router SHALL render the Customer_Panel dashboard.
4. WHEN an unauthenticated user accesses `/dashboard` or `/admin`, THE Router SHALL redirect the user to `/login`.
5. WHEN a user with `role = 'buyer'` accesses `/admin`, THE Router SHALL redirect the user to `/dashboard`.
6. WHEN a user with `role = 'agent'` or `role = 'owner'` accesses `/admin`, THE Router SHALL redirect the user to `/dashboard`.

---

### Requirement 2: Admin Panel — Responsive Mobile Sidebar

**User Story:** As an admin, I want to access the admin navigation on mobile devices, so that I can manage the platform from any screen size.

#### Acceptance Criteria

1. THE AdminShell SHALL render a hamburger menu button visible only on screens narrower than the `lg` Tailwind breakpoint (1024px).
2. WHEN the hamburger button is activated, THE AdminShell SHALL display the navigation sidebar as a full-height overlay drawer.
3. WHEN a navigation link inside the drawer is activated, THE AdminShell SHALL close the drawer.
4. WHEN the overlay backdrop outside the drawer is activated, THE AdminShell SHALL close the drawer.
5. WHILE the drawer is open, THE AdminShell SHALL prevent the page body from scrolling.
6. THE AdminShell SHALL render the existing desktop sidebar unchanged on screens at or wider than the `lg` breakpoint.

---

### Requirement 3: Admin Panel — Projects Page Connected to Database

**User Story:** As an admin, I want to create, edit, and publish real estate development projects from the admin panel, so that project listings are managed from a single interface.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a Projects page at `/admin/projects` accessible only to users with `role = 'admin'`.
2. WHEN the Projects page loads, THE Admin_Panel SHALL display all project records from the `projects` database table ordered by `created_at` descending.
3. THE Admin_Panel SHALL provide a form to create a new project with fields: `name` (required), `developer`, `city` (required), `locality`, `description`, `status` (draft/published), and `image_url`.
4. WHEN a valid project creation form is submitted, THE Projects_Action SHALL insert a new record into the `projects` table and revalidate the Projects page.
5. IF the project creation form is submitted with a missing required field, THEN THE Projects_Action SHALL return an error message identifying the missing field without inserting a record.
6. THE Admin_Panel SHALL provide an edit form pre-populated with existing project data for each project record.
7. WHEN a valid project edit form is submitted, THE Projects_Action SHALL update the corresponding record in the `projects` table and revalidate the Projects page.
8. WHEN a project delete action is confirmed, THE Projects_Action SHALL delete the corresponding record from the `projects` table and revalidate the Projects page.
9. WHEN a project's `status` is set to `published`, THE Projects_Action SHALL make the project visible on the public `/projects` page.

---

### Requirement 4: In-App Notification System

**User Story:** As a platform user, I want to receive in-app browser notifications for key events relevant to my role, so that I can act on them without manually checking each section. Email notifications are out of scope for this phase.

#### Acceptance Criteria

1. THE Admin_Panel SHALL display a notification bell icon in the top bar showing the count of unread notifications.
2. WHEN the notification bell is activated, THE Admin_Panel SHALL display a dropdown list of the 20 most recent notifications ordered by `created_at` descending.
3. WHEN a new listing is submitted with `status = 'pending'`, THE Notification_System SHALL insert a notification record into the `notifications` table with `type = 'listing_pending'` and a reference to the listing, targeted at all users with `role = 'admin'`.
4. WHEN a new user registers, THE Notification_System SHALL insert a notification record into the `notifications` table with `type = 'user_registered'`, targeted at all users with `role = 'admin'`.
5. WHEN a new inquiry is submitted on a broker's listing, THE Notification_System SHALL insert a notification record into the `notifications` table with `type = 'inquiry_received'` targeted at the listing's `user_id` (the broker).
6. THE Broker_Panel SHALL display a notification bell icon in the panel top bar showing the count of unread broker notifications.
7. WHEN the broker's notification bell is activated, THE Broker_Panel SHALL display a dropdown list of the 20 most recent notifications for that broker ordered by `created_at` descending.
8. WHEN a notification item in the dropdown is activated, THE Notification_System SHALL mark the notification as read and navigate the user to the relevant page.
9. WHEN the "Mark all as read" control is activated, THE Notification_System SHALL set `read = TRUE` for all notifications belonging to the current user.
10. THE notification bell SHALL display the unread count as zero when all notifications have been read.
11. IF no notifications exist for the current user, THEN THE notification dropdown SHALL display an empty state message.
12. All notifications are browser-in-app only; email delivery SHALL NOT be implemented in this phase.

---

### Requirement 5: Admin Panel — Bulk Operations

**User Story:** As an admin, I want to select multiple listings or users and apply actions to all of them at once, so that I can manage large volumes of records efficiently.

#### Acceptance Criteria

1. THE Admin_Panel listings page SHALL provide a checkbox on each listing row to select individual records.
2. THE Admin_Panel listings page SHALL provide a "select all" checkbox that selects or deselects all visible listing records.
3. WHEN one or more listing records are selected, THE Admin_Panel SHALL display a bulk action toolbar with options: "Approve", "Reject", and "Delete".
4. WHEN the bulk "Approve" action is confirmed, THE Bulk_Operation SHALL set `status = 'active'` and `verified = TRUE` for all selected listings and revalidate the listings page.
5. WHEN the bulk "Reject" action is confirmed with a reason, THE Bulk_Operation SHALL set `status = 'rejected'` and `rejection_reason` for all selected listings and revalidate the listings page.
6. WHEN the bulk "Delete" action is confirmed, THE Bulk_Operation SHALL delete all selected listing records and revalidate the listings page.
7. THE Admin_Panel users page SHALL provide a checkbox on each user row to select individual records.
8. WHEN one or more user records are selected, THE Admin_Panel SHALL display a bulk action toolbar with options: "Verify" and "Ban".
9. WHEN the bulk "Verify" action is confirmed, THE Bulk_Operation SHALL set `verified = TRUE` for all selected users and revalidate the users page.
10. WHEN the bulk "Ban" action is confirmed, THE Bulk_Operation SHALL set `banned = TRUE` for all selected users and revalidate the users page.
11. IF a bulk destructive action (Delete, Ban) is triggered, THEN THE Admin_Panel SHALL display a confirmation dialog before executing the operation.

---

### Requirement 6: Broker Panel — Performance Analytics

**User Story:** As a broker, I want to see performance metrics for my listings, so that I can understand how my portfolio is performing on the platform.

#### Acceptance Criteria

1. THE Broker_Panel dashboard SHALL display the following metrics computed from the broker's own listings and inquiries: total active listings, total pending listings, total inquiries received, and new inquiries (status = 'new') in the last 30 days.
2. WHEN the Broker_Panel dashboard loads, THE Analytics_Action SHALL query the `listings` and `inquiries` tables filtered by the authenticated user's `id`.
3. THE Broker_Panel SHALL display a per-listing inquiry count alongside each listing in the listings view.
4. WHEN a broker has zero listings, THE Broker_Panel SHALL display an empty state with a prompt to post the first listing.
5. THE Broker_Panel SHALL display the broker's account verification status prominently on the dashboard overview.

---

### Requirement 7: Broker Panel — Client Pipeline View

**User Story:** As a broker, I want to view my inquiries grouped by status in a pipeline layout, so that I can track where each lead is in the sales process.

#### Acceptance Criteria

1. THE Broker_Panel SHALL provide a Pipeline page at `/dashboard/pipeline` accessible to users with `role = 'agent'` or `role = 'owner'`.
2. WHEN the Pipeline page loads, THE Broker_Panel SHALL display the broker's inquiries grouped into three columns: "New", "Contacted", and "Closed".
3. WHEN an inquiry's status is updated via the existing `updateInquiryStatusAction`, THE Broker_Panel SHALL move the inquiry card to the corresponding column without a full page reload.
4. EACH inquiry card in the Pipeline SHALL display: buyer name, buyer phone, buyer email, associated listing title, and the date the inquiry was received.
5. IF a broker has no inquiries in a pipeline column, THEN THE Broker_Panel SHALL display an empty state message within that column.

---

### Requirement 8: Broker Panel — Role Differentiation (Agent vs Owner)

**User Story:** As a platform operator, I want agents and owners to see role-appropriate labels and guidance in their panel, so that the experience reflects their distinct relationship to listings.

#### Acceptance Criteria

1. WHEN a user with `role = 'agent'` views the Broker_Panel, THE Broker_Panel SHALL label the leads section "Client Inquiries" and display the panel subtitle as "Agent Dashboard".
2. WHEN a user with `role = 'owner'` views the Broker_Panel, THE Broker_Panel SHALL label the leads section "Buyer Inquiries" and display the panel subtitle as "Owner Dashboard".
3. THE Broker_Panel navigation SHALL include the Pipeline page link for both `agent` and `owner` roles.
4. THE Broker_Panel SHALL display the user's role badge (Agent or Owner) on the profile page.

---

### Requirement 9: Customer Panel — Dashboard Overview

**User Story:** As a buyer, I want a personal dashboard that shows my activity on the platform, so that I can manage my property search from one place.

#### Acceptance Criteria

1. WHEN a user with `role = 'buyer'` accesses `/dashboard`, THE Customer_Panel SHALL render a dashboard overview page instead of redirecting.
2. THE Customer_Panel dashboard SHALL display the following summary counts: saved listings (favorites), submitted inquiries, and saved searches.
3. THE Customer_Panel SHALL provide navigation links to: Saved Listings, Inquiries, Saved Searches, and Profile.
4. WHEN a buyer has no activity, THE Customer_Panel SHALL display a welcome message with prompts to start searching.

---

### Requirement 10: Customer Panel — Inquiry History

**User Story:** As a buyer, I want to view all the inquiries I have submitted, so that I can track which properties I have contacted and their current status.

#### Acceptance Criteria

1. THE Customer_Panel SHALL provide an Inquiries page at `/dashboard/inquiries` accessible only to users with `role = 'buyer'`.
2. WHEN the Inquiries page loads, THE Customer_Panel SHALL display all inquiries submitted by the authenticated buyer, ordered by `created_at` descending.
3. THE Customer_Panel SHALL query inquiries by matching `buyer_email` to the authenticated user's email address.
4. EACH inquiry record displayed SHALL include: the listing title, the message sent, the inquiry date, and the current status.
5. IF the buyer has submitted no inquiries, THEN THE Customer_Panel SHALL display an empty state message with a link to the property search page.

---

### Requirement 11: Customer Panel — Favorites Management

**User Story:** As a buyer, I want to manage my saved listings from my dashboard, so that I can review and remove properties I am no longer interested in.

#### Acceptance Criteria

1. THE Customer_Panel SHALL provide a Saved Listings page at `/dashboard/favorites` accessible only to users with `role = 'buyer'`.
2. WHEN the Saved Listings page loads, THE Customer_Panel SHALL display all listings saved by the authenticated buyer using `getMyFavoritesAction`.
3. THE Customer_Panel SHALL display each saved listing as a card showing: listing title, city, price, property type, and a remove button.
4. WHEN the remove button for a saved listing is activated, THE Customer_Panel SHALL call `toggleFavoriteAction` to remove the listing from favorites and update the displayed list without a full page reload.
5. IF the buyer has no saved listings, THEN THE Customer_Panel SHALL display an empty state message with a link to the property search page.

---

### Requirement 12: Customer Panel — Saved Searches

**User Story:** As a buyer, I want to save my search filters so that I can quickly re-run them from my dashboard. Email alerts for new matching listings will be configured in a future phase.

#### Acceptance Criteria

1. THE Customer_Panel SHALL provide a Saved Searches page at `/dashboard/saved-searches` accessible only to users with `role = 'buyer'`.
2. THE Search_Page SHALL provide a "Save this search" button when a buyer is authenticated and has active filters applied.
3. WHEN the "Save this search" button is activated, THE Saved_Search_Action SHALL insert a record into the `saved_searches` table with the current filter criteria and the authenticated user's `id`.
4. WHEN the Saved Searches page loads, THE Customer_Panel SHALL display all saved searches belonging to the authenticated buyer.
5. EACH saved search record displayed SHALL include: the search label or filter summary, the date saved, and a delete button.
6. WHEN the delete button for a saved search is activated, THE Saved_Search_Action SHALL delete the corresponding record from the `saved_searches` table and update the displayed list.
7. IF the buyer has no saved searches, THEN THE Customer_Panel SHALL display an empty state message with a link to the property search page.
8. THE Saved_Search_Action SHALL require an authenticated session; IF no session exists, THEN THE Saved_Search_Action SHALL return an error without modifying the database.
9. Email alerts for saved searches are out of scope for this phase and SHALL NOT be implemented.

---

### Requirement 13: Customer Panel — Profile Settings

**User Story:** As a buyer, I want to update my profile information and change my password from my dashboard, so that I can keep my account details current.

#### Acceptance Criteria

1. THE Customer_Panel SHALL provide a Profile page at `/dashboard/profile` accessible only to users with `role = 'buyer'`.
2. THE Customer_Panel Profile page SHALL display the buyer's current name, email, phone, and city in an editable form.
3. WHEN a valid profile update form is submitted, THE Customer_Panel SHALL call `updateProfileAction` and display a success message.
4. IF the profile update form is submitted with an empty name field, THEN THE Customer_Panel SHALL display a validation error without submitting the form.
5. THE Customer_Panel Profile page SHALL include a password change form using the existing `changePasswordAction`.
6. THE Customer_Panel SHALL display the buyer's account verification status as a read-only badge on the Profile page.

---

### Requirement 14: Panel Shell Consistency

**User Story:** As a platform operator, I want all three panels to use a consistent layout shell, so that the UI is coherent and maintainable.

#### Acceptance Criteria

1. THE Admin_Panel SHALL continue to use the AdminShell component with the desktop sidebar layout.
2. THE Broker_Panel SHALL use the PanelShell component for all pages within `/dashboard/*` when the role is `agent` or `owner`.
3. THE Customer_Panel SHALL use the PanelShell component for all pages within `/dashboard/*` when the role is `buyer`.
4. WHERE the Customer_Panel is active, THE PanelShell SHALL render navigation items specific to the buyer role: Overview, Saved Listings, Inquiries, Saved Searches, and Profile.
5. WHERE the Broker_Panel is active, THE PanelShell SHALL render navigation items specific to the broker role: Overview, Listings, Pipeline, Leads, Saved Searches, and Profile.
6. THE PanelShell SHALL accept a `role` prop to conditionally render role-appropriate titles and navigation items.
