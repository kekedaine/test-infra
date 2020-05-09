FROM node:12-alpine

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && apk del .gyp

ENV PORT=3000
ENV SERVICE_NAME=
EXPOSE $PORT

ADD package.json /app/

RUN yarn
ADD . /app
RUN yarn build

CMD ["yarn", "start"]