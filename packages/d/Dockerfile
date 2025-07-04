FROM node:22-alpine AS base
ENV TURBO_TELEMETRY_DISABLED=1
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn turbo run build --filter=@monorepo/d
RUN node ./scripts/prune-docker.mjs @monorepo/d

FROM base AS installer
WORKDIR /app
COPY . .
RUN yarn workspaces focus @monorepo/d --production

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner
WORKDIR /app

COPY --chown=nonroot --from=installer /app/node_modules /app/node_modules
COPY --chown=nonroot --from=builder /app/docker /app

USER nonroot

CMD ["packages/d/dist/index.js"]
