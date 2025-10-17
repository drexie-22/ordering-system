# Ordering System Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (E-commerce Best Practices) + User-Specified Dark Theme

Drawing inspiration from modern e-commerce platforms (Shopify, Stripe's product pages) while implementing the requested dark + blue gradient aesthetic. The design balances visual appeal for product showcase with functional clarity for order management.

**Key Design Principles:**
- Product-first visual hierarchy with prominent imagery
- Trust-building through clean, professional presentation
- Efficient task completion with clear CTAs
- Seamless guest checkout experience
- Powerful admin tools with dashboard clarity

## Core Design Elements

### A. Color Palette

**Dark Mode Foundation:**
- Background Primary: 222 47% 11% (deep charcoal)
- Background Secondary: 223 39% 15% (slightly lighter panel)
- Background Tertiary: 224 35% 20% (elevated elements)

**Blue Gradient System:**
- Primary Blue: 217 91% 60% (vibrant blue for CTAs)
- Secondary Blue: 221 83% 53% (deeper blue for gradients)
- Gradient Application: Use linear-gradient from 217 91% 60% to 221 83% 53% for hero sections, primary buttons, and key highlights

**Accent Colors:**
- Success: 142 76% 36% (order confirmations, stock available)
- Warning: 38 92% 50% (low stock alerts)
- Error: 0 84% 60% (validation errors)
- Info: 199 89% 48% (informational badges)

**Text Colors:**
- Primary Text: 210 20% 98% (high contrast on dark)
- Secondary Text: 217 10% 70% (muted information)
- Tertiary Text: 215 15% 50% (labels, metadata)

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - for all UI text
- Display: 'Space Grotesk' (Google Fonts) - for headlines and product names

**Type Scale:**
- Hero Headline: text-5xl to text-7xl, font-bold (Space Grotesk)
- Product Name: text-2xl to text-3xl, font-semibold (Space Grotesk)
- Section Headers: text-3xl, font-bold (Space Grotesk)
- Body Text: text-base, font-normal (Inter)
- Small Text: text-sm, font-medium (Inter)
- Metadata: text-xs, text-tertiary (Inter)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Button padding: px-6 py-3 to px-8 py-4

**Container Widths:**
- Main content: max-w-7xl mx-auto
- Product grids: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Admin dashboard: max-w-screen-2xl
- Checkout forms: max-w-2xl mx-auto

### D. Component Library

**Navigation:**
- Fixed header with backdrop-blur-lg, border-b border-white/10
- Logo left, cart icon with badge right
- Search bar centered (desktop), mobile drawer menu
- Admin: Sidebar navigation with icon + label, collapsible on mobile

**Product Cards:**
- Rounded-xl border border-white/10 backdrop-blur-sm
- Image: aspect-square object-cover with rounded-t-xl
- Hover: subtle scale transform and glow effect
- Stock badge: absolute top-4 right-4
- Quick add to cart button overlay on hover

**Cart & Checkout:**
- Sliding cart panel from right (backdrop-blur overlay)
- Item list with thumbnail, name, quantity controls, subtotal
- Sticky checkout summary with gradient background
- Form inputs: rounded-lg with focus:ring-2 ring-blue-500

**Admin Dashboard:**
- Stat cards: grid-cols-1 md:grid-cols-3 with gradient borders
- Data tables: alternating row colors, sticky header
- Action buttons: icon + text, grouped in button groups
- Order status: color-coded badges (Pending: yellow, Preparing: blue, Delivering: purple, Completed: green)

**Buttons:**
- Primary: gradient background (blue gradient), white text, rounded-lg, shadow-lg
- Secondary: border border-blue-500, blue text, rounded-lg
- Outline on images: backdrop-blur-md bg-white/10 border border-white/30
- Icon buttons: rounded-full p-3 hover:bg-white/10

**Forms:**
- Input fields: rounded-lg bg-background-secondary border border-white/20 focus:border-blue-500
- Labels: text-sm font-medium text-secondary mb-2
- Select dropdowns: custom styled to match input aesthetic
- Validation: inline error messages with error color

**Modals & Overlays:**
- Backdrop: bg-black/60 backdrop-blur-sm
- Modal content: rounded-2xl bg-background-secondary p-8
- Toast notifications: fixed top-4 right-4, auto-dismiss, slide-in animation

### E. Visual Elements

**Rounded Corners:**
- Cards & panels: rounded-xl (12px)
- Buttons: rounded-lg (8px)
- Images: rounded-lg to rounded-xl
- Inputs: rounded-lg
- Modals: rounded-2xl

**Shadows:**
- Elevated cards: shadow-xl with subtle blue tint
- Buttons: shadow-lg on hover
- Dropdowns: shadow-2xl
- Product images: shadow-md

**Images:**
- Product images are central to the design
- Hero section: Full-width gradient overlay with featured products or lifestyle imagery
- Product listings: High-quality product photos, square aspect ratio
- Placeholder: Gradient background with icon for missing images
- Admin uploads: Drag-and-drop zones with preview

**Animations:**
- Page transitions: Minimal, fade-in only
- Button interactions: scale-105 on hover
- Cart additions: Subtle bounce animation
- Loading states: Spinning gradient border or pulsing skeleton
- Toast notifications: Slide-in from top-right

### F. Page-Specific Guidelines

**Product Listing (Customer):**
- Hero: Full-width section with gradient overlay, headline "Order Fresh & Fast", search bar
- Filter sidebar (desktop) / drawer (mobile): Categories, price range sliders
- Product grid: 4 columns desktop, 2 tablet, 1 mobile, gap-6
- Empty states: Centered icon, message, "Browse All" CTA

**Cart & Checkout:**
- Cart summary: Right sidebar (desktop) / bottom sheet (mobile)
- Checkout: Two-column layout (form left, order summary right on desktop)
- Progress indicator: Step badges (Cart → Details → Confirmation)
- Payment options: Radio buttons with icons, card-like selection

**Admin Dashboard:**
- Header: Stats overview with gradient cards
- Two-column layout: Orders table (60%), Product management (40%)
- Quick actions: Floating action button for Add Product
- Status filters: Tab-based navigation for order statuses
- Reports: Chart.js visualizations with blue gradient fills

**Order Confirmation:**
- Centered success card with checkmark icon
- Order details in table format
- Print receipt button (outline style)
- Continue shopping CTA (gradient button)

This design system ensures a cohesive, modern dark e-commerce experience that emphasizes products while maintaining excellent usability for both customers and administrators.