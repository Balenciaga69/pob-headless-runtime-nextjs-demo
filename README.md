# PoB Headless Runtime Demo

`pob-headless-runtime-nextjs-demo` is not a standalone desktop product and not a native desktop app.

It is a small local web UI used to:

- demonstrate the stable `pob-headless-runtime` contract
- validate that stable routes behave correctly against a real PoB host runtime
- inspect request / response payloads during local development

This repository is tightly coupled to `pob-headless-runtime`. Treat it as a demo and validation surface, not as an independent application.

## What This Depends On

This repo only works when all of the following exist together:

- Windows
- `Node.js` with `pnpm`
- `LuaJIT`
- a compatible Path of Building host repository
- a compatible `pob-headless-runtime` checkout

Expected layout:

```text
PathOfBuilding/
├─ src/
├─ runtime/
├─ pob-headless-runtime/
└─ pob-headless-runtime-nextjs-demo/
```

The app calls into `pob-headless-runtime`, and `pob-headless-runtime` in turn depends on the parent Path of Building host layout.

If that layout is wrong, this demo app cannot function.

## Compatible Runtime Baseline

This demo is written against the maintained stable contract from:

- sibling repository: `pob-headless-runtime`
- contract: `contracts/stable_api_v1.json`

The current local compatibility baseline used during development is the same one documented by the runtime:

- host repo: `https://github.com/PathOfBuildingCommunity/PathOfBuilding`
- host branch: the official community default branch
- runtime engine version observed in transport tests: `2.63.0`

If you point this demo at a different PoB fork, branch, or runtime revision, the UI may still start, but requests can fail or behave differently if the upstream object model changed.

## Purpose and Scope

This demo currently exists to exercise the stable runtime surface:

- runtime health / status
- build load by file, XML, or build code
- build save to file, XML, or build code
- summary reads
- raw stats reads
- GUI-like detailed display stats
- preview item swap detailed display stats without mutating the session
- equipment listing / equip action
- full item listing
- skill listing / active skill selection
- stable config reads / writes
- request console for debugging

This repo does not try to expose the full PoB GUI.

## Stack

- Next.js App Router
- Route Handlers
- TypeScript
- Tailwind CSS
- lightweight shadcn-style UI primitives
- a server-managed persistent single Lua worker

Important implementation detail:

- the app keeps one persistent worker process alive
- changing Lua runtime code usually requires restarting the demo server

## Environment

Create `.env.local` in this repository:

```bash
POB_HEADLESS_DIR=X:\dev\PathOfBuilding\pob-headless-runtime
POB_HEADLESS_LUA_BIN=luajit
POB_HEADLESS_MAX_FRAMES=200
POB_HEADLESS_MAX_SECONDS=5
POB_HEADLESS_REQUEST_TIMEOUT_MS=30000
```

Environment notes:

- `POB_HEADLESS_DIR` must point at the `pob-headless-runtime` repository root
- the runtime repo must itself sit inside a compatible Path of Building host layout
- `POB_HEADLESS_LUA_BIN` must resolve to a working `luajit`

## Run

```bash
pnpm install
pnpm dev
```

Then open:

- [http://localhost:3000](http://localhost:3000)

## Validation Use

This demo is most useful when you want to verify the stable runtime against a real build.

Typical flow:

1. Start the app.
2. Ping runtime health / status.
3. Load a build by file path, XML, or build code.
4. Inspect summary, raw stats, and detailed display stats.
5. Compare the results with PoB GUI when debugging build state differences.

Because the worker is persistent, restart `pnpm dev` after changing runtime Lua files.

## Internal Contract Snapshot

This repository keeps its own copy of the stable runtime contract for UI development:

- `contracts/stable/stable_api_v1.json`
- `contracts/stable/examples/`

That snapshot should stay aligned with the upstream runtime contract.

If the stable runtime surface changes, update:

- this README
- `CHANGELOG.md`
- local contract snapshot files
- route handlers / client types
- any affected UI panels

## Non-Goals

This repository is not:

- a native desktop app
- a production-ready product UI
- a replacement for PoB GUI
- a standalone automation runtime

It is a tightly-coupled demo and validation interface for `pob-headless-runtime`.
