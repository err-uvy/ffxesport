# Deployment Guide

## 1. Provision Services

- PostgreSQL 15+
- Redis 7+
- Cloudinary account for match proofs, avatars, and banners
- Razorpay and Cashfree merchant accounts
- Firebase project for FCM
- SMTP provider for OTP and password recovery email
- Discord webhook for ops notifications

## 2. Backend

Deploy `apps/api` to Render, AWS ECS, Fly.io, or any Node 20 host.

```bash
npm ci
npm run prisma:generate -w @ffx/api
npm run build -w @ffx/api
npm run prisma:migrate -w @ffx/api
npm run start -w @ffx/api
```

Set `NODE_ENV=production`, strong JWT secrets, `DATABASE_URL`, `REDIS_URL`, payment keys, OAuth keys, SMTP keys, and storage keys. Configure webhooks:

- Razorpay: `https://api.example.com/api/payments/razorpay/webhook`
- Cashfree: `https://api.example.com/api/payments/cashfree/webhook`

## 3. Socket Server

Deploy `apps/socket-server` as a separate Node process so websocket scaling can be managed independently.

```bash
npm ci
npm run build -w @ffx/socket-server
npm run start -w @ffx/socket-server
```

Set the same `JWT_ACCESS_SECRET`, `DATABASE_URL`, `REDIS_URL`, and frontend CORS origins.

## 4. Frontends

Deploy `apps/web` and `apps/admin` to Vercel as separate projects.

User app build command:

```bash
npm run build -w @ffx/web
```

Admin app build command:

```bash
npm run build -w @ffx/admin
```

Set:

- `NEXT_PUBLIC_API_URL=https://api.example.com/api`
- `NEXT_PUBLIC_SOCKET_URL=https://socket.example.com`
- `NEXT_PUBLIC_USER_APP_URL=https://app.example.com`
- `NEXT_PUBLIC_ADMIN_APP_URL=https://admin.example.com`

## 5. Production Checklist

- Rotate seeded admin password.
- Enable database backups and PITR.
- Enforce HTTPS-only cookies.
- Confirm payment webhook signatures in live mode.
- Confirm OAuth callback URLs in Google and Discord dashboards.
- Verify `/api/admin/*` rejects normal users.
- Confirm FCM service account formatting, including escaped private key newlines.
- Run `npm run build`, `npm run typecheck`, and a smoke test of login, join tournament, deposit webhook, and admin result verification.
