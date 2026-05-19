import express from "express";
import path from "node:path";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import tournamentsRoutes from "./routes/tournaments";
import walletRoutes from "./routes/wallet";
import paymentsRoutes from "./routes/payments";
import teamsRoutes from "./routes/teams";
import matchesRoutes from "./routes/matches";
import notificationsRoutes from "./routes/notifications";
import supportRoutes from "./routes/support";
import leaderboardRoutes from "./routes/leaderboard";
import profileRoutes from "./routes/profile";
import couponsRoutes from "./routes/coupons";
import { configureSecurity } from "./middleware/security";
import { requireAuth } from "./middleware/auth";
import { trackDevice } from "./middleware/device";
import { errorHandler, notFoundHandler } from "./lib/errors";

export function createApp() {
  const app = express();

  app.use(
    "/api/payments",
    express.raw({
      type: "application/json",
      verify(req, _res, buffer) {
        (req as typeof req & { rawBody?: Buffer }).rawBody = buffer;
      }
    })
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  configureSecurity(app);

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "ffx-api", at: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/payments", paymentsRoutes);

  app.use("/api", requireAuth, trackDevice);
  app.use("/api/profile", profileRoutes);
  app.use("/api/tournaments", tournamentsRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api/teams", teamsRoutes);
  app.use("/api/matches", matchesRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/tickets", supportRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/coupons", couponsRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
