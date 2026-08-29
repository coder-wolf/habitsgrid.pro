# Daily Habit Helper

A modern habit tracking app built with a visual grid system. Track daily habits across months with a clean, themeable interface. Free tier stores data locally; Pro tier adds cloud sync via Supabase.


---

## Features

- **Visual Habit Grid** -- Monthly grid view to track habits across days
- **Drag & Drop Reordering** -- Reorder habits and sections with dnd-kit
- **10 Color Themes** -- Light, Midnight, Sunset, Forest, Lavender, Pink, Indigo, Teal, Charcoal, Cocoa
- **Onboarding Flow** -- Guided 2-step onboarding (sign-in + optional upgrade)
- **Cloud Sync (Pro)** -- Habit data synced to Supabase with debounced upsert
- **Subscription Billing** -- LemonSqueezy-powered checkout, webhooks, and subscription management
- **Responsive Design** -- Works on desktop and mobile (vaul drawer, resizable panels)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR + file-based routing) |
| UI Library | React 19, TypeScript 5.8 |
| Styling | Tailwind CSS 4, shadcn/ui (46 components), Radix UI |
| State | React hooks/Context, TanStack React Query |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Payments | LemonSqueezy (checkout, subscriptions, webhooks) |
| Drag & Drop | @dnd-kit (core, sortable) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Build | Vite 8, Rolldown (Rust bundler) |
| Linting | ESLint 9 + Prettier |
| Package Mgr | Bun (primary) |
| Deployment | Cloudflare Workers (via Nitro), Vercel |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- [Bun](https://bun.sh/) (recommended) or npm
- A [Supabase](https://supabase.com/) project
- A [LemonSqueezy](https://www.lemonsqueezy.com/) account

---

## Getting Started

1. **Clone the repo**

   ```sh
   git clone <this-repository-url>
   cd daily-habit-helper
   ```

2. **Install dependencies**

   ```sh
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   Copy the example and fill in your keys:

   ```sh
   cp .env.example .env
   ```

   Required variables:

   | Variable | Description |
   |---|---|
   | `VITE_SUPABASE_URL` | Supabase project URL (Dashboard > Settings > API) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
   | `LEMONSQUEEZY_API_KEY` | LemonSqueezy API key |
   | `LEMONSQUEEZY_STORE_ID` | Your LemonSqueezy store ID |
   | `LEMONSQUEEZY_WEBHOOK_SECRET` | Secret for webhook HMAC verification |
   | `LEMONSQUEEZY_PRODUCT_ID` | Product ID for subscriptions |
   | `LEMONSQUEEZY_VARIANT_ID` | Variant ID for the subscription plan |

4. **Run database migrations**

   Apply the SQL migrations in `supabase/migrations/` to your Supabase project via the SQL Editor or Supabase CLI.

5. **Start the dev server**

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
daily-habit-helper/
  src/
    components/
      ui/               # 46 shadcn/ui components
      auth-dialog.tsx    # Sign-in dialog (Google OAuth)
      navbar.tsx         # Navigation with month controls
      onboarding-flow.tsx # 2-step onboarding
      theme-switcher.tsx # 10-theme color picker
      upgrade-dialog.tsx # Pro upgrade modal
    hooks/
      use-mobile.tsx     # Mobile breakpoint detection
    lib/
      auth.tsx           # Auth context (Supabase + Google OAuth)
      supabase.ts        # Supabase client init
      theme.tsx          # Theme context (10 themes)
      habits.ts          # Habit data types and helpers
      checkout.ts        # Server fn: create checkout session
      webhook.ts         # Server fn: LemonSqueezy webhook
      cancel-subscription.ts  # Server fn: cancel subscription
      subscription-server.ts  # Server fn: fetch subscription
      sync-subscription.ts    # Server fn: sync from LemonSqueezy API
      utils.ts           # cn() utility (clsx + tailwind-merge)
    routes/
      __root.tsx              # Root layout
      index.tsx               # Main habit grid
      onboarding.tsx          # Onboarding route
      settings/billing.tsx    # Billing management
      api/webhooks/lemonsqueezy.ts  # Webhook endpoint
    styles.css           # Tailwind + 10 oklch themes
    server.ts            # Custom SSR error recovery wrapper
    start.ts             # TanStack Start middleware (CSRF + error handling)
  supabase/
    migrations/          # SQL migrations
  public/                # Static assets
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
| `status` | TEXT | `active`, `cancelled`, `expired`, `inactive`, `pending` |
| `plan_id` | TEXT | Product ID |
| `variant_id` | TEXT | Variant ID |
| `renews_at` | TIMESTAMPTZ | Next renewal date |
| `expires_at` | TIMESTAMPTZ | Expiration date |
| `created_at` | TIMESTAMPTZ | Row creation |
| `updated_at` | TIMESTAMPTZ | Auto-updated via trigger |

**RLS Policies:**
- Users can only SELECT their own subscription
- Service role (webhooks) has full access

### `user_state`

Stores per-user habit grid data as a JSON blob. Used by Pro users for cloud sync.

---

## Architecture Notes

- **Dual Storage** -- Free users persist data in `localStorage`; Pro users sync to Supabase `user_state` with debounced upserts.
- **Server Functions** -- All API operations (checkout, webhooks, subscription management) use TanStack Start's `createServerFn()` with built-in CSRF protection.
- **SSR Error Recovery** -- Custom wrapper around Nitro/h3 catches unhandled SSR errors and renders a fallback HTML page.
- **Supply Chain Guard** -- Bun configured with `minimumReleaseAge = 86400` (24h) to prevent supply chain attacks.

---

## Deployment

### Cloudflare Workers (Primary)

The project is configured for Cloudflare Workers via Nitro. Build and deploy:

```sh
bun run build
# Deploy via Wrangler (configured in .wrangler/deploy/config.json)
```

### Vercel (Alternative)

A `.vercel/project.json` is present. Deploy with the Vercel CLI or connect the repo in the Vercel dashboard.

### Lovable

This project is connected to [Lovable](https://lovable.dev/projects/a605ae38-fb32-4273-907f-6e31dc4d6acd). Push to `main` and changes sync back to the Lovable editor.

---

## License

This project is private. See repository settings for license details.
