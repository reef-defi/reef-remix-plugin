FROM node:14.15.0 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn
COPY . .
RUN yarn build

FROM nginx:latest
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html