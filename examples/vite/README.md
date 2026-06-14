# Vite + Build Meta

Plain HTML/CSS example for `unplugin-build-meta` with Vite.

## Get started

```bash
pnpm install
pnpm --filter @unplugin-build-meta/vite dev
```

## Build

```bash
pnpm --filter @unplugin-build-meta/vite build
```

The page is mounted from `src/main.ts`, imports `virtual:build-meta/git`, and renders the metadata into `#root` without a UI framework.
