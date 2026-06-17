# syntax=docker/dockerfile:1
#
# Multi-stage build for the FinPlan SPA: build the static bundle with Node, then serve it from
# an unprivileged nginx. Auth0/OIDC config is injected at *runtime* (see docker-entrypoint.d),
# so one image promotes across every environment.

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

# Install against the lockfile first for a cached dependency layer.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# nginx-unprivileged listens on 8080 and runs as uid 101 (non-root) out of the box.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS final

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=0755 docker-entrypoint.d/40-render-config.sh /docker-entrypoint.d/40-render-config.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
# Base image's entrypoint runs /docker-entrypoint.d/*.sh (rendering /config.js) then starts nginx.
