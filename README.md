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

`pnpm init`
`git init` (if not already done)
`echo -e "node_modules" > .gitignore`
`npm pkg set type="module"`
`touch pnpm-workspace.yaml` add the `packages/*` directory

### Initialize the common package

`mkdir packages`
`cd packages`
`pnpm create vite common --template vanilla-ts`
`cd ../`
`pnpm install`
`npm pkg set scripts.common="pnpm --filter common"`
clear out main.ts. Can use this to export types common to client and server now.
`cd packages/common`
`rm -rf src/style.css src/counter.ts` deletes sample files
`pnpm common add -D vite-plugin-dts` for auto-generating types
`touch vite.config.ts`

```
import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: { lib: { entry: resolve(__dirname, 'src/main.ts'), formats: ['es'] } },
  resolve: { alias: { src: resolve('src/') } },
  plugins: [dts()],
})
```

Update `package.json` for common

```
{
 ...,
 "main": "./dist/common.js",
 "types": "./dist/main.d.ts",
}
```

Run `pnpm run dev` to verify the output in dist folder

### Initialize the client package

In packages directory
`pnpm create vite client --template svelte-ts`
`cd ..`
pnpm install
npm pkg set scripts.client="pnpm --filter client"
