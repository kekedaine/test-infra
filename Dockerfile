# FROM node:12-alpine AS builder-node-yarn

# WORKDIR /app

# RUN apk --no-cache add \
#     g++ make python git \
#     && yarn global add node-gyp \
#     && rm -rf /var/cache/apk/*

# ADD package.json yarn.lock /app/
# RUN yarn --pure-lockfile

# ENV PORT=3000
# ENV SERVICE_NAME=
# EXPOSE $PORT

# RUN yarn
# ADD . /app
# RUN yarn build

# CMD ["yarn", "start"]

FROM kekedaine/builder-node-yarn AS builder
FROM kekedaine/runtime-node