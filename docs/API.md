# FFX ESPORTS API

Base URL: `/api`

All protected routes accept the HTTP-only `ffx_access` cookie or an `Authorization: Bearer <token>` header. State-changing routes require `x-csrf-token` matching the `ffx_csrf` cookie, except payment webhooks.

## Auth

- `GET /auth/csrf` returns a CSRF token and sets the CSRF cookie.
- `POST /auth/register` creates a user, wallet, USER role, session, OTP, and cookies.
- `POST /auth/login` validates credentials, tracks device session, and sets cookies.
- `POST /auth/refresh` rotates refresh tokens.
- `POST /auth/logout` revokes current refresh token and clears cookies.
- `POST /auth/logout-all` revokes all sessions for the current user.
- `GET /auth/me` returns the authenticated user and role list.
- `POST /auth/forgot-password` sends a reset token through email.
- `POST /auth/reset-password` resets a password with a valid token.
- `POST /auth/send-otp` sends email OTP.
- `POST /auth/verify-otp` verifies OTP and marks the user email verified.
- `GET /auth/google`, `/auth/google/callback`, `/auth/discord`, `/auth/discord/callback` handle OAuth.

## Tournaments

- `GET /tournaments` lists visible tournaments with filters.
- `GET /tournaments/:slug` returns tournament details.
- `POST /tournaments` creates a tournament. Admin role required.
- `PATCH /tournaments/:id` updates a tournament. Admin role required.
- `POST /tournaments/:id/join` joins a solo or team tournament and handles entry-fee wallet locking.
- `POST /tournaments/:id/leave` leaves before lock and refunds the entry fee.
- `GET /tournaments/:id/leaderboard` returns participant scoring.

## Wallet

- `GET /wallet` returns balances and recent transactions.
- `GET /wallet/transactions` returns paginated wallet history.
- `POST /wallet/deposit/create` creates Razorpay or Cashfree payment orders.
- `POST /wallet/withdraw` creates a withdrawal request and locks balance.
- `POST /payments/razorpay/webhook` verifies Razorpay signatures and credits deposits.
- `POST /payments/cashfree/webhook` verifies Cashfree webhook signatures and credits deposits.

## Teams, Matches, Support

- `POST /teams`, `GET /teams`, `POST /teams/:id/invite`, `POST /teams/:id/members/:memberId/respond`
- `GET /matches`, `GET /matches/:id`, `POST /matches/:id/submit-result`
- `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`
- `POST /tickets`, `GET /tickets`, `POST /tickets/:id/replies`

## Admin

All `/admin/*` routes require one of `SUPER_ADMIN`, `ADMIN`, `MODERATOR`, or `SUPPORT`. Critical actions such as admin management require `SUPER_ADMIN`.

- `GET /admin/summary`
- `GET /admin/users`, `PATCH /admin/users/:id/status`, `POST /admin/users/:id/roles`
- `GET /admin/tournaments`
- `PATCH /admin/matches/:id/room`
- `PATCH /admin/results/:id/verify`
- `GET /admin/withdrawals`, `PATCH /admin/withdrawals/:id`
- `GET /admin/audit-logs`, `GET /admin/fraud-logs`
- `GET /admin/tickets`, `PATCH /admin/tickets/:id`
