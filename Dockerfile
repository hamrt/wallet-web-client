ARG REACT_APP_EULOGIN=https://ecas.ec.europa.eu/cas

# Stage 0: prepare node alpine image
FROM node:12-alpine AS base
RUN apk add --update --no-cache \
  python \
  make \
  g++

## Stage 1: build the wallet 
FROM base AS builder-wallet-ui
WORKDIR /usr/src/app
COPY ./package*.json /usr/src/app/
RUN npm ci --quiet --no-progress
COPY ./ /usr/src/app/
ARG REACT_APP_WALLET
ARG REACT_APP_EULOGIN
ARG REACT_APP_DID_REGISTRY_SC_ADDRESS
ARG REACT_APP_EBSI_ENV
ARG PUBLIC_URL=${REACT_APP_WALLET}
ARG REACT_APP_URL=${PUBLIC_URL}

RUN npm run build

# Stage 2: run nginx
FROM nginx
RUN mkdir -p /app
WORKDIR /app
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid
USER nginx
COPY --from=builder-wallet-ui /usr/src/app/build /app/wallet

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

