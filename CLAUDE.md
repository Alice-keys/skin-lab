# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

No test framework is configured.

## Architecture

Skin Lab is a Vue 3 skincare e-commerce app with both a customer storefront and admin dashboard. It uses **Domain-Driven Design (DDD)** organized into bounded contexts, each with a strict 4-layer structure:

```
src/
├── [bounded-context]/
│   ├── domain/model/         # Business entities (.entity.js)
│   ├── application/          # Reactive stores (.store.js)
│   ├── infrastructure/       # API clients (.api.js) + assemblers (.assembler.js)
│   └── presentation/components/  # Vue SFCs
├── shared/                   # Cross-cutting: layout, HTTP client, i18n
├── router.js
├── i18n.js
└── main.js
```

**Bounded contexts:** `catalog`, `cart`, `checkout`, `identity`, `wishlist`, `subscription`

## Key Patterns

**State management** — No Vuex/Pinia. Each context has a store built with Vue's `reactive()` API, exported as a singleton. Components import and use these stores directly; no prop drilling.

**Data flow:**
```
Component → store (application) → *Api (infrastructure) → backend or mock fallback
```

**Assemblers** (`*.assembler.js`) convert raw API responses into domain entity instances. Always go through assemblers when consuming API data.

**Domain entities** (`*.entity.js`) encapsulate business logic as methods (e.g., `isInStock()`, `getFormattedPrice()`, `applyDiscountCode()`). Entities are plain JS classes — no framework dependency.

**Mock fallback** — Every store catches API errors and falls back to hardcoded mock data. This keeps the UI functional without a backend. Test credentials: customer `sofia@skinlab.com` / `password`, admin `admin@skinlab.com` / `admin`.

**Auth guard** — `router.js` defines an `AUTH_REQUIRED` array of route names. Unauthenticated users hitting those routes are redirected to `/login`. Auth session is persisted to `localStorage` under key `skin-lab-auth` and restored on app load via `_restoreSession()` in `identity/application/auth.store.js`.

## Tech Stack

- **Vue 3** + **Vue Router 5** + **Vue i18n 11** (en/es locales in `src/locales/`)
- **PrimeVue 4** for UI components + **PrimeFlex** for CSS utilities + **Primeicons**
- **Axios** via a centralized HTTP client in `shared/infrastructure/http.js`; base URL from `VITE_API_BASE_URL` env var (default `http://localhost:3000`)
- **Vite** — `@` alias resolves to `src/`

## Discount & Business Rules

- Discount codes: `WELCOME10` (10%), `SKINLAB15` (15%), `SAVE20` (20%)
- Tax rate: 8%, applied at checkout
- Logic lives in domain entities and checkout store, not in components
