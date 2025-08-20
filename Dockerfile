# Multi-stage Dockerfile for Next.js (build -> production)
FROM node:current-alpine3.22 AS builder
WORKDIR /app

# Copy package manifests first to leverage Docker cache
COPY package*.json ./

# Install dependencies (use npm ci when lockfile exists, fall back to npm install)
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install; fi

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:current-alpine3.22 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only what's needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]


# docker-compose up --build -d web
# docker-compose up dev