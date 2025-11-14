# Arts Consolidated E-Commerce

> Modern e-commerce platform built with Next.js 15, React 19, and cutting-edge web technologies

**Live Demo:** https://arts-shop-phi.vercel.app/

Built for the Arts Consolidated frontend developer assignment.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

**Requirements:** Node.js 20+

---

## 🛠️ Tech Stack

- **Next.js 15** - App Router, Turbopack, async request APIs
- **React 19** - View Transitions, useOptimistic, useFormStatus, use() hook
- **TypeScript** - Strict mode with full type safety
- **Tailwind CSS v4** - Latest major version with PostCSS
- **DaisyUI v5** - 14 theme options with dark mode support
- **Zustand** - Minimal state management with localStorage persistence
- **Zod** - Runtime API validation and type inference
- **nuqs** - Type-safe URL state management

---

## ✨ Key Features

- **Server-Side Filtering** - Uses DummyJSON API endpoints for search/category filtering
- **Persistent Shopping Cart** - Zustand with localStorage, survives page refreshes
- **React 19 Experimental Features:**
    - View Transitions API for smooth page/component animations
    - `useOptimistic()` for instant cart updates with automatic rollback
    - `useFormStatus()` for clean form state management
    - `use()` hook for async data unwrapping with Suspense
- **Modern UX** - Toast notifications, auto-open cart dropdown, debounced search
- **SEO Optimized** - Dynamic metadata, OpenGraph/Twitter cards, breadcrumbs, XML sitemap
- **Fully Responsive** - Mobile-first design with accessible UI
- **14 Themes** - DaisyUI theme switcher with system preference detection

---

## 🏗️ Architecture Decisions

### Why Zustand over Redux/Context?

Chose Zustand for its simplicity and built-in persistence. The entire cart state (including localStorage sync) is ~136
lines vs hundreds with Redux. It provides excellent TypeScript inference, doesn't require Provider wrappers, and
automatically recalculates totals on every mutation.

### Why Server-Side Filtering?

Leveraged DummyJSON API's built-in search (`/products/search?q=`) and category (`/products/category/{category}`)
endpoints. This ensures scalability - the API handles filtering/sorting and returns only matching products, rather than
loading the full catalog client-side. Filters sync to URL params for shareable links.

### Why Next.js 15 App Router?

Server Components reduce client bundle size, built-in streaming with Suspense improves perceived performance, and
`generateMetadata()` provides excellent SEO. The App Router's layout system prevents unnecessary re-renders during
navigation.

### Why Experimental React 19 Features?

Wanted to showcase cutting-edge web development. View Transitions provide smooth animations without JavaScript
libraries, `useOptimistic()` gives instant feedback on cart updates, and `use()` simplifies async data fetching. These
features represent the future of React.

---

## ⚖️ Trade-offs & Limitations

### What Was Simplified

This is a frontend-only demo using a mock API (DummyJSON), so several features were intentionally simplified:

- **No Authentication** - DummyJSON doesn't support user accounts. Production would use NextAuth.js with JWT tokens
- **No Checkout Flow** - Mock API can't process orders. Would add Stripe integration, shipping forms, order confirmation
- **No Backend** - Pure client-side app. Production would need Node.js API, PostgreSQL database, Redis caching
- **No Real-Time Inventory** - Static product data. Would add WebSocket for stock updates
- **No Product Variants** - API doesn't support sizes/colors. Would need complex variant management

### Known Limitations

- **No Automated Tests** - Time constraint. Production would have Vitest unit tests, React Testing Library integration
  tests, and Playwright E2E tests targeting 80%+ coverage
- **No Internationalization** - English only. Would add next-intl for multi-language support
- **No Analytics** - No tracking. Would add Vercel Analytics and Google Analytics
- **No Error Boundaries** - Errors handled in API calls but no component crash protection. Would add React Error
  Boundaries
- **Redundant Dependency** - Both `react-hot-toast` and `sonner` installed, only using the former (could remove sonner
  to reduce bundle size)

### API Constraints (DummyJSON)

- Limited to ~194 products total
- No real mutations (cart exists only in client state)
- Simple search (no advanced filters like price range)
- Flat category structure (no subcategories)

**Mitigation:** Used client-side cart persistence, implemented robust Zod validation to catch API changes, and designed
architecture to easily swap in a real backend.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── products/          # Product listing & details
│   ├── categories/        # Category pages
│   └── cart/              # Shopping cart
├── components/            # React components (by feature)
│   ├── product/           # Product cards, gallery, forms
│   ├── cart/              # Cart item, dropdown, icon
│   ├── layout/            # Header, theme switch
│   └── ui/                # Reusable UI components
├── store/                 # Zustand stores
│   └── cartStore.ts       # Cart state with persistence
├── lib/
│   ├── api/               # API client with Zod validation
│   ├── schemas/           # Zod schemas for products/reviews
│   └── searchParams/      # nuqs URL state parsers
└── types/                 # TypeScript definitions
```

---

## 🎨 Styling System

- **Tailwind CSS v4** with PostCSS plugin
- **DaisyUI v5** component library
- **Custom View Transitions CSS** - Defines animations for page/component transitions (200-400ms easing)
- **14 Theme Options** - Light, dark, forest, synthwave, cyberpunk, etc.
- **Responsive Design** - Mobile-first with breakpoints for tablet/desktop
- **Prettier Plugin** - Auto-sorts Tailwind classes for consistency

---

## ⚡ Performance Optimizations

- **Next.js Image Component** - Automatic WebP/AVIF conversion, responsive srcsets, lazy loading
- **API Caching** - 1-hour revalidation for product data (configurable per endpoint)
- **Pagination** - Loads 20 products per page to reduce initial load time
- **Debounced Search** - 300ms delay reduces API calls while typing
- **Code Splitting** - Automatic with App Router, each route is a separate bundle
- **Turbopack** - Next.js 15 uses Rust-based bundler (10x faster than Webpack)

---

## 📚 Additional Documentation

- **CLAUDE.md** - Project guidelines and development commands
- **TODO.MD** - Feature backlog and planned improvements
- **PROGRESS.md** - Development timeline and completed features
- **INTERVIEW_PREP.md** - Technical interview preparation guide

---

## 🎯 What Would Change for Production?

1. **Testing Suite** - Vitest + React Testing Library + Playwright
2. **Real Backend** - Node.js API with PostgreSQL, Redis caching
3. **Authentication** - NextAuth.js with JWT tokens, protected routes
4. **Payment Processing** - Stripe integration with PCI compliance
5. **Error Handling** - Error Boundaries, Sentry monitoring, graceful fallbacks
6. **Internationalization** - next-intl for multi-language support
7. **Analytics** - Vercel Analytics, Google Analytics, conversion tracking
8. **Advanced Search** - Algolia/Elasticsearch with fuzzy matching, autocomplete
9. **Email Service** - Order confirmations, shipping updates
10. **Admin Dashboard** - Product/order/user management

---

Built with ❤️ for Arts Consolidated
