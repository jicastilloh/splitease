# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copia lock y manifest
COPY package.json pnpm-lock.yaml ./

# Instala pnpm y dependencias usando el lockfile
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile

# Copia el resto del código (sin node_modules)
COPY . .

# Build del proyecto
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Copia artefactos de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Instala solo dependencias de producción
RUN npm install -g pnpm && pnpm install --prod --no-frozen-lockfile
RUN npm install -g @nestjs/cli
# Comando por defecto
CMD ["node", "dist/main.js"]