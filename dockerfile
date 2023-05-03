FROM node:18-alpine


RUN apk add --update tzdata
# ENV NODE_OPTIONS=--max-old-space-size=8192
# ENV TZ="Asia/Jakarta"

WORKDIR /src

COPY package*.json ./

COPY . .

RUN apk add chromium

RUN npm ci

RUN npm run build
