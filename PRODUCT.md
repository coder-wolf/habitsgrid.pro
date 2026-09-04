# HabitsGrid — Product Overview

## What is HabitsGrid?

HabitsGrid is a modern habit tracking application that helps people build consistent daily routines through a clean, visual grid interface. Instead of complicated todo lists or overwhelming dashboards, HabitsGrid presents your habits as a simple monthly grid — like a spreadsheet for your personal growth.

The core idea is straightforward: **see your progress at a glance, stay motivated, and build streaks that last.**

---

## Who is it for?

HabitsGrid is designed for anyone who wants to build better habits but struggles with consistency. This includes:

- **Professionals** trying to establish morning routines, exercise schedules, or learning goals
- **Students** building study habits, reading goals, or assignment tracking
- **Health-conscious individuals** tracking workouts, meditation, water intake, or sleep
- **Anyone** who has tried other habit trackers and found them too complex or cluttered

The app works for both casual users who just want to track a few habits locally, and power users who want cloud sync across multiple devices.

---

## Core Experience

### The Grid

The heart of HabitsGrid is a monthly calendar grid. Each row represents a habit, and each column represents a day of the month. To mark a habit as complete, you simply tap or click the corresponding cell. Completed cells fill with color, creating a satisfying visual pattern that grows over time.

This grid approach offers several advantages over traditional habit trackers:

- **Instant visibility** — You can see your entire month's progress in one view
- **Pattern recognition** — Gaps and streaks become immediately obvious
- **Motivation through visuals** — Watching cells fill up creates a natural desire to keep the streak going
- **Simplicity** — No complicated menus or data entry required

### Monthly Navigation

Users can navigate between months using the built-in controls in the navigation bar. This allows you to review past progress, check streaks, and plan ahead for upcoming months.

### Habit Management

Adding new habits is quick and intuitive. Each habit gets its own row in the grid, and users can:

- **Add habits** with custom names and colors
- **Reorder habits** using drag-and-drop (powered by dnd-kit)
- **Group habits** into sections for better organization
- **Customize colors** from a palette of six habit colors per theme

---

## Themes and Personalization

HabitsGrid comes with **10 carefully crafted color themes**, each designed to provide a distinct visual experience while maintaining readability and accessibility.

### Available Themes

| Theme | Style |
|---|---|
| **Light** | Clean, bright interface for daytime use |
| **Midnight** | Deep blue-black for night owls |
| **Sunset** | Warm orange and amber tones |
| **Forest** | Calming green palette |
| **Lavender** | Soft purple hues |
| **Pink** | Gentle rose tones |
| **Indigo** | Rich blue-purple |
| **Teal** | Cool blue-green |
| **Charcoal** | Dark gray with subtle warmth |
| **Cocoa** | Rich brown tones |

Each theme uses oklch color space for perceptually uniform colors that look great on any screen. The theme switcher allows users to change themes instantly, and the selected theme persists across sessions.

---

## Two Tiers: Free and Pro

HabitsGrid operates on a freemium model, giving users choice in how they want to use the app.

### Free Tier

The free tier provides full functionality for users who are comfortable storing data locally:

- **Unlimited habits** — Track as many habits as you want
- **Full grid functionality** — All core features work identically
- **All 10 themes** — No theme restrictions
- **Drag and drop** — Full habit reordering
- **Local storage** — Data stays on your device

Free tier data is stored entirely in the browser's localStorage. This means:

- No account required
- No data leaves your device
- Works offline
- Fast and responsive

The tradeoff is that data doesn't sync across devices. If you clear your browser data or switch devices, your history is lost.

### Pro Tier

The Pro tier adds cloud sync for users who want their habits available everywhere:

- **Everything in Free** — All features included
- **Cloud sync** — Habits sync to Supabase across all your devices
- **Automatic backups** — Your data is safely stored in the cloud
- **Multi-device access** — Start on your phone, continue on your laptop
- **Subscription management** — Easy billing through LemonSqueezy

Pro subscriptions are managed through LemonSqueezy, a secure payment platform. Users can:

- Upgrade directly from the app
- Manage their subscription from the billing page
- Cancel anytime with access until the billing period ends
- Refresh their billing status instantly

---

## Onboarding

New users are guided through a simple two-step onboarding process:

