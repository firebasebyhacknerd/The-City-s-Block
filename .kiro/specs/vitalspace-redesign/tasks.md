# Implementation Plan: VitalSpace Redesign

## Overview

This implementation plan transforms "The City's Block" homepage into a VitalSpace-inspired real estate platform with enhanced search functionality, locality-based property discovery, and improved user experience. The implementation follows a component-based architecture using Next.js 14+ with TypeScript, React, and Tailwind CSS. The plan focuses on incremental development with testing at each stage to ensure correctness and maintainability.

## Tasks

- [x] 1. Review and refactor core card components
  - [x] 1.1 Review and enhance MetricCard component
    - Ensure MetricCard accepts label and value props
    - Implement consistent typography and spacing
    - Add support for both light and dark tone variants
    - Ensure proper TypeScript types for all props
    - _Requirements: 1.4, 9.4_
  
  - [ ]* 1.2 Write property test for MetricCard structure
    - **Property 14: Metric Cards Consistent Structure**
    - **Validates: Requirements 9.4**
    - Test that any metric data (label and value pair) renders with consistent structure
  
  - [x] 1.3 Review and enhance PropertyCard component (DbListingCard)
    - Ensure PropertyCard displays image, price, location, and key details
    - Implement consistent border radius (rounded-[28px])
    - Add hover feedback with color/opacity changes
    - Ensure proper click navigation to detail page
    - _Requirements: 3.5, 4.5, 9.3, 9.5_
  
  - [ ]* 1.4 Write property test for PropertyCard rendering
    - **Property 4: All Listings Rendered as Property Cards**
    - **Validates: Requirements 3.5, 4.5, 9.3**
    - Test that any listing renders as PropertyCard with required fields
  
  - [ ]* 1.5 Write property test for PropertyCard navigation
    - **Property 5: Card Click Navigation**
    - **Validates: Requirements 3.6, 6.5**
    - Test that clicking any card navigates to correct detail page

- [x] 2. Implement LocalityCard and ProjectCard components
  - [x] 2.1 Review and enhance LocalityCard component
    - Ensure LocalityCard displays name, city, property count, and image
    - Implement consistent border radius (rounded-[28px])
    - Add hover feedback with color/opacity changes
    - Ensure proper click navigation to locality detail page
    - _Requirements: 6.4, 9.2, 9.5_
  
  - [ ]* 2.2 Write property test for LocalityCard fields
    - **Property 10: Locality Cards Include Required Fields**
    - **Validates: Requirements 6.4**
    - Test that any locality renders with name, city, property count, and image
  
  - [x] 2.3 Review and enhance ProjectCard component
    - Ensure ProjectCard displays name, builder, location, pricing, and status
    - Implement consistent border radius (rounded-[28px])
    - Add hover feedback with color/opacity changes
    - _Requirements: 5.4, 9.2, 9.5_
  
  - [ ]* 2.4 Write property test for ProjectCard fields
    - **Property 8: Project Cards Include Required Fields**
    - **Validates: Requirements 5.4**
    - Test that any project renders with all required fields

- [ ] 3. Checkpoint - Ensure all card component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement Hero Section with Search Widget
  - [ ] 4.1 Create Hero Section layout structure
    - Implement dark background (slate-950) with white text
    - Add badge/tag with platform USPs (verified homes, locality insight, better decisions)
    - Add headline and subheading with proper typography
    - Create grid layout for search widget and metric cards
    - _Requirements: 1.1, 1.2, 1.3, 9.1_
  
  - [ ] 4.2 Implement Search Widget form
    - Create form with location text input (placeholder: "Search by city, locality, landmark, or project")
    - Add listing type dropdown (Buy/Rent) defaulting to "Buy"
    - Add asset class dropdown (Residential/Commercial) defaulting to "Residential"
    - Add "Explore Now" button with search icon
    - Implement vertical stacking for mobile devices
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_
  
  - [ ] 4.3 Implement Search Widget form submission
    - Handle form submission to navigate to /search with query parameters
    - Encode location, listing_type, and asset_class as query params
    - _Requirements: 2.5_
  
  - [ ]* 4.4 Write property test for search form navigation
    - **Property 2: Search Form Navigation with Query Parameters**
    - **Validates: Requirements 2.5**
    - Test that any combination of search inputs navigates with correct query params
  
  - [ ] 4.5 Add metric cards grid to Hero Section
    - Display 4 MetricCards: active listings, verified experts, projects, cities
    - Use 2-column grid on mobile, 2-column on tablet/desktop
    - Pass stats data from server action
    - _Requirements: 1.4_
  
  - [ ]* 4.6 Write property test for metric cards rendering
    - **Property 1: Metric Cards Render with Correct Values**
    - **Validates: Requirements 1.4**
    - Test that any valid stats object renders exactly 4 MetricCards with correct values
  
  - [ ] 4.7 Add "Why serious seekers start here" section
    - Create bordered card with 4 benefit statements
    - Use consistent styling with border radius and spacing
    - _Requirements: 1.5_

