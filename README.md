# unplugin-build-meta

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Import build metadata into your JavaScript/TypeScript projects for Vite, Webpack, Rollup, esbuild and more. Powered by [unplugin](https://github.com/unjs/unplugin).

<p align="center">
<br />
<a href="https://stackblitz.com/github/luxass/unplugin-build-meta/tree/main/examples/vite-vue?file=vite.config.ts"><img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" /></a>
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
import YAMLPlugin from "unplugin-build-meta/vite";

export default defineConfig({
  plugins: [
    YAMLPlugin({ /* options */ }),
  ],
});
```

<br/></details>

<details>
<summary>Rollup</summary><br/>

```ts
// rollup.config.js
import YAMLPlugin from "unplugin-build-meta/rollup";

export default {
  plugins: [
    YAMLPlugin({ /* options */ }),
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
import YAMLPlugin from "unplugin-build-meta/astro";

// https://astro.build/config
export default defineConfig({
  integrations: [
    YAMLPlugin({
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
import YAMLPlugin from "unplugin-build-meta/esbuild";

build({
  /* ... */
  plugins: [
    YAMLPlugin({
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
import YAMLPlugin from "unplugin-build-meta/farm";

export default defineConfig({
  vitePlugins: [
    vue(),
  ],
  plugins: [
    YAMLPlugin({
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
import YAMLPlugin from "unplugin-build-meta/rspack";

/** @type {import('@rspack/core').Configuration} */
export default {
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html"
    }),
    YAMLPlugin()
  ],
};
```

<br/></details>

<details>
<summary>Rolldown (Experimental)</summary><br/>

```ts
// rolldown.config.js
import { defineConfig } from "rolldown";
import YAMLPlugin from "unplugin-build-meta/rolldown";

export default defineConfig({
  input: "./index.js",
  plugins: [
    YAMLPlugin({
      /* options */
    }),
  ],
});
```

<br/></details>

## Configuration

```ts
YAMLPlugin({
  include: [
    /\.yamlcustom$/, // .yamlcustom
  ],
  parserOptions: {
    // see yaml load options
  }
});
```

```ts
// Configure which modules to include
export default defineConfig({
  plugins: [
    buildMetaPlugin({
      modules: ["git"] // Include just the git module (default includes all modules)
    }),
  ],
});
```

## Modules

### Git Module

The git module provides access to repository metadata from your code.

Import it in your code:

```ts
// Import all git metadata
import * as git from "virtual:build-meta/git";

// Or import specific values
import { author, branch, sha } from "virtual:build-meta/git";
```

Available properties (all properties are nullable):

| Property | Type | Description |
|----------|------|-------------|
| `branch` | `string \| null` | Current git branch name |
| `sha` | `string \| null` | Full git commit hash |
| `abbreviatedSha` | `string \| null` | First 10 characters of the commit hash |
| `commitMessage` | `string \| null` | Latest commit message |
| `author` | `string \| null` | Commit author name |
| `authorEmail` | `string \| null` | Commit author email |
| `authorDate` | `string \| null` | Commit author date |
| `committer` | `string \| null` | Committer name |
| `committerEmail` | `string \| null` | Committer email |
| `committerDate` | `string \| null` | Committer date |
| `tag` | `string \| null` | Current tag (if any) |
| `tags` | `string[] \| null` | All tags pointing at current commit |
| `lastTag` | `string \| null` | Latest tag in the repository |
| `github` | `string \| null` | GitHub repository URL (if applicable) |

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
