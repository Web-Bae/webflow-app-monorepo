# webflow-app-monorepo

template for creating webflow apps with CF Worker Hono API and Webflow designer extension

## Instructions

1. Clone this repo
2. Run `pnpm install`
3. The common package in `packages/common` contains the shared types and utilities
4. The client package in `packages/client` contains the designer extension
5. The server package in `packages/server` contains the CF Worker API with Hono JS

## Commands for local development

- `cd packages/common` then `pnpm run build` to build the common package in watch mode.
- `cd packages/client` then `pnpm run dev` to start the designer extension in watch mode.
- `cd packages/server` then `pnpm run dev` to start the CF Worker API in dev mode.

## Commands for deployment

- `cd packages/client` then `pnpm run build` to output your bundle.zip for Webflow.
- `cd packages/server` then `pnpm run deploy` to output your worker.js for CF Worker.

## Steps to create this monorepo from scratch (WIP)

### Create the monorepo

https://dev.to/vinomanick/create-a-monorepo-using-pnpm-workspace-1ebn

### Create the Designer Extension

https://developers.webflow.com/designer/reference/webflow-cli

### Create the CF Worker Hono JS Backend

https://developers.cloudflare.com/pages/framework-guides/deploy-a-hono-site/
