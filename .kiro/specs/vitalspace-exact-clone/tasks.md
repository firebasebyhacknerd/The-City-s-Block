# Tasks: VitalSpace Exact Clone Homepage

## Phase 1: Project Setup and Configuration

### 1.1 Initial Setup
- [x] 1.1.1 Review existing Next.js project structure and dependencies
- [x] 1.1.2 Install additional required dependencies (if any)
- [ ] 1.1.3 Configure Tailwind CSS with VitalSpace color scheme (red-600 primary, white bg)
- [x] 1.1.4 Set up TypeScript types and interfaces for homepage data models
- [x] 1.1.5 Create utility functions for formatting (price, currency)

### 1.2 Asset Preparation
- [ ] 1.2.1 Add hero banner background image to public/images/
- [ ] 1.2.2 Add promotional banner image to public/images/
- [x] 1.2.3 Project images sourced from Unsplash (already in mock data)
- [x] 1.2.4 Next.js Image optimization already configured in next.config.ts

## Phase 2: Core Components Development

### 2.1 Top Navigation Bar Component
- [ ] 2.1.1 Redesign Navbar to match VitalSpace: logo left, Buy/Sell/Explore/New Projects nav, icons
- [ ] 2.1.2 Add secondary tab row: Top Builder | Popular Projects | Top Localities
- [x] 2.1.3 Sticky positioning already implemented
- [ ] 2.1.4 Implement mobile hamburger menu
- [ ] 2.1.5 Change navbar style to white bg, border-bottom, VitalSpace layout

### 2.2 Hero Banner Component
- [x] 2.2.1 HeroSearch component created at src/components/home/HeroSearch.tsx
- [x] 2.2.2 Location input field implemented
- [x] 2.2.3 BHK selector implemented
- [x] 2.2.4 Budget range selector implemented
- [x] 2.2.5 Possession status dropdown implemented
- [x] 2.2.6 Property Type dropdown implemented
- [x] 2.2.7 Search button with icon implemented
- [x] 2.2.8 Popular localities clickable links implemented
- [x] 2.2.9 Search form submission and navigation implemented
- [ ] 2.2.10 Wire HeroSearch into homepage with full-bleed banner background image
- [ ] 2.2.11 Add "Explore 1000+ Verified Properties" headline over banner
- [ ] 2.2.12 Make hero banner fully responsive for mobile

### 2.3 Find Your Next Home Section
- [ ] 2.3.1 Create FindYourHomeSection with two cards: "New projects" and "Owner listings"
- [ ] 2.3.2 Each card: icon, title, description, "Explore" button
- [ ] 2.3.3 Responsive grid (side-by-side desktop, stacked mobile)
- [ ] 2.3.4 Hover effects on cards

### 2.4 Trending Project Card Component
- [x] 2.4.1 TrendingProjectCard component created at src/components/home/TrendingProjectCard.tsx
- [x] 2.4.2 Project image with Next.js Image implemented
- [x] 2.4.3 Project name and builder name display implemented
- [x] 2.4.4 BHK configurations display implemented
- [x] 2.4.5 Location with MapPin icon implemented
- [x] 2.4.6 Price range with formatting implemented
- [x] 2.4.7 Hover effects (shadow, scale) implemented
- [x] 2.4.8 Clickable Link component implemented

### 2.5 Trending Projects Section
- [x] 2.5.1 TrendingProjectCard component ready
- [ ] 2.5.2 Create TrendingProjectsSection wrapper with "Trending Projects" header + "See All" link
- [ ] 2.5.3 Implement horizontal scrollable row of TrendingProjectCards
- [ ] 2.5.4 Wire into homepage with real projects data

## Phase 3: Additional Sections

### 3.1 Promotional Banner Component
- [ ] 3.1.1 Create PromotionalBanner component (full-width clickable image)
- [ ] 3.1.2 Add banner image and link it to /projects
- [ ] 3.1.3 Ensure responsive aspect ratio

### 3.2 Explore by Localities Section
- [x] 3.2.1 LocalityTabs component created at src/components/home/LocalityTabs.tsx
- [x] 3.2.2 Tabbed interface with active/inactive states implemented
- [x] 3.2.3 Tab switching logic implemented
- [x] 3.2.4 Project links grid per tab implemented
- [x] 3.2.5 Hover styles on links implemented
- [ ] 3.2.6 Wire LocalityTabs into homepage with real locality + project data
- [ ] 3.2.7 Add section title "Explore New Project by Localities"

