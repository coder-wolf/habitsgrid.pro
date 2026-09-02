<div align="center">

# HabitsGrid.pro

**Track your habits. Build your streaks. Stay consistent.**

A modern habit tracking app with a visual grid interface, 10 color themes, drag-and-drop reordering, and optional cloud sync.

<br/>

[![Built with React](https://img.shields.io/badge/Built%20with-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Private-red)](#)

</div>

---

## Features

| Feature | Description |
|---|---|
| **Visual Habit Grid** | Monthly grid view to track habits across days |
| **Drag & Drop** | Reorder habits and sections with dnd-kit |
| **10 Color Themes** | Light, Midnight, Sunset, Forest, Lavender, Pink, Indigo, Teal, Charcoal, Cocoa |
| **Cloud Sync** | Pro users sync habit data to Supabase with debounced upserts |
| **Subscription Billing** | LemonSqueezy-powered checkout, webhooks, and subscription management |
| **Responsive** | Works on desktop and mobile with vaul drawer and resizable panels |

---

## Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Framework** | [TanStack Start](https://tanstack.com/start) — SSR + file-based routing |
| **UI** | React 19 · TypeScript 5.8 · [shadcn/ui](https://ui.shadcn.com) (46 components) · Radix UI |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) · oklch color themes · class-variance-authority |
| **State** | React hooks/Context · [TanStack React Query](https://tanstack.com/query) |
| **Database** | [Supabase](https://supabase.com) — PostgreSQL + Auth + Row Level Security |
| **Payments** | [LemonSqueezy](https://www.lemonsqueezy.com) — checkout, subscriptions, webhooks |
| **Forms** | [React Hook Form](https://react-hook-form.com) · [Zod](https://zod.dev) |
| **Charts** | [Recharts](https://recharts.org) |
| **Build** | [Vite 8](https://vitejs.dev) · Rolldown (Rust bundler) |
| **Deploy** | Cloudflare Workers (via Nitro) · Vercel |

</div>

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ ([nvm](https://github.com/nvm-sh/nvm#installing-and-updating) recommended)
- [Bun](https://bun.sh/) (recommended) or npm
- A [Supabase](https://supabase.com/) project
- A [LemonSqueezy](https://www.lemonsqueezy.com/) account

### Installation

```sh
git clone <this-repository-url>
cd habitsgrid.pro
bun install
```

### Environment Variables

```sh
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (Dashboard → Settings → API) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `LEMONSQUEEZY_API_KEY` | LemonSqueezy API key |
| `LEMONSQUEEZY_STORE_ID` | Your LemonSqueezy store ID |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Secret for webhook HMAC verification |
| `LEMONSQUEEZY_PRODUCT_ID` | Product ID for subscriptions |
| `LEMONSQUEEZY_VARIANT_ID` | Variant ID for the subscription plan |

### Database Migrations

Apply the SQL migrations in `supabase/migrations/` to your Supabase project via the SQL Editor or Supabase CLI.

### Run

```sh
bun run dev
```

The app will be available at `http://localhost:3000`.

---

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run build:dev` | Development build |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # 46 shadcn/ui components
│   ├── auth-dialog.tsx      # Sign-in dialog (Google OAuth)
│   ├── navbar.tsx           # Navigation with month controls
│   ├── onboarding-flow.tsx  # 2-step onboarding
│   ├── theme-switcher.tsx   # 10-theme color picker
│   └── upgrade-dialog.tsx   # Pro upgrade modal
├── hooks/
│   └── use-mobile.tsx       # Mobile breakpoint detection
├── lib/
│   ├── auth.tsx             # Auth context (Supabase + Google OAuth)
│   ├── supabase.ts          # Supabase client init
│   ├── theme.tsx            # Theme context (10 themes)
│   ├── habits.ts            # Habit data types and helpers
│   ├── checkout.ts          # Server fn: create checkout session
│   ├── webhook.ts           # Server fn: LemonSqueezy webhook
│   ├── cancel-subscription.ts    # Server fn: cancel subscription
│   ├── subscription-server.ts    # Server fn: fetch subscription
│   ├── sync-subscription.ts      # Server fn: sync from LemonSqueezy API
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
├── routes/
│   ├── __root.tsx                # Root layout
│   ├── index.tsx                 # Main habit grid
│   ├── onboarding.tsx            # Onboarding route
│   ├── settings/billing.tsx      # Billing management
│   └── api/webhooks/lemonsqueezy.ts  # Webhook endpoint
├── styles.css               # Tailwind + 10 oklch themes
├── server.ts                # Custom SSR error recovery wrapper
└── start.ts                 # TanStack Start middleware (CSRF + error handling)
```

---

## Database Schema

### `subscriptions`

Stores LemonSqueezy subscription data, linked to Supabase `auth.users`.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to `auth.users(id)`, unique index |
| `email` | TEXT | Subscriber email |
| `lemon_squeezy_id` | TEXT | Unique LemonSqueezy subscription ID |
| `status` | TEXT | `active` · `cancelled` · `expired` · `inactive` · `pending` |
| `plan_id` | TEXT | Product ID |
| `variant_id` | TEXT | Variant ID |
| `renews_at` | TIMESTAMPTZ | Next renewal date |
| `expires_at` | TIMESTAMPTZ | Expiration date |
| `created_at` | TIMESTAMPTZ | Row creation |
| `updated_at` | TIMESTAMPTZ | Auto-updated via trigger |

**RLS Policies:** Users can only SELECT their own subscription. Service role (webhooks) has full access.

### `user_state`

Stores per-user habit grid data as a JSON blob. Used by Pro users for cloud sync.

---

## Architecture

- **Dual Storage** — Free users persist data in `localStorage`; Pro users sync to Supabase with debounced upserts
- **Server Functions** — All API operations use TanStack Start's `createServerFn()` with built-in CSRF protection
- **SSR Error Recovery** — Custom wrapper around Nitro/h3 catches unhandled SSR errors and renders a fallback HTML page
- **Supply Chain Guard** — Bun configured with `minimumReleaseAge = 86400` (24h) to prevent supply chain attacks

---

## Deployment

**Cloudflare Workers** (primary) — configured via Nitro and `.wrangler/deploy/config.json`.

**Vercel** (alternative) — `.vercel/project.json` is present. Deploy with the Vercel CLI or connect the repo in the dashboard.

---
