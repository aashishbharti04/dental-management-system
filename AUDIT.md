# Codebase Audit & Transformation Report

This document records the audit of the **original** Dental Management System (a Python +
MySQL command-line script) and the plan used to transform it into a production-ready,
open-source **Next.js + TypeScript** web application.

The original source is preserved untouched under [`legacy/`](./legacy) for provenance.

---

## 1. What the original project did

A single-user terminal program backed by MySQL with these features:

| Feature                                                                 | Original location      |
| ----------------------------------------------------------------------- | ---------------------- |
| Create database                                                         | `DATABASE CREATION.py` |
| Create tables (`patient_record`, `salary_record`, `accounts`)           | `TABLES CREATION.py`   |
| Register a login account                                                | `ACCOUNT ADDITION.py`  |
| Login + Add patient / Add salary record / View patient / Delete patient | `MAIN.py`              |

**All of these features are preserved** in the new application (see the mapping in §4).

---

## 2. Weaknesses found

### 2.1 Security (critical)

| #   | Issue                                                                       | Evidence                                           | Impact                                                |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| S1  | **SQL injection in every query** — values are concatenated into SQL strings | `MAIN.py:15,53,68,75,95`, `ACCOUNT ADDITION.py:10` | A crafted name/username can read, alter, or drop data |
| S2  | **Passwords stored in plaintext** (only upper-cased)                        | `ACCOUNT ADDITION.py:8-10`, `MAIN.py:21-23`        | Full credential disclosure on any DB leak             |
| S3  | **Hardcoded DB credentials** (`root` / `manager`) committed in source       | every `.py` file, line 2–3                         | Secrets in version control                            |
| S4  | **No input validation** anywhere                                            | all `input()` calls                                | Crashes and injection                                 |
| S5  | **No transport/session security** (it's a local script)                     | —                                                  | N/A for CLI, must be designed in for web              |

### 2.2 Correctness bugs

| #   | Bug                                                                                       | Evidence             | Effect                                                             |
| --- | ----------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------ |
| B1  | `if conn.is_connected:` checks a **method object**, not the result                        | `MAIN.py:5`, others  | Always truthy; never actually verifies the connection              |
| B2  | Login reads `value_1/value_2` **only inside a loop**; undefined if the user doesn't exist | `MAIN.py:17-20`      | `NameError` crash on unknown username                              |
| B3  | `if data != 0:` compares a **list** to `0` → always `True`                                | `MAIN.py:77`         | "Patient Record Doesnot Exist" branch is **dead code**             |
| B4  | Delete reports success unconditionally; no `rowcount` check                               | `MAIN.py:95-96`      | "Deleted successfully" even when nothing matched                   |
| B5  | `int(input(...))` for age/phone                                                           | `MAIN.py:47,52`      | `ValueError` crash on non-numeric input; phone loses leading zeros |
| B6  | Program performs **one action then exits** (no menu loop)                                 | whole `MAIN.py` flow | Poor UX; must restart to do anything else                          |

### 2.3 Data model

| #   | Issue                                                                 | Evidence                      |
| --- | --------------------------------------------------------------------- | ----------------------------- |
| D1  | Salary stored as `varchar(9)` (money as text)                         | `TABLES CREATION.py:5`        |
| D2  | Phone stored as `bigint` (loses leading zeros / formatting)           | `TABLES CREATION.py:4-5`      |
| D3  | Deprecated integer display widths (`int(3)`, `bigint(15)`)            | `TABLES CREATION.py`          |
| D4  | No `NOT NULL`, no indexes, no `created_at`, no primary key on records | `TABLES CREATION.py`          |
| D5  | `CREATE DATABASE/TABLE` without `IF NOT EXISTS` → re-run crashes      | `DATABASE/TABLES CREATION.py` |
| D6  | All data force-upper-cased, destroying real names/addresses           | throughout `MAIN.py`          |

### 2.4 Architecture & maintainability

- No separation of concerns — DB, UI, and business logic interleaved in one flat script.
- No reusable functions, no modules, no types.
- No configuration layer (everything hardcoded).
- No error handling / logging.
- No tests.
- No dependency manifest, README, license, `.gitignore`, or version control.
- File names contain spaces and are upper-cased (`DATABASE CREATION.py`).
- Numerous typos in code and user-facing strings (`choise`, `succefull`, `Veiw`,
  `Proffession`, `Conculted`, `doesnot`).

---

## 3. Improvements implemented

### Security

- **Parameterized queries** everywhere via `mysql2` prepared statements (fixes S1).
- **`bcrypt` password hashing** with per-user salt (fixes S2).
- **Environment-based configuration** with `.env` (never committed) + `.env.example` (fixes S3).
- **Zod input validation** on every API boundary (fixes S4).
- **Signed, `httpOnly`, `sameSite` session cookies** (JWT via `jose`) + route middleware (S5).
- Security headers (CSP-friendly defaults, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, HSTS), basic login rate-limiting, and React's built-in XSS escaping.

### Correctness

- Real connection checks and pooled connections (B1).
- Auth that handles the "user not found" path safely (B2).
- Proper empty/"not found" states in the UI and API (B3).
- Delete returns affected-row counts and a truthful result (B4).
- Typed, validated numeric/string fields; phone stored as text (B5).
- A full web UI — no single-shot flow (B6).

### Data model

- Normalized schema: `AUTO_INCREMENT` primary keys, `DECIMAL` salary (D1), `VARCHAR` phone
  (D2), modern column types (D3), `NOT NULL` + indexes + `created_at` timestamps (D4),
  idempotent `CREATE ... IF NOT EXISTS` auto-migration on startup (D5), original casing
  preserved (D6).

### Architecture

- Clear layering: `lib/db` (data access) → `lib/services` (domain logic) → `app/api`
  (HTTP) → `app/(routes)` + `components` (UI).
- Full TypeScript types, ESLint + Prettier, Vitest unit tests, CI on GitHub Actions.
- Conventional folder structure, documentation under `docs/`, and complete open-source
  governance files.

---

## 4. Feature parity mapping (nothing lost)

| Original                                      | New implementation                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `DATABASE CREATION.py` + `TABLES CREATION.py` | Idempotent auto-migration in `lib/db/schema.ts` (runs on first DB call) + `npm run db:init` |
| `ACCOUNT ADDITION.py`                         | `POST /api/auth/register` + `npm run db:seed` (creates the first admin)                     |
| Login (`MAIN.py`)                             | `POST /api/auth/login` + `/login` page (hashed passwords, sessions)                         |
| Add patient                                   | `POST /api/patients` + "Add Patient" form                                                   |
| View patient                                  | `GET /api/patients` + patients table with search & detail view                              |
| Delete patient                                | `DELETE /api/patients/:id` + confirm dialog                                                 |
| Add salary record                             | `POST /api/staff` + "Add Staff/Salary" form                                                 |

---

## 5. UI/UX, performance & SEO additions

Premium responsive design (Tailwind), dark/light mode, smooth animations (Framer Motion),
loading/skeleton/empty/error states, accessible components, code-splitting & lazy loading,
`next/image` optimization, SEO metadata + sitemap + robots, and a professional site-wide
footer with project contact and social links.
