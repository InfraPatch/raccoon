FROM node:20-alpine

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
  yarn run build:ws && \
  yarn cache clean

RUN addgroup --system --gid 1002 nodejs && adduser --system --uid 1002 ws

USER ws
EXPOSE 4679
CMD ["node", "dist/ws/chat/index.js"]
