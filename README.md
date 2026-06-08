<div align="center">

<img src="public/favicon.svg" alt="Dental Management System logo" width="72" height="72" />

# Dental Management System

**A modern, secure, open-source web app to manage patient records, staff and payroll for dental clinics.**

Rebuilt from a Python + MySQL command-line script into a production-ready **Next.js 14 + TypeScript** application.

[![CI](https://github.com/aashishbharti04/dental-management-system/actions/workflows/ci.yml/badge.svg)](https://github.com/aashishbharti04/dental-management-system/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-16a394.svg)](LICENSE)
[![Made with Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)
- [Contact](#contact)

---

## Overview

Dental Management System is a clinic admin dashboard. Authenticated staff can manage
**patient records** and **staff/payroll**, with fast search, a polished responsive UI, and
dark/light mode.

It began life as a small Python CLI backed by MySQL. That version had serious issues —
SQL injection in every query, plaintext passwords, hard-coded credentials, and no input
validation (see [`AUDIT.md`](AUDIT.md)). This project **preserves every original feature**
while fixing those problems and adding a professional, accessible web interface.

> The original Python source is preserved under [`legacy/`](legacy) for reference.

## Features

- 🔐 **Secure authentication** — bcrypt-hashed passwords, signed `httpOnly` session cookies, route middleware.
- 🧑‍⚕️ **Patient management** — add, search, view and delete patient records.
- 💼 **Staff & payroll** — track employees, professions and salaries with an automatic payroll total.
- 🔎 **Instant search** — debounced filtering by name, doctor or profession.
- 🌗 **Dark & light mode** — system-aware theme with a manual toggle.
- 📱 **Fully responsive** — designed for mobile, tablet and desktop.
- ♿ **Accessible** — semantic HTML, keyboard focus rings, ARIA labels, Radix primitives, reduced-motion support.
- ✨ **Polished UX** — smooth animations, skeleton loaders, empty states and error states throughout.
- ⚡ **Fast** — server components, code-splitting, optimized assets and SEO metadata (sitemap, robots, manifest).
- 🛡️ **Hardened** — parameterized queries, Zod validation, security headers and basic login rate-limiting.

## Screenshots

> 📸 Run `npm run dev` to see it live. Add images to
> [`docs/screenshots/`](docs/screenshots) and they will render here automatically.

What you'll find inside:

- **Landing page** — an animated, SEO-optimized marketing page.
- **Dashboard** — patient, staff and payroll stats with a recent-patients list.
- **Patients** — searchable table with add-in-dialog and a delete confirmation flow.
- **Staff & payroll** — staff records with an automatic monthly payroll total.
- **Dark & light mode** — every screen, system-aware with a manual toggle.

## Tech Stack

| Layer      | Technology                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Framework  | [Next.js 14](https://nextjs.org/) (App Router)                                                                      |
| Language   | [TypeScript](https://www.typescriptlang.org/)                                                                       |
| Styling    | [Tailwind CSS](https://tailwindcss.com/), CSS variables for theming                                                 |
| UI         | [Radix UI](https://www.radix-ui.com/), [lucide-react](https://lucide.dev/), [sonner](https://sonner.emilkowal.ski/) |
| Animation  | [Framer Motion](https://www.framer.com/motion/)                                                                     |
| Database   | [MySQL](https://www.mysql.com/) via [mysql2](https://github.com/sidorares/node-mysql2)                              |
| Auth       | [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [jose](https://github.com/panva/jose) (JWT)                       |
| Validation | [Zod](https://zod.dev/)                                                                                             |
| Testing    | [Vitest](https://vitest.dev/)                                                                                       |
| Tooling    | ESLint, Prettier, GitHub Actions                                                                                    |

## Installation

### Prerequisites

- **Node.js** ≥ 18.17
- **MySQL** ≥ 5.7 / 8 (a running server you can connect to)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/aashishbharti04/dental-management-system.git
cd dental-management-system

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
#   then edit .env with your MySQL credentials and a strong AUTH_SECRET

# 4. Create the database and tables
npm run db:init

# 5. Create the first admin account (uses ADMIN_USERNAME / ADMIN_PASSWORD from .env)
npm run db:seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in at `/login` with the admin
credentials you set in `.env`.

> No `.env`? The app falls back to sensible local defaults (`localhost:3306`, user `root`)
> and creates the schema automatically on first use — but you should always set a real
> `AUTH_SECRET` and database password.

## Usage

| Action                                        | Where                                                  |
| --------------------------------------------- | ------------------------------------------------------ |
| **Sign in**                                   | `/login`                                               |
| **Create the first admin**                    | `/register` (open only until the first account exists) |
| **View clinic stats**                         | `/dashboard`                                           |
| **Add / search / delete patients**            | `/patients`                                            |
| **Add / search / delete staff & see payroll** | `/staff`                                               |
| **Toggle dark/light mode**                    | Theme button in the header                             |
| **Sign out**                                  | "Sign out" in the header                               |

## Configuration

All configuration is via environment variables (see [`.env.example`](.env.example)):

| Variable               | Description                                                 | Default                    |
| ---------------------- | ----------------------------------------------------------- | -------------------------- |
| `DB_HOST`              | MySQL host                                                  | `localhost`                |
| `DB_PORT`              | MySQL port                                                  | `3306`                     |
| `DB_USER`              | MySQL user                                                  | `root`                     |
| `DB_PASSWORD`          | MySQL password                                              | _(empty)_                  |
| `DB_NAME`              | Database name                                               | `dental_management_system` |
| `DB_CONNECTION_LIMIT`  | Pool size                                                   | `10`                       |
| `AUTH_SECRET`          | **Required in production.** JWT signing secret (≥ 32 chars) | dev fallback               |
| `SESSION_MAX_AGE`      | Session lifetime (seconds)                                  | `28800`                    |
| `ADMIN_USERNAME`       | First admin username (for `db:seed`)                        | `admin`                    |
| `ADMIN_PASSWORD`       | First admin password (for `db:seed`)                        | _(none)_                   |
| `NEXT_PUBLIC_SITE_URL` | Public URL for SEO/sitemap                                  | `http://localhost:3000`    |

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### Available scripts

| Script              | Description                           |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Start the development server          |
| `npm run build`     | Production build                      |
| `npm run start`     | Start the production server           |
| `npm run lint`      | Run ESLint                            |
| `npm run typecheck` | Type-check with `tsc`                 |
| `npm run test`      | Run the Vitest suite                  |
| `npm run format`    | Format with Prettier                  |
| `npm run db:init`   | Create database + tables (idempotent) |
| `npm run db:seed`   | Create the first admin account        |

## Deployment

The app deploys anywhere that runs Node.js with access to a MySQL database
(Vercel, Railway, Render, a VPS, Docker, …). See
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for step-by-step guides.

Minimum production checklist:

1. Provision a MySQL database and set the `DB_*` variables.
2. Set a strong `AUTH_SECRET` (≥ 32 chars) and `NEXT_PUBLIC_SITE_URL`.
3. Run `npm run db:init` and `npm run db:seed` against the production database.
4. `npm run build` then `npm run start`.

## Project Structure

```
.
├── app/            # Next.js App Router (routes, layouts, API handlers, SEO)
├── components/     # Reusable UI and feature components
├── lib/            # Domain logic: db, auth, services, validation, utils
├── scripts/        # db:init / db:seed CLI scripts
├── tests/          # Vitest unit tests
├── docs/           # Architecture, API, deployment & development docs
├── legacy/         # The original Python CLI (preserved)
└── .github/        # Issue/PR templates and CI workflows
```

See [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) for the full breakdown.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Folder structure](docs/FOLDER_STRUCTURE.md)
- [API reference](docs/API.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Development setup](docs/DEVELOPMENT.md)
- [Codebase audit & transformation report](AUDIT.md)

## Contributing

Contributions are welcome! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and our
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Found a security issue? See
[`SECURITY.md`](SECURITY.md).

## FAQ

<details>
<summary><strong>Do I need MySQL to run it?</strong></summary>

Yes. The app uses MySQL (configurable via `.env`). It creates the schema automatically on
first use, or you can run `npm run db:init` explicitly.

</details>

<details>
<summary><strong>How do I create the first user?</strong></summary>

Run `npm run db:seed` (uses `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`), or visit
`/register` — open registration is allowed only until the first account exists.

</details>

<details>
<summary><strong>Where did my original Python code go?</strong></summary>

It's preserved untouched in [`legacy/`](legacy). Every feature was carried over to the web
app — see the mapping in [`AUDIT.md`](AUDIT.md).

</details>

<details>
<summary><strong>Is it production-ready?</strong></summary>

Yes — with the security checklist applied (strong `AUTH_SECRET`, real DB credentials,
HTTPS). For high-traffic/serverless deployments, back the login rate-limiter with a shared
store (see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)).

</details>

## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

This project is open source and available for educational, learning and community
contributions.

## Contact

**Aashish Bharti** · [aashish@marketdoctorsonline.com](mailto:aashish@marketdoctorsonline.com)

[LinkedIn](https://in.linkedin.com/in/aashana1012) ·
[GitHub](https://github.com/aashishbharti04) ·
[YouTube](https://www.youtube.com/@CodeWithAsur) ·
[Instagram](https://www.instagram.com/asurwave1012?igsh=ZDBlY2NtczJ5cmMw)

---

<div align="center">
<sub>© 2026 Dental Management System. All rights reserved. Built with ❤️ and open source.</sub>
</div>