### Step 1: Sign In

Users can sign in with their Google account for instant access. For those who want to try the app first, a "Skip — try demo" option lets them explore without committing.

### Step 2: Upgrade (Optional)

After signing in, users see a clear explanation of Pro benefits. They can:

- **Upgrade to Pro** — Redirected to secure LemonSqueezy checkout
- **Skip** — Continue with the free tier and local storage

The onboarding is designed to be non-intrusive. Users can start tracking habits immediately, and the upgrade prompt only appears once.

---

## Billing and Subscription Management

The billing page provides complete transparency into subscription status:

### Current Plan Display

- Shows whether the user is on Free or Pro
- Displays subscription status (active, cancelled, pending)
- Shows billing cycle start date
- Shows next renewal date (for active subscriptions)
- Shows access expiration date (for cancelled subscriptions)

### Subscription Actions

- **Upgrade to Pro** — Redirected to LemonSqueezy checkout
- **Cancel Subscription** — Confirmation dialog explains access continues until period ends
- **Refresh Status** — Manual refresh to sync with LemonSqueezy

### Post-Payment Flow

After completing checkout, users are redirected back to the billing page. The app polls for subscription activation, then shows a success toast and redirects to the homepage.

---

## Responsive Design

HabitsGrid is built to work beautifully on any screen size:

### Desktop

- Full grid view with all habits visible
- Sidebar navigation for quick access
- Resizable panels for custom layouts
- Keyboard shortcuts for power users

### Mobile

- Adaptive grid that scrolls horizontally
- Bottom navigation for easy thumb access
- Drawer menus for settings and actions
- Touch-optimized tap targets

The responsive design uses vaul (drawer component) and resizable panels to create a native-feeling experience on mobile devices.

---

## Data Architecture

### How Data Flows

Understanding how HabitsGrid handles data helps users make informed decisions:

**Free Tier:**
```
User Action → React State → localStorage → Persistent
```

**Pro Tier:**
```
User Action → React State → localStorage + Supabase → Synced
```

### Offline Support

The app works fully offline for free tier users. Pro users can continue working offline, and changes sync automatically when connectivity returns.

### Data Safety

- Free tier: Data never leaves the browser
- Pro tier: Data encrypted in transit, stored securely in Supabase
- No third-party tracking (except optional analytics)
- Row Level Security ensures users can only access their own data

---

## Technical Foundation

While this document focuses on the user experience, it's worth noting the technical choices that enable HabitsGrid's capabilities:

- **Server-Side Rendering** — Pages load fast with content visible immediately
- **Progressive Enhancement** — Core functionality works without JavaScript
- **Type Safety** — TypeScript ensures reliability throughout the codebase
- **Modern Build System** — Vite provides instant hot module replacement during development
- **Edge Deployment** — Vercel's global network ensures low latency worldwide

---

## Analytics and Privacy

HabitsGrid takes a privacy-first approach to analytics:

- **DataFast** — Privacy-focused analytics that don't track individual users
- **Vercel Analytics** — Performance metrics without personal data collection
- **No third-party cookies** — Clean browsing experience
- **No data selling** — User data is never shared or sold

---

## Future Possibilities

The HabitsGrid roadmap includes several potential enhancements:

- **Habit Templates** — Pre-built habit combinations for common routines
- **Streak Tracking** — Visual indicators for consecutive days
- **Statistics Dashboard** — Detailed analytics on completion rates
- **Social Features** — Share progress with friends or accountability partners
- **Reminders** — Optional push notifications for habit completion
- **Export/Import** — Data portability for backup and migration
- **API Access** — Integration with other productivity tools

---

## Support and Community

Users can:

- **Report bugs** through GitHub Issues
- **Request features** via GitHub Discussions
- **Contact support** through the app's help section

---

## Summary

HabitsGrid is a habit tracking app that prioritizes simplicity, visual feedback, and user choice. By offering both a fully functional free tier with local storage and a Pro tier with cloud sync, it serves a wide range of users — from those who want a simple offline tracker to those who need seamless multi-device access.

The combination of a clean grid interface, 10 beautiful themes, and thoughtful UX makes HabitsGrid a compelling choice for anyone serious about building better habits.

**Track your habits. Build your streaks. Stay consistent.**
