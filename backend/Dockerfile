# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .
# RUN npm run build

# FROM node:22-alpine AS production

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci --omit=dev

# COPY --from=builder /app/dist ./dist

# CMD ["node", "dist/main.js"]
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN echo "=== BUILDER DIST ===" && ls -la /app && ls -la /app/dist || true

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
RUN echo "=== PRODUCTION DIST ===" && ls -la /app && ls -la /app/dist || true

CMD ["node", "dist/main.js"]