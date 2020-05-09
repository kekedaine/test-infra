FROM node:10.18.0-alpine

ENV PORT=3000
ENV SERVICE_NAME=

EXPOSE $PORT

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && apk del .gyp

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]