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

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage
```

**Test Suite:**
- **174 tests** across cart store, components, schemas, and utilities
- **94%+ coverage** (statements, lines, functions)
- **Vitest** with React Testing Library for component testing
- **GitHub Actions** CI workflow on push/PR

---

## 🛠️ Tech Stack

- **Next.js 15** - App Router, Turbopack, async request APIs
- **React 19** - View Transitions, useOptimistic, useFormStatus, use() hook
- **TypeScript** - Strict mode with full type safety
- **Tailwind CSS v4** - Latest major version with PostCSS
- **Zustand** - Minimal state management with localStorage persistence
- **Zod** - Runtime API validation and type inference
- **nuqs** - Type-safe URL state management

---

## ✨ Key Features

- **Static Site Generation** - Pre-renders all pages at build time with `generateStaticParams()` for instant loads
- **React 19 Experimental Features** - View Transitions API, `useOptimistic()` for instant cart updates,
  `useFormStatus()`, `use()` hook with Suspense
- **Persistent Shopping Cart** - Zustand with localStorage persistence, survives page refreshes
- **Server-Side Filtering** - DummyJSON API endpoints for search/category filtering with URL state sync
- **SEO Optimized** - Dynamic metadata, OpenGraph/Twitter cards, breadcrumbs, XML sitemap

---

## 🏗️ Architecture Decisions

- **Static Generation (`generateStaticParams`)** - Pre-builds all ~194 products & categories at build time for instant
  page loads and CDN caching. Trade-off: Works perfectly for DummyJSON's limited dataset, but would need ISR (
  Incremental Static Regeneration) or dynamic rendering for catalogs with 10k+ products to avoid excessive build times.
- **Zustand over Redux** - 136 lines for full cart state with persistence vs hundreds with Redux. Zero boilerplate,
  built-in TypeScript inference, no Provider wrappers.
- **Server-Side Filtering** - Uses DummyJSON's `/products/search` and `/products/category/{name}` endpoints so API
  handles filtering/sorting. Scales better than client-side filtering, syncs with URL params for shareable links.
- **Next.js 15 App Router** - Server Components reduce bundle size, streaming with Suspense improves performance,
  `generateMetadata()` provides SEO, layouts prevent re-renders.
- **React 19 Experimental Features** - View Transitions for smooth animations without libraries, `useOptimistic()` for
  instant cart feedback, `use()` hook for async data unwrapping.

---

## ⚖️ Trade-offs & Limitations

**Frontend Demo Simplifications:**

- No authentication, checkout flow, or real backend (DummyJSON mock API)
- Static generation works for ~194 products but would need ISR/dynamic rendering for larger catalogs (10k+ products)
- No i18n, analytics, or error boundaries
- There's an issue with the transitions on mobile while the Filter modal is open.

**Production Additions:**

- Backend: Node.js API, PostgreSQL, Redis caching
- Auth: NextAuth.js with JWT tokens
- Payments: Stripe integration
- Testing: Expand to E2E with Playwright for critical user flows
- Advanced features: Real-time inventory (WebSockets), product variants, multi-language support

---

## 📁 Project Structure

```
src/
├── app/                # Next.js App Router (products, categories, cart)
├── components/         # Product, cart, layout, UI components
├── store/             # Zustand cart state with localStorage
├── lib/               # API client, Zod schemas, URL state parsers
└── types/             # TypeScript definitions
```

**Tech Stack:** Tailwind CSS v4, DaisyUI v5 (14 themes), next-themes, nuqs for URL state

---

## ⚡ Performance

- **Static Generation** - All pages pre-built at build time with `generateStaticParams()`
- **Next.js Image** - WebP/AVIF conversion, responsive srcsets, lazy loading, and fetchPriority for images above the
  fold
- **API Caching** - 24-hour revalidation
- **Code Splitting** - Automatic with App Router

---

Built with ❤️ for Arts Consolidated
