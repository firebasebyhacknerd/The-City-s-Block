# Design Document: VitalSpace Redesign

## Overview

This comprehensive redesign transforms "The City's Block" into a VitalSpace-inspired real estate platform with a focus on clean, modern UI/UX, enhanced search functionality, and locality-based property discovery. The redesign maintains the existing Next.js 14+ architecture with TypeScript and Tailwind CSS while completely overhauling the visual design system, component structure, and user experience to match VitalSpace's professional, user-friendly approach.

The redesign encompasses the entire application including homepage hero section, navigation structure, property listings, search functionality, locality-based browsing, and mobile responsiveness. Key improvements include a prominent location-based search with popular localities as quick links, card-based layouts with high-quality imagery, tabbed locality exploration, comprehensive filter system, and WhatsApp integration for seamless communication.

## Architecture

The redesign follows a component-based architecture leveraging Next.js App Router with server and client components, maintaining separation of concerns between presentation, business logic, and data access layers.

```mermaid
graph TD
    A[App Router Pages] --> B[Layout Components]
    A --> C[Feature Components]
    B --> D[Navbar]
    B --> E[Footer]
    B --> F[SearchBar]
    C --> G[Hero Section]
    C --> H[Property Cards]
    C --> I[Locality Browser]
    C --> J[Filter System]
    G --> K[Search Widget]
    H --> L[Card Components]
    I --> M[Tabbed Interface]
    J --> N[Filter Controls]
    K --> O[Firebase Backend]
    L --> O
    M --> O
    N --> O
    O --> P[Property Data]
    O --> Q[Locality Data]
    O --> R[User Data]


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Metric Cards Render with Correct Values

*For any* valid stats object containing activeListings and cities counts, the Hero_Section SHALL render exactly 4 Metric_Cards displaying the correct values for active listings, verified experts, projects, and cities.

**Validates: Requirements 1.4**

### Property 2: Search Form Navigation with Query Parameters

*For any* combination of location text, listing type selection, and asset class selection in the Search_Widget, submitting the form SHALL navigate to the search results page with those values correctly encoded as query parameters.

**Validates: Requirements 2.5**

### Property 3: Featured Listings Responsive Grid Layout

*For any* array of featured listings and any viewport width, the featured listings grid SHALL display 4 columns on desktop (≥1024px), 2 columns on tablet (768px-1023px), and 1 column on mobile (<768px).

**Validates: Requirements 3.2**

### Property 4: All Listings Rendered as Property Cards

*For any* listing (featured or commercial) in the displayed array, it SHALL be rendered as a Property_Card component with image, price, location, and key details.

**Validates: Requirements 3.5, 4.5, 9.3**

### Property 5: Card Click Navigation

*For any* card component (Property_Card or Locality_Card) with a valid ID or slug, clicking the card SHALL navigate to the corresponding detail page with the correct URL path.

**Validates: Requirements 3.6, 6.5**

### Property 6: Commercial Listings Display Limit

*For any* array of commercial listings with size greater than or equal to 2, the commercial section SHALL display exactly the first 2 listings in the grid layout.

**Validates: Requirements 4.2**

### Property 7: Projects Grid Layout

*For any* array of projects, the new projects section SHALL display Project_Cards in a grid with 3 columns on desktop viewport (≥1024px).

**Validates: Requirements 5.3**

### Property 8: Project Cards Include Required Fields

*For any* project in the displayed array, it SHALL be rendered as a Project_Card component that includes name, builder, location, pricing, and status fields.

**Validates: Requirements 5.4**

### Property 9: Localities Responsive Grid Layout

*For any* array of localities and any viewport width, the locality grid SHALL display 4 columns on desktop (≥1024px), 2 columns on tablet (768px-1023px), and 1 column on mobile (<768px).

**Validates: Requirements 6.3**

### Property 10: Locality Cards Include Required Fields

*For any* locality in the displayed array, it SHALL be rendered as a Locality_Card component that includes name, city, property count, and representative image.

**Validates: Requirements 6.4**

### Property 11: Homepage Data Structure Validation

*For any* successful homepage data fetch, the returned object SHALL contain a featured listings array, a commercial listings array, and a stats object with activeListings and cities counts.

**Validates: Requirements 8.2, 8.3**

### Property 12: Error Handling with Default Values

*For any* homepage data fetch failure, the page SHALL render with empty arrays for featured and commercial listings and default values for statistics.

**Validates: Requirements 8.5**

### Property 13: Consistent Border Radius Across Sections

*For any* section container element on the homepage, it SHALL use consistent border radius values (rounded-[28px] for cards, rounded-[32px] for sections).

**Validates: Requirements 9.2**

### Property 14: Metric Cards Consistent Structure

*For any* metric data (label and value pair), the rendered Metric_Card SHALL display both label and value with consistent typography and spacing.

**Validates: Requirements 9.4**

### Property 15: Interactive Elements Provide Hover Feedback

*For any* interactive element (buttons, cards, links) on the homepage, hovering SHALL provide visual feedback through color or opacity changes.

**Validates: Requirements 9.5, 10.5**
