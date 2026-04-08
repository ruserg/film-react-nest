# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app

ARG VITE_API_URL=http://localhost/api/afisha
ARG VITE_CDN_URL=http://localhost/content/afisha
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CDN_URL=${VITE_CDN_URL}

COPY package*.json ./
RUN npm ci \
  && ARCH="$(uname -m)" \
  && if [ "$ARCH" = "aarch64" ]; then npm i --no-save @rollup/rollup-linux-arm64-gnu; else npm i --no-save @rollup/rollup-linux-x64-gnu; fi

COPY . .
RUN npm run build

FROM alpine:3.20 AS export
WORKDIR /app
COPY --from=build /app/dist ./dist
CMD ["sh", "-c", "mkdir -p /output && rm -rf /output/* && cp -r /app/dist/. /output/ && echo Frontend dist copied to volume"]