- [ ] 5. Implement Featured Listings section
  - [ ] 5.1 Create Featured Listings section layout
    - Add section header with eyebrow text, title, and description
    - Implement responsive grid: 4 columns desktop, 2 columns tablet, 1 column mobile
    - Handle empty state with message "No featured listings yet — check back soon"
    - _Requirements: 3.1, 3.3, 3.4_
  
  - [ ] 5.2 Render featured listings as PropertyCards
    - Map over featured listings array
    - Render each listing as DbListingCard component
    - Ensure proper spacing and layout
    - _Requirements: 3.2, 3.5, 3.6_
  
  - [ ]* 5.3 Write property test for featured listings grid layout
    - **Property 3: Featured Listings Responsive Grid Layout**
    - **Validates: Requirements 3.2**
    - Test that any array of featured listings displays correct columns per viewport

- [ ] 6. Checkpoint - Ensure hero and featured sections work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement Commercial Property section
  - [ ] 7.1 Create Commercial section layout
    - Implement grid with informational panel and listings grid
    - Add informational panel with eyebrow, title, description, and benefits
    - Add "View commercial opportunities" CTA button linking to /commercial
    - _Requirements: 4.3, 4.4, 10.2_
  
  - [ ] 7.2 Render commercial listings with display limit
    - Fetch commercial listings from server action
    - Display exactly first 2 commercial listings in grid
    - Render each as DbListingCard component
    - _Requirements: 4.1, 4.2, 4.5_
  
  - [ ]* 7.3 Write property test for commercial listings display limit
    - **Property 6: Commercial Listings Display Limit**
    - **Validates: Requirements 4.2**
    - Test that any array with ≥2 commercial listings displays exactly 2

- [ ] 8. Implement New Projects section
  - [ ] 8.1 Create New Projects section layout
    - Add section header with eyebrow, title, and description
    - Add "Browse all projects" button linking to /projects
    - Implement responsive grid: 3 columns desktop
    - _Requirements: 5.1, 5.2, 10.3_
  
  - [ ] 8.2 Render projects as ProjectCards
    - Map over projects array
    - Render each project as ProjectCard component
    - Ensure proper spacing and layout
    - _Requirements: 5.3, 5.4_
  
  - [ ]* 8.3 Write property test for projects grid layout
    - **Property 7: Projects Grid Layout**
    - **Validates: Requirements 5.3**
    - Test that any array of projects displays 3 columns on desktop viewport

- [ ] 9. Implement Locality Intelligence section
  - [ ] 9.1 Create Locality Intelligence section layout
    - Add section header with eyebrow, title, and description
    - Implement responsive grid: 4 columns desktop, 2 columns tablet, 1 column mobile
    - _Requirements: 6.1, 6.2_
  
  - [ ] 9.2 Render localities as LocalityCards
    - Map over localities array
    - Render each locality as LocalityCard component
    - Ensure proper spacing and layout
    - _Requirements: 6.3, 6.4, 6.5_
  
  - [ ]* 9.3 Write property test for localities grid layout
    - **Property 9: Localities Responsive Grid Layout**
    - **Validates: Requirements 6.3**
    - Test that any array of localities displays correct columns per viewport

