FROM node:20-alpine AS build

ENV NODE_OPTIONS=--max_old_space_size=4096 \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /srv

COPY yarn.lock package.json /srv/

RUN \
  yarn install --production=false --ignore-engines --frozen-lockfile && \
  yarn cache clean && \
  rm -rf /tmp/*

COPY . /srv

RUN \
  yarn run build && \
  yarn cache clean

FROM node:20-alpine

ENV NODE_ENV production
WORKDIR /srv

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /srv/assets ./assets
COPY --from=build --chown=nextjs:nodejs /srv/content ./content
COPY --from=build --chown=nextjs:nodejs /srv/public ./public
COPY --from=build --chown=nextjs:nodejs /srv/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /srv/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /srv/node_modules/typeorm /srv/node_modules/typeorm

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
