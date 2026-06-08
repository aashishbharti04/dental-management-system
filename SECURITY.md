# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, email **aashish@marketdoctorsonline.com** with:

- A description of the vulnerability and its impact
- Steps to reproduce (proof of concept if possible)
- Affected version/commit

You will receive an acknowledgement within **72 hours**, and we will keep you informed as we
work on a fix. Please give us a reasonable window to remediate before any public disclosure.

## Security measures in this project

This application was deliberately built with security in mind:

- **Passwords** are hashed with bcrypt (work factor 12) — never stored in plaintext.
- **Sessions** use signed JWTs stored in `httpOnly`, `sameSite=lax` cookies (`secure` in
  production).
- **SQL injection** is prevented by using parameterized queries everywhere (`mysql2`
  prepared statements).
- **Input validation** is enforced at every API boundary with Zod.
- **XSS** is mitigated by React's automatic output escaping.
- **Security headers** (HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`) are applied to all responses.
- **Brute-force** login attempts are slowed by a basic rate limiter.
- **Secrets** are kept in environment variables and never committed (`.env` is gitignored).

## Hardening recommendations for production

- Always set a strong, unique `AUTH_SECRET` (≥ 32 characters).
- Serve the app exclusively over HTTPS.
- Use a dedicated, least-privilege MySQL user (not `root`).
- For multi-instance/serverless deployments, back the rate limiter with a shared store
  (e.g. Redis/Upstash).
- Keep dependencies up to date.
