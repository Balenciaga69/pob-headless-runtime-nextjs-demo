<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Identity

`pob-headless-runtime-nextjs-demo` is a local validation UI for the stable `pob-headless-runtime` contract.

It is not:

- a standalone product
- a replacement for the PoB desktop GUI
- a place to invent a second runtime contract

Its job is specific:

- keep one persistent Lua worker alive on the server
- expose typed local Route Handlers over that worker
- give a human-friendly UI for loading builds, reading data, mutating session state, and inspecting payloads
- help validate stable runtime behavior against a real PoB host layout

Treat this repo as a coupled demo surface.
Changes should make runtime validation clearer, not make the app more “product-like” at the cost of correctness.

## Host Assumptions

This app depends on a valid sibling checkout layout:

```text
PathOfBuilding/
├─ src/
├─ runtime/
├─ pob-headless-runtime/
└─ pob-headless-runtime-nextjs-demo/
```

Runtime environment parsing lives in:

- `src/server/pob/env.ts`

Worker boot lives in:

- `src/server/pob/worker.ts`

If `POB_HEADLESS_DIR` or the host layout is wrong, fail clearly.
Do not add fallback guessing logic in client components or route handlers.

## Architecture Map

This repo has a clear top-to-bottom data flow. Preserve it.

1. `src/app/page.tsx`
   Minimal page entry. It should stay thin.

2. `src/features/pob/components/dashboard.tsx`
   Main client composition root for the current demo experience.

3. `src/features/pob/`
   Owns UI-only types, constants, and fetch helpers used by client components.

4. `src/app/api/`
   Owns Next.js Route Handlers.
   These routes validate request bodies, call the server client, and normalize HTTP responses.

5. `src/server/pob/`
   Owns worker protocol, worker lifecycle, runtime env, and the server-side PoB client.

6. `src/lib/contracts/stable.ts`
   Owns the local TypeScript representation of the stable runtime request and response envelope.

7. `contracts/stable/`
   Owns the checked-in contract snapshot and examples used for local reference.

Do not bypass these layers.
Client components should not talk directly to the worker.
Route Handlers should not implement UI state logic.

## Contract Rules

This demo mirrors the stable runtime contract, but it does not expose it raw to the browser.

Use this split consistently:

- browser-facing route payloads may use UI-friendly names such as `itemText`
- server-to-worker payloads should map into the stable runtime method and parameter shape
- stable method names should stay centralized in `src/lib/contracts/stable.ts`

When the upstream runtime contract changes, review all three of these together:

- `src/lib/contracts/stable.ts`
- `contracts/stable/stable_api_v1.json`
- any affected `src/server/pob/client.ts` calls and `src/app/api/.../route.ts` files

Do not update only one layer and assume the others are still correct.

## Design Rules

### Keep the server boundary explicit

Anything that uses:

- `child_process`
- filesystem paths
- environment variables
- worker JSON protocol

must stay in `src/server/pob/`.

Do not leak Node-only logic into `src/features/` or client components.

### Route Handlers stay thin

Each route should do only this:

1. parse and validate request input
2. call `pobClient`
3. return `withRouteResult(...)`

Do not move worker boot logic, contract parsing, or UI formatting into route handlers.

### `pobClient` is the server-side façade

`src/server/pob/client.ts` is the right place to:

- choose the stable method name
- shape worker params
- convert worker failures into `PobClientError`

If a runtime capability is added, wire it here first.

### The dashboard is a composition root, not a dumping ground

`src/features/pob/components/dashboard.tsx` is already large.
Extend it carefully.

If a new capability adds a distinct user workflow, extract a focused component under:

- `src/features/pob/components/`

Do not keep growing the dashboard with large inline rendering blocks if the feature has its own state and view logic.

### UI should reflect the runtime, not reinterpret it

For stable runtime results:

- preserve payload shape where practical
- avoid hand-recomputing values the runtime already calculated
- prefer showing raw JSON or lightly formatted views over building speculative derived logic

