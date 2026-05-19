# FFX ESPORTS

FFX ESPORTS is a production-oriented full-stack battle royale tournament SaaS platform for Free Fire, BGMI, CODM, Valorant, and battle royale esports operations.

## Stack

- `apps/web`: locked, auth-first player app with Next.js 15, TailwindCSS, Framer Motion, Zustand, React Hook Form, Zod, Axios, Lucide icons, and shadcn-style UI primitives.
- `apps/admin`: protected admin console with strict RBAC route guards.
- `apps/api`: Express + TypeScript API with Prisma/PostgreSQL, JWT auth, refresh-token rotation, HTTP-only cookies, RBAC, payments, wallet, tournaments, support, audit logs, anti-fraud signals, and webhooks.
- `apps/socket-server`: Socket.IO realtime service for live tournaments, countdowns, notifications, room releases, and chats.
- `packages/ui`, `packages/types`, `packages/utils`, `packages/configs`: shared building blocks.

## Quick Start

```bash
npm install
cp .env.example .env
docker compose up -d postgres redis
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Default local apps:

- User app: http://localhost:3000
- Admin app: http://localhost:3001
- API: http://localhost:4000/api
- Socket.IO: http://localhost:4100

Seeded accounts are documented in `apps/api/prisma/seed.ts`. Change all seeded passwords and secrets before production.

## Security Model

The platform is auth-first. The user app exposes only `/login`, `/register`, `/forgot-password`, and `/verify-otp` before authentication. The admin app and `/api/admin/*` require admin roles. RBAC is enforced both in backend middleware and frontend route guards.

Core protections include:

- HTTP-only secure cookies for access and refresh tokens.
- Refresh token rotation and logout-all device invalidation.
- CSRF double-submit protection for state-changing routes.
- Helmet, CORS allowlists, API rate limits, Zod validation, sanitization, Prisma parameterization, and audit logging.
- Admin sessions, admin logs, device logs, fraud logs, duplicate UID checks, and suspicious activity scoring.

## Production Notes

Read `DEPLOYMENT.md` before deploying. Configure Vercel for both Next.js apps and Render/AWS for API and socket services. PostgreSQL, Redis, Cloudinary, Firebase, Razorpay, Cashfree, SMTP, and Discord webhook secrets must be provisioned as environment variables.
