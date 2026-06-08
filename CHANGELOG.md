# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-08

The first public release — a complete rebuild of the original Python CLI into a modern,
secure, open-source web application. All original features are preserved.

### Added

- **Next.js 14 + TypeScript** web application with the App Router.
- **Authentication**: bcrypt password hashing, signed `httpOnly` session cookies (JWT via
  `jose`), edge middleware route protection, and first-admin bootstrap registration.
- **Patients**: list, search, add (dialog form) and delete with confirmation.
- **Staff & payroll**: list, search, add and delete, with an automatic payroll total.
- **Dashboard**: live counts for patients, staff and monthly payroll, plus recent patients.
- **UI/UX**: premium responsive design, dark/light mode, smooth animations, skeleton
  loaders, empty states and error states.
- **Security**: parameterized MySQL queries, Zod input validation, security headers and
  basic login rate-limiting.
- **SEO**: metadata, Open Graph tags, `sitemap.xml`, `robots.txt` and a web manifest.
- **Tooling**: ESLint, Prettier, Vitest test suite and a GitHub Actions CI pipeline.
- **Docs**: README, architecture, folder structure, API, deployment and development guides,
  plus a full codebase audit (`AUDIT.md`).
- **Open-source governance**: MIT license, contributing guide, code of conduct, security
  policy, and issue/PR templates.
- **Database scripts**: `npm run db:init` and `npm run db:seed` (idempotent).

### Changed

- Migrated the data layer from raw, string-concatenated SQL to parameterized `mysql2`
  queries with a normalized schema (`AUTO_INCREMENT` keys, `DECIMAL` salary, `VARCHAR`
  phone, indexes and timestamps).
- Moved hard-coded database credentials into environment variables.

### Fixed

- **SQL injection** vulnerabilities present in every original query.
- **Plaintext password** storage (now bcrypt-hashed).
- Login crash (`NameError`) when the username did not exist.
- Unreachable "record not found" branch caused by comparing a list to `0`.
- Delete operations that reported success even when nothing was removed.
- Crashes from unvalidated numeric input.

### Preserved

- The original Python CLI is kept under [`legacy/`](legacy) for reference.

[1.0.0]: https://github.com/aashishbharti04/dental-management-system/releases/tag/v1.0.0
