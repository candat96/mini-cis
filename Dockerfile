FROM node:20-alpine as build

WORKDIR /app

COPY package.json /app/

RUN yarn install

COPY . /app/

RUN npm run build

FROM node:20-alpine as deploy

RUN npm i -g pm2

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

CMD [ "pm2-runtime", "dist/apps/main.js" ]