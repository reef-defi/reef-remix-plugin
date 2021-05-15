FROM node:14.15.0 as build-stage

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn
COPY ./ /app/
RUN NODE_ENV=production yarn build

FROM nginx:latest
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80

WORKDIR /usr/share/nginx/html

# CMD ["nginx -g \"daemon off;\""]
