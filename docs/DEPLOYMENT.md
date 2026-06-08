# Deployment Guide

The app is a standard Next.js application that needs a Node.js runtime and a MySQL database.
Below are three common ways to deploy it.

## Production checklist

Before going live:

- [ ] Provision a MySQL database and set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- [ ] Set a strong `AUTH_SECRET` (≥ 32 chars). Generate one with
      `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your public HTTPS URL.
- [ ] Use a dedicated, least-privilege MySQL user (not `root`).
- [ ] Serve over HTTPS (the session cookie is `secure` in production).
- [ ] Initialize the schema: `npm run db:init` (or it auto-creates on first request).
- [ ] Create the first admin: `npm run db:seed`, or visit `/register`.

---

## Option 1 — Docker Compose (app + database)

The repository includes a `Dockerfile` and `docker-compose.yml`.

```bash
# Set a strong secret and DB password
export AUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")"
export DB_PASSWORD="a-strong-password"

docker compose up --build
```

This starts MySQL and the app together. Open <http://localhost:3000> and create the first
admin at `/register`. Data persists in the `dms-mysql` Docker volume.

---

## Option 2 — Vercel (+ managed MySQL)

1. Push the repo to GitHub and import it into [Vercel](https://vercel.com/new).
2. Provision a MySQL database (PlanetScale, Railway, Aiven, etc.).
3. In the Vercel project settings, add the environment variables from the checklist above.
4. Deploy. After the first deploy, run `npm run db:init && npm run db:seed` once against the
   production database (locally with production `DB_*`, or via your DB provider's console).

> **Note on rate limiting:** the built-in login rate limiter is in-memory and per-instance.
> On serverless/multi-instance platforms it won't be shared across instances. For strong
> brute-force protection, back it with a shared store (e.g. Redis/Upstash) — see
> `lib/rate-limit.ts`.

---

## Option 3 — VPS / bare Node.js

```bash
git clone https://github.com/aashishbharti04/dental-management-system.git
cd dental-management-system
npm ci
cp .env.example .env        # fill in production values
npm run build
npm run db:init && npm run db:seed
npm run start               # serves on PORT (default 3000)
```

Run it behind a reverse proxy (Nginx/Caddy) terminating TLS, and keep it alive with a
process manager such as `pm2` or a `systemd` service.

---

## Health & observability

- The app logs unhandled API errors to the server console (`handleApiError`). In production,
  wire these into your logging/error-reporting service.
- Database connection issues surface as `500` responses; check `DB_*` and network access.
