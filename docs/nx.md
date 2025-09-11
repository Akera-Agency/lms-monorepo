# 000.0 — Purpose & Principles

**Goal:** Build a **scalable, maintainable monorepo** for TypeScript, React, Elysia.js, and NestJS — optimized for **speed** and **clarity** as the team and codebase grow.

**Guiding principles:**

- **Single source of truth** for shared code → packages live in `/packages`.
- **Apps are independent**, only depend on packages.
- **Strict boundaries** enforced by Nx rules to prevent spaghetti dependencies.
- **Smart automation** → generate, lint, build, and test only what changed.
- **Developer happiness** → fast feedback, consistent tooling, minimal cognitive overhead.

---

# 001.0 — Why This Matters

When multiple teams and apps share a codebase, things can **spiral out of control** quickly:

- Apps start depending on each other → deployment coupling and hidden breakage.
- Shared logic gets duplicated or inconsistently implemented.
- Build times explode as the repo grows.
- Onboarding new developers becomes painful — they don’t know _where code should live_ or _what’s safe to change_.

By following this structure:

1. **Independent apps**
   - You can deploy, test, and scale each app without worrying about others.
   - Example: Your LMS web app doesn’t break if someone changes the e-commerce backend.
2. **Single source of truth in `/packages`**
   - Shared utilities, models, contracts, and UI components live in one place.
   - No code duplication → no “bug fixed here but missed there”.
3. **Fast pipelines with Nx caching**
   - Nx knows exactly which code depends on what → it only rebuilds and tests the minimal set of affected projects.
   - This keeps CI and local dev _blazing fast_.

---

# 002.0 — Problems This Solves

| **Problem**                        | **How This Doc Solves It**                                           |
| ---------------------------------- | -------------------------------------------------------------------- |
| Apps depend directly on each other | Strict rule: Apps can **only depend on packages**, never other apps. |
| Code duplication across apps       | Centralize shared code in `/packages`.                               |
| Confusing folder structures        | Clear, predictable conventions for folder layout and naming.         |
| Slow builds & tests                | Nx affected graph + smart caching = only run what changed.           |
| Fragile FE/BE type syncing         | Shared `contracts` package with Zod → FE/BE stay type-safe.          |
| Env chaos                          | Clear rules for `.env` handling and config packages.                 |
| New dev onboarding takes weeks     | Generators, clear docs, and tags → consistent, fast ramp-up.         |

---

# 003.0 — Workspace Layout

```
apps/                  # Standalone deployable apps
  web/                 # React frontend (Next.js or Vite)
  admin/               # Admin dashboard
  marketing/           # Public marketing site
  mobile/              # React Native app
  api-nest/            # NestJS backend service
  api-scheduler/       # Background jobs service

packages/              # Reusable code (FE & BE)
  shared/
    util/              # Pure utility functions (no env or network access)
    models/            # Shared TypeScript models
    contracts/         # Zod schemas + API contracts
  lms/                 # LMS domain
    feature/           # State orchestration / hooks
    ui/                # UI components
    data-access/       # API clients (frontend) or DB repositories (backend)
    util/              # LMS-specific helpers
  ecommerce/           # E-commerce domain
    feature/
    ui/
    data-access/
    util/
tools/                 # Custom Nx generators + scripts

```

---

# 004.0 — Core Rules

## 004.1 — Apps are **Standalone**

- Apps live in `/apps/`.
- They **cannot** import anything from another app.
- They **only import from `/packages`**.
- This ensures clean deployment boundaries and eliminates hidden coupling.

Example (✅ **Allowed**):

```
apps/web → imports → packages/lms-ui
apps/web → imports → packages/shared-contracts

```

Example (❌ **Forbidden**):

```
apps/web → imports → apps/admin
apps/admin → imports → apps/api-nest

```

## 004.2 — Packages Are the Source of Truth

- All shared code lives in `/packages/`.
- `apps/` are thin shells that glue together packages and runtime configuration.

---

# 005.0 — Naming, Tags & Boundaries

## 005.1 — Package Naming

Format: `<scope>-<type>`

- **scope** = domain (`lms`, `ecommerce`, `shared`)
- **type** ∈ {`feature`, `ui`, `data-access`, `util`, `models`, `contracts`}

Examples:

- `lms-ui`, `lms-data-access`, `shared-contracts`.

---

# 006.0 — Enforcing Boundaries with Nx

