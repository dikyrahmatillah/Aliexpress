# Runolf – AliExpress Affiliate Storefront (Next.js)

Runolf is a Next.js 14 App Router project that showcases AliExpress products with category browsing, search, and product detail pages. It includes server-side fetching for SEO, client-side interactivity with TanStack Query, and a clean Tailwind UI.

## Features

- **Hot Products & Categories:** Fetch hot products and categories via AliExpress Affiliate API.
- **Search & Filter:** Query products by keyword, category, price, and sort.
- **Product Details:** View detailed information for a specific product ID.
- **SSR + Client Interactions:** Server-rendered initial data with smooth client updates.
- **Responsive UI:** Built with Tailwind CSS and modern Next.js patterns.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS
- **Data:** TanStack Query (`src/components/providers/QueryProvider.tsx`)
- **API:** AliExpress Affiliate API (signed requests)

## Getting Started

### 1) Prerequisites

- Node.js 18+ (or latest LTS)
- npm, pnpm, yarn, or bun

### 2) Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### 3) Environment variables

Create a `.env.local` at the project root with your AliExpress credentials. Defaults exist in code for development, but you should set your own values for production.

```bash
# .env.local
ALIEXPRESS_APP_KEY=YOUR_APP_KEY
ALIEXPRESS_SECRET=YOUR_SECRET
ALIEXPRESS_APP_SIGNATURE=YOUR_APP_SIGNATURE
ALIEXPRESS_TRACKING_ID=YOUR_TRACKING_ID
```

These are used by utils and routes:

- `src/utils/aliexpress.ts`
- `src/app/api/aliexpress/productdetail/route.ts`

### 4) Run the dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open `http://localhost:3000` in your browser.

## API Routes

All routes live under `src/app/api/` and proxy signed requests to AliExpress.

- `GET /api/aliexpress/product`

  - Query products by keyword and/or category.
  - Query params: `query`, `minSalePrice`, `categoryIds`, `pageSize`, `pageNo`, `sort`, `targetCurrency`, `targetLanguage`.
  - Always returns parsed products.
  - Example:
    ```bash
    curl "http://localhost:3000/api/aliexpress/product?query=laptop&pageSize=20&sort=LAST_VOLUME_DESC"
    ```

- `GET /api/aliexpress/hotproduct`

  - Fetch hot products; optionally return parsed objects with `parsed=true`.
  - Query params: `categoryId`, `pageNo`, `pageSize`, `targetCurrency`, `targetLanguage`, `country`, `parsed`.
  - Example:
    ```bash
    curl "http://localhost:3000/api/aliexpress/hotproduct?parsed=true&pageSize=50"
    ```

- `GET /api/aliexpress/categories`

  - Fetch AliExpress categories.
  - Optional query param: `appSignature` (uses env by default).
  - Example:
    ```bash
    curl "http://localhost:3000/api/aliexpress/categories"
    ```

- `GET /api/aliexpress/productdetail`

  - Fetch detailed info for a specific product.
  - Required query param: `product_id`
  - Optional: `target_currency`, `target_language`, `country`
  - Example:
    ```bash
    curl "http://localhost:3000/api/aliexpress/productdetail?product_id=123456789"
    ```

- `GET /api/announcements`
  - Returns site announcements for the header bar.

## Key Pages

- Home: `src/app/page.tsx`
- Collections by Category: `src/app/collections/[id]/page.tsx` (SSR initial products)
- Product: `src/app/product/[id]/page.tsx`
- Search: `src/app/search/page.tsx`

## Components & Hooks

- Product UI: `src/components/ProductCard.tsx`, `src/sections/ShowcaseSection.tsx`
- Header: `src/components/Header/`
- Query Provider: `src/components/providers/QueryProvider.tsx`
- Hooks: `src/hooks/useAliexpress.ts`, `src/hooks/useSearch.ts`

## Folder Structure (high level)

```
src/
	app/                # Next.js App Router pages & API
		api/aliexpress/   # Product, hotproduct, categories, productdetail routes
		collections/[id]/ # SSR page for category products
		product/[id]/     # Product detail page
		search/           # Product search page
	components/         # UI components (cards, header, etc.)
	sections/           # Page sections (Hero, Showcase, Featured, etc.)
	hooks/              # Data fetching and UI hooks
	utils/              # AliExpress API utilities & signing
	types/              # TypeScript types
```

## Development Notes

- Signed requests use MD5 per AliExpress Affiliate API.
- Server-side initial data improves SEO and perceived performance.
- Client-side updates/queries handled via TanStack Query provider.
- Tailwind for styling; see `src/app/globals.css`.

## Linting & Type Checking

```bash
npm run lint
```

## Deployment

- Vercel recommended for Next.js. Set production env vars in Vercel.
- Ensure `ALIEXPRESS_*` secrets are configured and never committed.
