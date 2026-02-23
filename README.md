# gitalifeutd-website

Production-ready website for **GitaLife at UT Dallas**.

## Features
- Next.js (App Router) + TypeScript + TailwindCSS + shadcn/ui
- Dark mode toggle
- Events list + event detail pages
- RSVP system (Prisma + Postgres) with spam honeypot
- RSVP confirmation email (Resend)
- Admin dashboard (password-protected) + RSVP CSV export
- ICS calendar download per event
- SEO: OpenGraph metadata + `sitemap.xml` + `robots.txt`
- Seed content: 6 upcoming + 6 past events

## Tech stack
- **Next.js** (latest)
- **Prisma ORM**
- **PostgreSQL** (production)
- Optional dev fallback schema for **SQLite**
- **Resend** for transactional emails

## Quickstart (local)

### 1) Install deps
```bash
npm install
```

### 2) Environment
Copy `.env.example` to `.env` and fill values:
```bash
cp .env.example .env
```

### 3) Database

#### Option A (recommended): Postgres
Set `DATABASE_URL` to Postgres.

Then:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

#### Option B: SQLite fallback (dev)
Set `DATABASE_URL=file:./dev.db`.

Then:
```bash
npm run db:generate:sqlite
npm run db:migrate:sqlite
npm run db:seed:sqlite
```

### 4) Run dev server
```bash
npm run dev
```
Open: http://localhost:3000

## Admin
- URL: `/admin`
- Login password: `ADMIN_PASSWORD` from `.env`

## Deployment (Vercel)
1) Push repo to GitHub
2) Import into Vercel
3) Add environment variables:
   - `DATABASE_URL` (Vercel Postgres/Neon/Supabase)
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
   - optional: `RESEND_API_KEY`, `EMAIL_FROM`, `APP_URL`
4) Deploy
5) Run migrations/seed:
   - Recommended: run once from your CI or locally against prod DB:
     ```bash
     npm run db:generate
     npx prisma migrate deploy
     npm run db:seed
     ```

## Assumptions / defaults
- Audience is **new students and young professionals**, so tone is warm and beginner-friendly.
- Admin auth is intentionally simple (password + signed cookie JWT). For multi-admin user accounts, add NextAuth/Auth.js.
- Spam protection: honeypot field (basic). Consider adding Turnstile/ReCAPTCHA if spam appears.
- CMS: kept minimal by using code-based content for programs/resources. If you want a full CMS, add Keystatic/Sanity and move static content there.

## Repo
- GitHub: https://github.com/JayakrishnaMundru/gitalifeutd-website
