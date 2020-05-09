FROM node:12-alpine

ENV PORT=3000
ENV SERVICE_NAME=

EXPOSE $PORT

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && apk del .gyp

ADD package.json /app/

RUN yarn
ADD . /app
RUN yarn build

CMD ["yarn", "start"]