### 3.3 Property Options Section
- [x] 3.3.1 PropertyLinksSection component created at src/components/home/PropertyLinksSection.tsx
- [x] 3.3.2 PropertySubsection component with expand/collapse implemented
- [x] 3.3.3 "+X more" expandable functionality implemented
- [x] 3.3.4 Responsive flex-wrap link layout implemented
- [ ] 3.3.5 Wire PropertyLinksSection into homepage with all subsection data:
  - Popular BHK Searches
  - Popular Flat Searches
  - Budget wise Searches
  - Popular 2/3/4/5 BHK Searches
  - Popular Residential / Luxury / Property Searches
  - Ready To Move / New Launch Searches
  - List Property links
  - Popular Real Estate Searches
  - Trending Searches
- [ ] 3.3.6 Add section title "Property Options"

### 3.4 FAQ Section
- [ ] 3.4.1 Create FAQSection component using shadcn/ui Accordion
- [ ] 3.4.2 Add FAQ data (7–8 questions about the portal)
- [ ] 3.4.3 Style accordion to match VitalSpace (clean, minimal)
- [ ] 3.4.4 Wire into homepage

### 3.5 Footer Component
- [ ] 3.5.1 Redesign SiteFooter to match VitalSpace layout:
  - Logo + description + RERA number
  - Navigation links row
  - Phone + email contact
  - Social media icons (Facebook, Instagram, LinkedIn, Twitter, YouTube)
  - Copyright notice
- [ ] 3.5.2 Style with dark/neutral background, light text
- [ ] 3.5.3 Responsive layout

## Phase 4: Homepage Assembly

### 4.1 Rebuild src/app/page.tsx
- [ ] 4.1.1 Replace current homepage with VitalSpace-style layout in this order:
  1. Hero banner with HeroSearch
  2. "Find your next home" two-card section
  3. Trending Projects horizontal scroll
  4. Promotional banner
  5. Explore by Localities (LocalityTabs)
  6. Property Options (PropertyLinksSection)
  7. FAQ Section
- [ ] 4.1.2 Pass real data (projects, localities) to each section
- [ ] 4.1.3 Add proper section spacing and container widths matching VitalSpace

### 4.2 Rebuild Navbar
- [ ] 4.2.1 Replace current Navbar with VitalSpace-style navbar
- [ ] 4.2.2 Keep auth logic (sign in / sign out / dashboard) intact

### 4.3 Rebuild Footer
- [ ] 4.3.1 Replace current SiteFooter with VitalSpace-style footer

## Phase 5: Styling Polish

### 5.1 Global Styles
- [ ] 5.1.1 Remove dark radial gradient background from layout.tsx
- [ ] 5.1.2 Set clean white page background
- [ ] 5.1.3 Ensure consistent section padding (py-12 md:py-16)
- [ ] 5.1.4 Max container width 1280px, horizontal padding 16px/32px

### 5.2 Visual Polish
- [ ] 5.2.1 Verify red-600 used consistently as primary accent
- [ ] 5.2.2 Cards: white bg, border-gray-100, rounded-xl, subtle shadow
- [ ] 5.2.3 Section headings: text-2xl font-bold text-gray-900
- [ ] 5.2.4 Hover transitions on all interactive elements

### 5.3 Responsive Check
- [ ] 5.3.1 Mobile (320px–767px): single column, stacked search filters
- [ ] 5.3.2 Tablet (768px–1023px): 2-column grids
- [ ] 5.3.3 Desktop (1024px+): full layout

## Phase 6: Build & Deploy

### 6.1 Build Verification
- [ ] 6.1.1 Run `npm run build` — zero errors
- [ ] 6.1.2 Fix any TypeScript or lint errors
- [ ] 6.1.3 Verify all pages still render (no regressions)

### 6.2 Deployment
- [ ] 6.2.1 Commit all changes with message "feat: VitalSpace exact clone homepage"
- [ ] 6.2.2 Run `vercel --prod --yes` to deploy to production
- [ ] 6.2.3 Verify live URL matches VitalSpace.in layout
- [ ] 6.2.4 Smoke test: search, project click, locality tab, FAQ expand

## Notes
- Primary accent color: red-600 (matches VitalSpace)
- Font: keep existing Manrope (body) — clean sans-serif matches VitalSpace
- All new components live in src/components/home/
- Navbar and Footer are updated in-place (src/components/layout/)
- Homepage is rebuilt at src/app/page.tsx
- No new npm packages needed — shadcn Accordion already available
