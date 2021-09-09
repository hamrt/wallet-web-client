## Stage 1: build the wallet
FROM node:12.19.1-alpine3.12@sha256:3ae30348acd445501758896f691106cbc32111f3525651c7256a7df75aa8a97d AS builder-wallet-ui
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN npx install-peerdeps -Y eslint-config-react-app
RUN npx browserslist@latest --update-db
RUN yarn install --frozen-lockfile --silent
COPY ./ /usr/src/app/
ARG REACT_APP_WALLET
ARG REACT_APP_EULOGIN
ARG REACT_APP_EBSI_ENV
ARG REACT_APP_WALLET_API
ARG REACT_APP_ID_HUB_API
ARG REACT_APP_DEMO
ARG PUBLIC_URL=${REACT_APP_WALLET}
ARG REACT_APP_URL=${PUBLIC_URL}
RUN yarn build

# Stage 2: run nginx
FROM nginx:1.19.2-alpine@sha256:a97eb9ecc708c8aa715ccfb5e9338f5456e4b65575daf304f108301f3b497314
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

COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
