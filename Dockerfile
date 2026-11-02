
# ---------------------------------
# Stage 1: Dependencies
# ---------------------------------

FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# ---------------------------------
# Stage 2: TypeScript build
# ---------------------------------

FROM node:22-bookworm-slim AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY tsconfig.json ./
COPY src ./src
COPY package.json ./

RUN npm run build

# Verify the production entry file exists
RUN test -f dist/app.js


# ---------------------------------
# Stage 3: Production
# ---------------------------------

FROM node:22-bookworm-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN mkdir -p /app/logs && chown -R node:node /app/logs

USER node

EXPOSE 5000

CMD ["node", "dist/app.js"]
