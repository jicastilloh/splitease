FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

FROM base AS deps

COPY api/package.json api/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY api/nest-cli.json api/tsconfig.build.json api/tsconfig.json ./
COPY api/src ./src
COPY api/test ./test

RUN pnpm build

FROM base AS production

ENV NODE_ENV=production

COPY api/package.json api/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start:prod"]
