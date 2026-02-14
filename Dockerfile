
# Stage 1: Builder
FROM oven/bun:1.3.9 AS builder

WORKDIR /app

# Copy dependency files first (for layer caching)
COPY app/package.json app/bun.lockb* ./

RUN bun install --frozen-lockfile

# Copy source code
COPY app/src ./src


# Stage 2: Runtime
FROM oven/bun:1.3.9-slim

WORKDIR /app

# Copy installed dependencies + source from builder
COPY --from=builder /app .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "src/server.js"]
