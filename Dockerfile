FROM node:22-alpine AS base
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/server/package.json apps/server/package.json
COPY apps/client/package.json apps/client/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
WORKDIR /app
COPY . .
RUN pnpm --filter server build
RUN pnpm --filter client build
RUN pnpm --filter server deploy --prod --legacy /prod/server

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /prod/server ./
COPY --from=build /app/apps/client/dist ./public
EXPOSE 3000
CMD ["node", "dist/index.js"]
