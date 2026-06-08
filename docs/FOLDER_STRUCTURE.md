# Folder Structure

```
dental-management-system/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public, SEO-friendly pages
│   │   ├── layout.tsx            #   marketing header
│   │   └── page.tsx              #   landing page (/)
│   ├── (auth)/                   # Authentication pages
│   │   ├── layout.tsx            #   centered auth shell
│   │   ├── login/page.tsx        #   /login
│   │   └── register/page.tsx     #   /register
│   ├── (app)/                    # Authenticated app (guarded)
│   │   ├── layout.tsx            #   server auth guard + app shell
│   │   ├── dashboard/            #   /dashboard (+ loading skeleton)
│   │   ├── patients/page.tsx     #   /patients
│   │   └── staff/page.tsx        #   /staff
│   ├── api/                      # Route handlers (JSON API)
│   │   ├── auth/                 #   login, logout, register
│   │   ├── patients/             #   list/create + [id] get/delete
│   │   └── staff/                #   list/create + [id] delete
│   ├── globals.css               # Tailwind + theme tokens (light/dark)
│   ├── layout.tsx                # Root layout (theme, footer, metadata)
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── icon.svg                  # Favicon
│   ├── manifest.ts               # Web manifest
│   ├── robots.ts                 # robots.txt
│   └── sitemap.ts                # sitemap.xml
│
├── components/
│   ├── ui/                       # Primitives: button, input, card, dialog,
│   │                             #   badge, skeleton, spinner, empty/error state,
│   │                             #   theme-toggle, toaster
│   ├── app/                      # App shell + logout button
│   ├── auth/                     # Login & register forms
│   ├── patients/                 # Patients view + form
│   ├── staff/                    # Staff view + form
│   ├── dashboard/                # Stat card
│   ├── marketing/                # Site header
│   ├── motion/                   # Reveal (scroll animation)
│   ├── footer.tsx                # Site-wide footer
│   ├── logo.tsx                  # Brand mark
│   └── theme-provider.tsx        # next-themes provider
│
├── lib/
│   ├── db/                       # pool.ts, schema.ts, index.ts (query helpers)
│   ├── auth/                     # password.ts, session.ts, cookies.ts
│   ├── services/                 # auth.ts, patients.ts, staff.ts (domain logic)
│   ├── validation/               # Zod schemas
│   ├── api-client.ts             # Typed client-side fetch wrapper
│   ├── constants.ts              # Site identity, contact, social links
│   ├── env.ts                    # Lazily-read environment config
│   ├── errors.ts                 # Typed application errors
│   ├── http.ts                   # API response helpers
│   ├── rate-limit.ts             # In-memory rate limiter
│   ├── types.ts                  # Shared domain types
│   └── utils.ts                  # cn(), formatters
│
├── scripts/
│   ├── init-db.ts                # npm run db:init
│   └── seed.ts                   # npm run db:seed
│
├── tests/                        # Vitest unit tests
├── docs/                         # This documentation
├── legacy/                       # Original Python CLI (preserved)
│   ├── python-cli/
│   └── documents/
├── public/                       # Static assets (favicon)
├── .github/                      # Issue/PR templates, CI workflow
│
├── AUDIT.md                      # Codebase audit & transformation report
├── next.config.mjs               # Next config (security headers, images)
├── tailwind.config.ts            # Design tokens
├── tsconfig.json                 # TypeScript config (strict)
├── vitest.config.ts              # Test config
├── middleware.ts                 # Edge auth middleware
└── .env.example                  # Environment template
```
