# BUILD
FROM node:18-slim AS build

WORKDIR /usr/src

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

# RUNTIME

FROM node:18-slim

WORKDIR /usr/src

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /usr/src/dist ./dist

CMD ["node", "dist/index.js"]
