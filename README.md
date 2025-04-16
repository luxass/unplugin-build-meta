# unplugin-build-meta

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Import build metadata into your JavaScript/TypeScript projects for Vite, Webpack, Rollup, esbuild and more. Powered by [unplugin](https://github.com/unjs/unplugin).

<p align="center">
<br />
<a href="https://stackblitz.com/github/luxass/unplugin-build-meta/tree/main/examples/vite?file=vite.config.ts"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" /></a>
</p>

## Install

```bash
npm install -D unplugin-build-meta
```

## Usage

> [!TIP]
> You can view all examples [here](./examples).

<details>
<summary>Vite</summary><br/>

```ts
// vite.config.ts
import buildMeta from "unplugin-build-meta/vite";

export default defineConfig({
  plugins: [
    buildMeta({ /* options */ }),
  ],
});
```

<br/></details>

<details>
<summary>Rollup</summary><br/>

```ts
// rollup.config.js
import buildMeta from "unplugin-build-meta/rollup";

export default {
  plugins: [
    buildMeta({ /* options */ }),
  ],
};
```

<br/></details>

<details>
<summary>Webpack</summary><br/>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("unplugin-build-meta/webpack").default({ /* options */ }),
  ],
};
```

<br/></details>

<details>
<summary>Nuxt</summary><br/>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ["unplugin-build-meta/nuxt", { /* options */ }]
  ],
});
```

<br/></details>

<details>
<summary>Astro</summary><br/>

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import buildMeta from "unplugin-build-meta/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    buildMeta({
      /* options */
    })
  ]
});
```

<br/></details>

<details>
<summary>esbuild</summary><br/>

```ts
// esbuild.config.js
import { build } from "esbuild";
import buildMeta from "unplugin-build-meta/esbuild";

build({
  /* ... */
  plugins: [
    buildMeta({
      /* options */
    }),
  ],
});
```

<br/></details>

<details>
<summary>Farm</summary><br/>

```ts
// farm.config.ts
import { defineConfig } from "@farmfe/core";
import vue from "@vitejs/plugin-vue";
import buildMeta from "unplugin-build-meta/farm";

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  plugins: [
    buildMeta({
      /* options */
    })
  ]
});
```

<br/></details>

<details>
<summary>Rspack</summary><br/>

```ts
// rspack.config.mjs
import rspack from "@rspack/core";
import buildMeta from "unplugin-build-meta/rspack";

/** @type {import('@rspack/core').Configuration} */
export default {
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html"
    }),
    buildMeta()
  ],
};
```

<br/></details>

<details>
<summary>Rolldown (Experimental)</summary><br/>

```ts
// rolldown.config.js
import { defineConfig } from "rolldown";
import buildMeta from "unplugin-build-meta/rolldown";

export default defineConfig({
  input: "./index.js",
  plugins: [
    buildMeta({
      /* options */
    }),
  ],
});
```

<br/></details>

## Configuration

```ts
buildMeta({
  // Whether to enable the git module (enabled by default)
  git: true,

  // Additional custom modules to include
  extraModules: [
    // Your custom modules here
  ]
});
```

By default, the git module is enabled. You can:
- Disable the git module by setting `git: false`
- Add custom modules using the `extraModules` array
- Create custom modules using `defineBuildMetaModule`

## Modules

### Git Module

The git module provides access to repository metadata from your code.

Import it in your code:

```ts
// Import all git metadata
import * as git from "virtual:build-meta/git";

// Or import specific values
import { branch, sha, shortSha } from "virtual:build-meta/git";
```

Available properties (all properties are nullable):

| Property | Type | Description |
|----------|------|-------------|
| `branch` | `string \| null` | Current git branch name |
| `sha` | `string \| null` | Full git commit hash |
| `shortSha` | `string \| null` | First 10 characters of the commit hash |
| `latestCommitMessage` | `string \| null` | Latest commit message |
| `commitAuthorName` | `string \| null` | Commit author name |
| `commitAuthorEmail` | `string \| null` | Commit author email |
| `commitAuthorDate` | `string \| null` | Commit author date |
| `commitCommitterName` | `string \| null` | Committer name |
| `commitCommitterEmail` | `string \| null` | Committer email |
| `commitCommitterDate` | `string \| null` | Committer date |
| `tag` | `string \| null` | Current tag (if any) |
| `tags` | `string[] \| null` | All tags pointing at current commit |
| `lastTag` | `string \| null` | Latest tag in the repository |
| `repositoryUrl` | `string \| null` | Repository URL (for GitHub repositories) |

### TypeScript

To get proper type support, make sure to include the type declarations:

```json
{
  "compilerOptions": {
    "types": [
      "unplugin-build-meta/types"
    ]
  }
}
```

## 📄 License

Published under [MIT License](./LICENSE).

[npm-version-src]: https://img.shields.io/npm/v/unplugin-build-meta?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/unplugin-build-meta
[npm-downloads-src]: https://img.shields.io/npm/dm/unplugin-build-meta?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/unplugin-build-meta
