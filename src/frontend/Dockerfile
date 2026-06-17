# syntax=docker/dockerfile:1
#
# Multi-stage build for the FinPlan SPA: build the static bundle with Node, then serve it from
# an unprivileged nginx. Auth0/OIDC config is injected at *runtime* (see docker-entrypoint.d),
# so one image promotes across every environment.

ARG NODE_VERSION=24

# Pin the build to the native build platform: the SPA bundle (dist/) is static and
# architecture-independent, so there's no reason to run npm ci / npm run build under
# arm64 QEMU emulation (which is painfully slow). Only the final nginx stage is built
# per-target-arch. BUILDPLATFORM is auto-provided by BuildKit.
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

# Install against the lockfile first for a cached dependency layer.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# nginx-unprivileged listens on 8080 and runs as uid 101 (non-root) out of the box.
# 1.30 is the current stable track (even minor); pin to it to stay on a maintained Alpine.
FROM nginxinc/nginx-unprivileged:1.30-alpine AS final

# Patch OS packages flagged by the image scanner: even the latest base lags a few
# days behind Alpine's security releases (notably openssl), so apply the newest
# fixes from the Alpine repos. Needs root, then drops back to the unprivileged
# nginx user (uid 101) the base image runs as.
USER root
RUN apk upgrade --no-cache
USER 101

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --chmod=0755 docker-entrypoint.d/40-render-config.sh /docker-entrypoint.d/40-render-config.sh
COPY --chmod=0755 docker-entrypoint.d/45-render-proxy.sh /docker-entrypoint.d/45-render-proxy.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
# Base image's entrypoint runs /docker-entrypoint.d/*.sh (rendering /config.js) then starts nginx.
