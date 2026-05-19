FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/socket-server/package.json apps/socket-server/package.json
COPY apps/api/prisma apps/api/prisma
COPY packages packages
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
RUN npm run prisma:generate -w @ffx/api
RUN npm run build -w @ffx/socket-server

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/apps/socket-server/dist apps/socket-server/dist
COPY package.json package.json
EXPOSE 4100
CMD ["node", "apps/socket-server/dist/index.js"]
