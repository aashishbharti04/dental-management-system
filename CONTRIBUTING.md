# Contributing to Dental Management System

First off — thank you for taking the time to contribute! 🎉 This project is open source and
welcomes contributions of all kinds: bug fixes, features, docs, tests and ideas.

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please be
respectful and constructive.

## Getting started

1. **Fork** the repository and clone your fork.
2. Install dependencies and set up your environment:
   ```bash
   npm install
   cp .env.example .env   # edit with your MySQL credentials + AUTH_SECRET
   npm run db:init
   npm run db:seed
   npm run dev
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feat/short-description
   ```

See [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) for a deeper development guide.

## Development workflow

Before opening a pull request, make sure everything passes locally:

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm run test        # Vitest
npm run build       # Production build
npm run format      # Prettier (auto-format)
```

The same checks run in CI on every pull request.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add patient export to CSV
fix: correct payroll total rounding
docs: clarify AUTH_SECRET setup
refactor: extract shared table component
test: add validation tests for staff schema
chore: bump dependencies
```

## Pull requests

1. Keep PRs focused — one logical change per PR.
2. Update documentation and tests where relevant.
3. Ensure CI is green.
4. Fill in the pull request template and link any related issues.
5. Use a clear, descriptive title (Conventional Commits style is appreciated).

## Coding standards

- **TypeScript** everywhere — add types, avoid `any`.
- Keep the layering intact: `lib/db` → `lib/services` → `app/api` → UI. UI components must
  not import the database directly; go through the API.
- Reuse the existing UI primitives in `components/ui`.
- Validate all external input with Zod at the API boundary.
- Use parameterized queries — never build SQL with string concatenation.

## Reporting bugs & requesting features

Use the [issue templates](https://github.com/aashishbharti04/dental-management-system/issues/new/choose).
For security issues, **do not** open a public issue — see [`SECURITY.md`](SECURITY.md).

Thanks again for contributing! 💚
