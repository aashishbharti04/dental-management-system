# Architecture

This document describes how the Dental Management System is structured and how a request
flows through it.

## High-level overview

The app is a single Next.js 14 (App Router) application using a clean, layered architecture:

```
┌─────────────────────────────────────────────────────────────┐
│  UI layer        app/(routes) + components/                  │  React Server & Client Components
├─────────────────────────────────────────────────────────────┤
│  HTTP layer      app/api/**/route.ts                         │  Validation, auth, JSON envelopes
├─────────────────────────────────────────────────────────────┤
│  Service layer   lib/services/*                              │  Domain logic (auth, patients, staff)
├─────────────────────────────────────────────────────────────┤
│  Data layer      lib/db/*                                    │  Pooled, parameterized MySQL access
└─────────────────────────────────────────────────────────────┘
                              │
                          ┌───▼───┐
                          │ MySQL │
                          └───────┘
```

**Rule:** dependencies only point downward. UI never imports the database directly — it goes
through the API, which calls services, which call the data layer.

## Request lifecycle

### Page request (e.g. `/patients`)

1. **Edge middleware** (`middleware.ts`) checks the session cookie. No valid session →
   redirect to `/login`.
2. The **route group layout** `app/(app)/layout.tsx` re-verifies the session server-side
   (defense in depth) and renders the app shell.
3. The **server page** calls a service (e.g. `listPatients()`) to fetch initial data and
   passes it to a client component (`PatientsView`).
4. The **client component** hydrates and handles interactivity (search, add, delete) by
   calling the JSON API.

### API request (e.g. `POST /api/patients`)

1. The route handler runs on the **Node.js runtime**.
2. `requireSessionUser()` enforces authentication.
3. The body is validated with a **Zod** schema.
4. A **service** function executes a **parameterized** query.
5. The handler returns a typed `{ data }` envelope, or `handleApiError` converts any thrown
   error into a safe `{ error }` response.

## Authentication & sessions

- Passwords are hashed with **bcrypt** (`lib/auth/password.ts`).
- On login, a **JWT** is signed with `jose` (`lib/auth/session.ts`) and stored in a hardened
  cookie (`httpOnly`, `sameSite=lax`, `secure` in production).
- `lib/auth/session.ts` is **edge-safe** (no `next/headers`) so middleware can verify tokens.
- Cookie I/O lives in `lib/auth/cookies.ts` (Node runtime only).
- The first account can be created openly (bootstrap); afterwards registration requires an
  authenticated admin.

## Data model

Three tables, created idempotently by `lib/db/schema.ts`:

- `accounts(id, username, password_hash, created_at)`
- `patient_record(id, patient_name, age, doctor_consulted, address, phone_number, created_at)`
- `salary_record(id, employee_name, profession, salary_amount, address, phone_number, created_at)`

Schema improvements over the original: `AUTO_INCREMENT` primary keys, `DECIMAL` salary,
`VARCHAR` phone numbers, `NOT NULL` constraints, indexes on searchable columns, and
timestamps.

## Security model

See [`SECURITY.md`](../SECURITY.md). In short: parameterized queries (no SQL injection),
bcrypt password hashing, signed session cookies, Zod validation, security headers, login
rate-limiting and environment-based secrets.

## Performance

- Server Components render data-heavy pages without shipping that work to the client.
- Static pages (`/`, `/register`) are prerendered for great Core Web Vitals.
- Code-splitting and lazy hydration keep the shared JS bundle small (~87 kB).
- Modern image formats and security headers are configured in `next.config.mjs`.