```json
// root .eslintrc.js
rules: {
  '@nx/enforce-module-boundaries': [
    'error',
    {
      enforceBuildableLibDependency: true,
      allow: [],
      depConstraints: [
        // apps → only depend on packages
        { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:package'] },

        // UI → can depend on util/models/contracts within same scope or shared
        { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:util','type:models','type:contracts','scope:shared','scope:<same>'] },

        // shared → can only depend on other shared
        { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: ['scope:shared'] }
      ]
    }
  ]
}

```

---

# 007.0 — Contracts & FE/BE Sync

Use a **Zod-first approach** to keep frontend and backend **in sync**.

```tsx
// packages/shared/contracts/course.ts
import { z } from 'zod';

export const Course = z.object({
  id: z.string().uuid(),
  title: z.string(),
  published: z.boolean(),
});

export type Course = z.infer<typeof Course>;
```

- **Frontend:** use these schemas to type API clients and validate responses.
- **Backend (Nest or Elysia):** use schemas for input/output validation.

This guarantees that **breaking API changes fail at compile time**.

---

# 008.0 — Environment & Config Rules

- Apps own their `.env` files.
- Packages **must never** read directly from `process.env`.
- Create a `config` package that:
  - Reads env variables at runtime.
  - Validates them with Zod.
  - Exports a strongly-typed config object.

---

# 009.0 — Caching, Targets & Bun

## 009.1 — Default Targets (`nx.json`)

```json
{
  "targetDefaults": {
    "build": { "cache": true },
    "test": { "cache": true },
    "lint": { "cache": true },
    "typecheck": { "cache": true }
  }
}
```

## 009.2 — Bun Commands

```bash
bun i                # Install dependencies
bun run nx serve web # Run a frontend app
bun run nx serve api-nest # Run backend
bun run nx affected -t lint,typecheck,test,build

```

---

# 010.0 — Affected Workflow

- **Local Dev**:
  `bun run nx affected:graph` → visualize dependencies.
- **Before Commit**:
  `bun run nx affected -t lint,test,typecheck`.
- **CI**:
  ```yaml
  - run: bun run nx affected -t lint,typecheck,test,build --parallel
  ```

---

# 011.0 — Testing Strategy

- **Unit tests** → close to source in `__tests__`.
- **Component tests** → React Testing Library.
- **E2E tests** → Playwright for apps.
- **Contract tests** → Validate BE against Zod contracts.

---

# 012.0 — Performance & DX Tips

- Use **barrel files** (`index.ts`) to curate package exports.
- Keep packages small and domain-focused.
- Turn packages that need Node consumption into `buildable: true`.
- Use `tsup` or `esbuild` for **tiny backend bundles**.

---

# 013.0 — Why Nx Over Competitors

| **Feature**                            | **Nx**                    | **Turborepo**  | **Lerna** |
| -------------------------------------- | ------------------------- | -------------- | --------- |
| Dependency graph                       | ✅ Auto                   | ❌ Manual      | ❌ None   |
| Task scheduling & caching              | ✅ Smart (local + remote) | ⚠️ Limited     | ❌        |
| Built-in generators                    | ✅ Yes                    | ❌ No          | ❌        |
| Enforceable boundaries                 | ✅ Yes                    | ❌ No          | ❌        |
| Polyglot support (React, Elysia, Nest) | ✅ Excellent              | ⚠️ Limited     | ❌        |
| Remote caching (team-wide)             | ✅ Built-in               | ⚠️ Third-party | ❌        |

**Why Nx wins:**

- **Graph-based intelligence:** knows exactly what to rebuild.
- **Fast CI:** no wasted builds, only affected code runs.
- **Built-in code generation:** ensures structure and tags stay consistent.
- **Strict boundaries:** keeps apps independent and scalable.

---

# 014.0 — Quick Commands Cheat Sheet

```bash
# Generate a new package
bun run nx g @nx/js:lib lms-ui --directory=lms --tags="scope:lms,type:ui,platform:browser"

# See dependency graph
bun run nx graph

# Run all tests only for affected packages/apps
bun run nx affected -t test

# Start a specific app
bun run nx serve web

```

---

# 015.0 — Final Thoughts

By enforcing these practices:

- Each app remains **deployable and testable on its own**.
- Shared logic lives in **packages**, not copied between apps.
- Nx automatically keeps builds and tests **fast** even as the codebase grows.
- The team has **clear rules**, reducing onboarding friction and bugs.

This structure isn’t just for today’s needs — it’s built to **scale with your company** as more apps, domains, and developers come onboard.
