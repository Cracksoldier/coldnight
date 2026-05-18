---
title: Structuring Monorepos with Turborepo
date: 2024-10-08 09:00:00
categories: [Tools]
tags: [monorepo, turborepo, javascript, build-systems]
excerpt: Turborepo brings incremental builds and remote caching to JavaScript monorepos without the complexity of Bazel or Nx. Here's how to structure one from scratch.
---

Monorepos make sense when multiple packages share code, tooling, or deployment pipelines. The cost is build system complexity. Turborepo is the lowest-friction way to manage that complexity in a JavaScript/TypeScript codebase.

## What Turborepo actually does

Turborepo is a task runner that understands dependencies between packages. It builds a graph of your tasks and runs them in the correct order, in parallel where possible, and skips tasks whose inputs haven't changed.

```
apps/
  web/        # Next.js app
  api/        # Express API
packages/
  ui/         # shared React components
  utils/      # shared utilities
  config/     # shared ESLint/TypeScript config
```

If `web` depends on `ui` and `utils`, Turborepo ensures those packages are built before building `web`. If you only change `web`, it skips rebuilding `ui` and `utils`.

## Setting up

```bash
npx create-turbo@latest
```

Or add to an existing repo:

```bash
npm install turbo --save-dev
```

The key file is `turbo.json` at the root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`^build` means "run `build` in all dependencies first". `outputs` tells Turborepo what to cache.

## Package structure

Each package has its own `package.json` declaring its dependencies on other workspace packages:

```json
{
  "name": "@myapp/web",
  "dependencies": {
    "@myapp/ui": "*",
    "@myapp/utils": "*"
  }
}
```

The `*` version means "whatever is in the workspace". Your package manager (npm, pnpm, yarn) resolves these to local packages.

## Remote caching

The best feature: share the build cache across machines and CI.

```bash
npx turbo login
npx turbo link
```

After linking, a build on your machine populates the remote cache. Your CI run the next day downloads the cached outputs instead of rebuilding. On a large monorepo this can cut CI time from 20 minutes to under 2.

You can self-host the cache server if you don't want to use Vercel's infrastructure — the [remote caching protocol](https://turbo.build/repo/docs/core-concepts/remote-caching) is open.

## What to put in packages

The common mistake is under-splitting. If `web` and `api` both import from the same directory, that directory should be a package.

Good candidates for extraction:
- **Shared types** — TypeScript interfaces used by both frontend and backend
- **Validation schemas** — Zod schemas that validate the same data on both sides
- **UI components** — any React components used by more than one app
- **Config** — `tsconfig.json` base, ESLint config, Prettier config

A `config` package that just exports shared tooling config is small but pays dividends in consistency.

## The trade-offs

Turborepo is not the right choice if:
- Your team isn't already comfortable with npm workspaces
- You have a single deployable unit with no genuine package boundaries
- You need polyglot builds (Go, Rust, Python alongside JS) — Bazel handles this better

For a TypeScript-only codebase with 2–10 deployable services sharing code, Turborepo is close to a no-brainer.