This repo is a validation UI first.

## Where To Put Future Changes

Use this placement rule when adding features.

### New stable runtime capability

Touch, in order:

1. `src/lib/contracts/stable.ts` if the stable method list changes
2. `src/server/pob/client.ts`
3. the matching `src/app/api/.../route.ts`
4. `src/features/pob/api.ts` only if the browser needs a new endpoint helper
5. the relevant UI component under `src/features/pob/components/`
6. `contracts/stable/` snapshots and examples if they changed upstream
7. `README.md` and `CHANGELOG.md` if the demo surface changed

### New UI workflow

Prefer adding a focused component under `src/features/pob/components/` and keeping the dashboard as the orchestration layer.

### New request or response type

Prefer adding the UI-facing type in:

- `src/features/pob/types.ts`

Do not overload `src/lib/contracts/stable.ts` with UI-only shapes.

### Shared route error behavior

Keep it in:

- `src/app/api/_shared.ts`

Do not duplicate route error envelopes across handlers.

## Quality Bar

Every change should meet these expectations.

- Keep route handlers small and boring.
- Keep server-only code out of client bundles.
- Validate external input at the route boundary.
- Keep stable method names centralized.
- Reuse the existing request console and JSON preview patterns instead of inventing one-off debug UI.
- Prefer extracting components over expanding an already-large client file.
- Keep type names explicit when payload shape matters.
- Do not claim stronger runtime guarantees than the sibling runtime actually provides.

## What Not To Break

These are the sensitive parts of the repo.

- persistent worker singleton behavior in `src/server/pob/worker.ts`
- stable method list in `src/lib/contracts/stable.ts`
- request and response envelope validation in `src/server/pob/contract.ts`
- route-level error normalization in `src/app/api/_shared.ts`
- the checked-in contract snapshot under `contracts/stable/`

Be careful with these invariants:

- browser code should call local route handlers, not the worker directly
- server code should speak the stable runtime protocol consistently
- runtime changes usually require a dev server restart because the worker is persistent
- the demo should stay honest about being a coupled validation surface

## Testing and Verification

This repo currently relies mainly on static validation.
Before finishing a change, run:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build` when the change affects routes, server code, or the page composition significantly

If a feature changes payload shape or a route contract, manually verify the affected workflow in the browser and compare against the request console output.

Because there is no strong automated UI test suite here yet, do not make broad structural changes casually.

## Project Limits

Current constraints matter.

- The UI is intentionally local-first and validation-oriented.
- The server keeps one persistent worker alive.
- Much of the UI is concentrated in one client component.
- The repo keeps a local contract snapshot that can drift if not maintained.

Improve these constraints carefully.
Do not answer them with a large abstraction layer unless the concrete pain is already visible in code.

## AI Change Workflow

If you are an AI agent editing this repository, follow this order.

1. Read this file, `README.md`, and the relevant contract snapshot.
2. Trace the full path of the feature:
   - browser interaction
   - route handler
   - `pobClient`
   - worker method
3. Decide whether the change is:
   - contract-facing
   - server plumbing
   - UI-only
   - cross-layer
4. Make the smallest change that keeps the layers intact.
5. Update the contract snapshot references and docs if the surface changed.
6. Run lint, typecheck, and the relevant manual validation flow.

If the task touches Next.js framework behavior, read the relevant guide under `node_modules/next/dist/docs/` first.

## Prompting Notes For Future AI Contributors

Use prompts that preserve the architecture.

Good prompt pattern:

“Add `<feature>` to the Next.js demo by wiring one new route through `pobClient`, keeping the server/client boundary explicit, updating the local contract snapshot if needed, and exposing the workflow through a focused component under `src/features/pob/components/`.”

Bad prompt pattern:

“Make this app more scalable and enterprise-ready.”

The first respects the actual purpose of the repo.
The second usually causes unnecessary abstraction and UI drift.
