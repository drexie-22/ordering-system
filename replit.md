# OrderFlow - E-commerce Ordering System

## Overview

OrderFlow is a modern ordering system web application that enables customers to browse products, manage shopping carts, and place orders through a guest-based checkout experience. The platform features a comprehensive admin dashboard for product and order management, with integrated sales reporting capabilities.

The application is built with a React frontend using shadcn/ui components with a dark theme and blue gradient aesthetic, powered by a Node.js/Express backend with SQLite database integration via Prisma ORM. A unique feature includes C++ integration for discount calculations, demonstrating hybrid architecture capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom dark theme configuration
- **Form Handling**: React Hook Form with Zod validation

**Design System:**
- **Theme**: Dark mode by default with blue gradient accent system
- **Color Palette**: Deep charcoal backgrounds (HSL: 222 47% 11%) with vibrant blue primary (217 91% 60%)
- **Typography**: Inter for UI text, Space Grotesk for headlines and product names
- **Component Library**: Comprehensive set of shadcn/ui components (30+ components including dialogs, sheets, forms, tables, etc.)

**Key Pages:**
- Product Listing Page: Displays products with search, filtering by category/price range
- Cart Page: Shopping cart management and checkout form
- Order Success Page: Confirmation page with order details
- Admin Dashboard: Product management, order processing, and analytics
- 404 Not Found page

**Local Storage Strategy:**
- Cart data persisted in localStorage for guest checkout experience
- Cart syncs automatically on item changes
- Cart cleared after successful order placement

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **ORM**: Prisma ORM
- **Database**: SQLite (local file-based database for development)
- **Build Tool**: esbuild for production bundling
- **Development**: tsx for TypeScript execution

**API Design:**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Centralized error handling middleware
- Request logging with duration tracking

**Key API Endpoints:**
- `GET /api/products` - List all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/orders` - Create order with items
- `GET /api/orders` - List all orders (admin)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)
- `GET /api/reports` - Get sales analytics (admin)
- `POST /api/calculate-discount` - Calculate discounts via C++ module

**C++ Integration:**
- Price calculation module executed via child_process spawn
- Fallback to JavaScript calculation if C++ module fails
- Discount logic: 10% off orders over 1000 currency units

### Database Architecture

**ORM Configuration:**
- Prisma ORM with SQLite provider
- Schema-first approach with TypeScript type generation via Prisma Client
- Migration system using Prisma Migrate
- File-based database (dev.db) for local development

**Database Schema:**

**Products Table:**
- `id`: Auto-incrementing primary key
- `name`: Product name
- `description`: Product description
- `price`: Decimal price
- `category`: Category classification
- `imageUrl`: Product image URL
- `stock`: Integer stock quantity
- `createdAt`: Timestamp

**Orders Table:**
- `id`: Auto-incrementing primary key
- `customerName`: Customer full name
- `contact`: Contact number
- `address`: Delivery address
- `paymentMethod`: Payment method choice
- `totalAmount`: Order total
- `status`: Order status (Pending/Preparing/Out for Delivery/Completed)
- `createdAt`: Timestamp

**Order Items Table:**
- `id`: Auto-incrementing primary key
- `orderId`: Foreign key to orders
- `productId`: Foreign key to products
- `quantity`: Item quantity
- `subtotal`: Line item total

**Data Relationships:**
- Products → Order Items (one-to-many)
- Orders → Order Items (one-to-many)
- Prisma relations configured with foreign keys and referential integrity

**Stock Management:**
- Automatic stock deduction on order placement
- Low stock indicators (≤5 items)
- Out of stock prevention in UI

### External Dependencies

**Database Service:**
- **SQLite**: Lightweight, file-based relational database
- Connection via `DATABASE_URL` environment variable (set to `file:./dev.db`)
- No connection pooling needed for file-based database

**UI Component Libraries:**
- **Radix UI**: Headless UI primitives (@radix-ui/react-*)
- **shadcn/ui**: Pre-styled component system
- **Lucide React**: Icon library
- **cmdk**: Command palette component

**Form & Validation:**
- **React Hook Form**: Form state management
- **Zod**: Schema validation and API request/response validation
- **@hookform/resolvers**: Zod integration for forms
- **Prisma Client**: Auto-generated TypeScript types from database schema

**Utility Libraries:**
- **date-fns**: Date formatting and manipulation
- **clsx & tailwind-merge**: Conditional className handling
- **class-variance-authority**: Component variant system

**Development Tools:**
- **Vite**: Frontend build tool and dev server
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner
- **TypeScript**: Type safety across frontend and backend

**Image Hosting:**
- Unsplash CDN for product images
- URLs stored directly in database

**Google Fonts:**
- Inter (UI typography)
- Space Grotesk (Display typography)
- Loaded via Google Fonts CDN

**Admin Authentication:**
- Simple passcode-based access control (client-side)
- No complex authentication system implemented
- Future consideration for proper auth integration