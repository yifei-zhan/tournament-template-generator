FROM tournament-base as build

# RUNTIME
FROM node:18-bullseye

WORKDIR /usr/src

COPY package.json package-lock.json ./

COPY --from=build /usr/src/dist ./dist

COPY --from=build /usr/src/node_modules ./node_modules

CMD ["node", "dist/index.js"]
