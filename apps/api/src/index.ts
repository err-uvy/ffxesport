import { createServer } from "node:http";
import { createApp } from "./app";
import { env } from "./config/env";
import { startAutomationJobs } from "./jobs/automation";
import { prisma } from "./lib/prisma";

const app = createApp();

const PORT = Number(process.env.PORT) || env.API_PORT || 10000;

const server = createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 FFX ESPORTS API listening on port ${PORT}`);
  startAutomationJobs();
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

async function shutdown() {
  console.log("Shutting down FFX API");

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}