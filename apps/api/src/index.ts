import { createServer } from "node:http";
import { createApp } from "./app";
import { env } from "./config/env";
import { startAutomationJobs } from "./jobs/automation";
import { prisma } from "./lib/prisma";

const app = createApp();
const server = createServer(app);

server.listen(env.API_PORT, () => {
  console.log(`FFX ESPORTS API listening on http://localhost:${env.API_PORT}`);
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
