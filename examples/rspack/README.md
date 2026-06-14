# Rspack + Build Meta

Plain HTML/CSS example for `unplugin-build-meta` with Rspack.

## Get started

```bash
pnpm install
pnpm --filter @unplugin-build-meta/rspack dev
```

## Build

```bash
pnpm --filter @unplugin-build-meta/rspack build
```

The page is mounted from `src/main.ts`, imports `virtual:build-meta/git`, and renders the metadata into `#root` without a UI framework.
