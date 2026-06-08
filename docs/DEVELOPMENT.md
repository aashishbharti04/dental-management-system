# Development Guide

## Prerequisites

- Node.js ≥ 18.17
- A MySQL server (local install, Docker, or a hosted instance)
- Git

## Setup

```bash
git clone https://github.com/aashishbharti04/dental-management-system.git
cd dental-management-system
npm install
cp .env.example .env          # edit DB_* and AUTH_SECRET
npm run db:init               # create database + tables
npm run db:seed               # create the first admin
npm run dev                   # http://localhost:3000
```

> **Quick MySQL with Docker:**
>
> ```bash
> docker run --name dms-mysql -e MYSQL_ROOT_PASSWORD=secret \
>   -e MYSQL_DATABASE=dental_management_system -p 3306:3306 -d mysql:8
> ```
>
> Then set `DB_PASSWORD=secret` in `.env`.

## Scripts

| Script                            | What it does               |
| --------------------------------- | -------------------------- |
| `npm run dev`                     | Dev server with hot reload |
| `npm run build`                   | Production build           |
| `npm run start`                   | Run the production build   |
| `npm run lint` / `lint:fix`       | ESLint                     |
| `npm run typecheck`               | `tsc --noEmit`             |
| `npm run test` / `test:watch`     | Vitest                     |
| `npm run format` / `format:check` | Prettier                   |
| `npm run db:init`                 | Create schema (idempotent) |
| `npm run db:seed`                 | Create the first admin     |

## Conventions

- **Layering:** UI → API → services → db. Never import `lib/db` or `lib/services` from a
  client component; call the API via `lib/api-client.ts`.
- **Validation:** every API input is validated with a Zod schema in `lib/validation`.
- **Types:** shared domain types live in `lib/types.ts`. Prefer explicit types over `any`.
- **Styling:** Tailwind with the design tokens in `app/globals.css`; compose classes with
  the `cn()` helper and reuse `components/ui` primitives.
- **Server vs client:** add `'use client'` only when a component needs state, effects or
  event handlers.

## Adding a feature (example: a new entity)

1. **Schema** — add a `CREATE TABLE IF NOT EXISTS` to `lib/db/schema.ts`.
2. **Types** — add the interface to `lib/types.ts`.
3. **Validation** — add a Zod schema to `lib/validation/schemas.ts`.
4. **Service** — add CRUD functions in `lib/services/<entity>.ts` using `query`/`execute`.
5. **API** — add route handlers under `app/api/<entity>/`.
6. **UI** — add a page under `app/(app)/<entity>/` and components under
   `components/<entity>/`.
7. **Tests** — add unit tests under `tests/`.

## Testing

Unit tests run with Vitest and do **not** require a database (they cover validation,
hashing and utilities). Add tests alongside new pure logic:

```bash
npm run test          # run once
npm run test:watch    # watch mode
```

## Troubleshooting

| Symptom                             | Fix                                                                 |
| ----------------------------------- | ------------------------------------------------------------------- |
| `ECONNREFUSED` on first request     | MySQL isn't running or `DB_*` is wrong                              |
| `AUTH_SECRET must be set …` in prod | Set a 32+ char `AUTH_SECRET`                                        |
| Can't sign in                       | Run `npm run db:seed`, or register the first admin at `/register`   |
| Styles look unstyled                | Ensure `npm run dev`/`build` compiled Tailwind (restart dev server) |