- [ ] 10. Checkpoint - Ensure all sections render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement homepage data fetching
  - [ ] 11.1 Review and enhance getHomepageListingsAction
    - Ensure action fetches featured listings from Firebase
    - Ensure action fetches commercial listings from Firebase
    - Ensure action fetches statistics (activeListings, cities)
    - Return object with featured array, commercial array, and stats object
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 11.2 Implement error handling with default values
    - Add try-catch block around data fetching
    - Return empty arrays and default stats on error
    - Log errors for debugging
    - _Requirements: 8.4, 8.5_
  
  - [ ]* 11.3 Write property test for homepage data structure
    - **Property 11: Homepage Data Structure Validation**
    - **Validates: Requirements 8.2, 8.3**
    - Test that any successful fetch returns correct object structure
  
  - [ ]* 11.4 Write property test for error handling
    - **Property 12: Error Handling with Default Values**
    - **Validates: Requirements 8.5**
    - Test that any fetch failure renders with empty arrays and defaults

- [ ] 12. Implement responsive layout system
  - [ ] 12.1 Ensure mobile responsiveness for all grids
    - Verify all grids stack to single column on mobile (<768px)
    - Verify tablet grids display 2 columns (768px-1023px)
    - Verify desktop grids display full columns (≥1024px)
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 12.2 Ensure Hero Section mobile responsiveness
    - Verify Search Widget fields stack vertically on mobile
    - Verify text sizes scale appropriately
    - Test on various mobile viewport sizes
    - _Requirements: 7.4, 7.5_
  
  - [ ]* 12.3 Write integration tests for responsive layouts
    - Test grid layouts at different viewport widths
    - Test Search Widget stacking on mobile
    - Test text scaling across devices

- [ ] 13. Implement visual design consistency
  - [ ] 13.1 Apply consistent border radius across all sections
    - Ensure cards use rounded-[28px]
    - Ensure section containers use rounded-[32px]
    - Verify consistency across all components
    - _Requirements: 9.2_
  
  - [ ] 13.2 Implement hover feedback for interactive elements
    - Add hover states to all buttons
    - Add hover states to all cards
    - Add hover states to all links
    - Use color or opacity changes for feedback
    - _Requirements: 9.5, 10.5_
  
  - [ ]* 13.3 Write property test for consistent border radius
    - **Property 13: Consistent Border Radius Across Sections**
    - **Validates: Requirements 9.2**
    - Test that any section container uses consistent border radius values
  
  - [ ]* 13.4 Write property test for hover feedback
    - **Property 15: Interactive Elements Provide Hover Feedback**
    - **Validates: Requirements 9.5, 10.5**
    - Test that any interactive element provides visual feedback on hover

- [ ] 14. Implement call-to-action elements
  - [ ] 14.1 Verify all CTA buttons are present
    - Verify "Explore Now" button in Search Widget
    - Verify "View commercial opportunities" button in commercial section
    - Verify "Browse all projects" button in projects section
    - _Requirements: 10.1, 10.2, 10.3_
  
  - [ ] 14.2 Ensure CTA buttons have clear, action-oriented text
    - Review all button labels for clarity
    - Ensure consistent button styling
    - Verify hover feedback on all CTAs
    - _Requirements: 10.4, 10.5_

- [ ] 15. Final integration and testing
  - [ ] 15.1 Test complete homepage flow
    - Test data fetching and rendering
    - Test all navigation links
    - Test search form submission
    - Test responsive behavior across devices
    - _Requirements: All_
  
  - [ ]* 15.2 Write end-to-end integration tests
    - Test homepage loads with all sections
    - Test search form submission flow
    - Test card navigation flows
    - Test error handling scenarios
  
  - [ ] 15.3 Verify accessibility compliance
    - Check semantic HTML structure
    - Verify keyboard navigation
    - Test with screen readers
    - Ensure proper ARIA labels where needed

- [ ] 16. Final checkpoint - Ensure all tests pass and homepage is production-ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests and integration tests validate specific examples and edge cases
- The implementation maintains the existing Next.js App Router architecture
- All components use TypeScript for type safety
- Tailwind CSS is used for styling with consistent design tokens
- Firebase Firestore is used for data fetching via server actions
