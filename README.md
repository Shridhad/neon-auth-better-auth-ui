# Neon Auth + better-auth-ui 1.7

Two small demo apps showing [Neon Auth](https://neon.com/docs/auth/overview) driven by [better-auth-ui](https://better-auth-ui.com) 1.7 (`@better-auth-ui/react` and `@better-auth-ui/core`, shadcn-copied components) with no Neon UI wrapper package. The `authClient` from `@neon/auth` goes straight into `AuthProvider`, with no adapter and no cast.

| App | Stack | Run |
|---|---|---|
| [`next/`](next) | Next.js App Router | `cd next && pnpm install && cp .env.local.example .env.local && pnpm dev` |
| [`vite/`](vite) | Vite + React Router SPA | `cd vite && pnpm install && cp .env.example .env && pnpm dev` |

## Prerequisites
- A Neon Auth URL (`https://ep-xxx.neonauth.<region>.aws.neon.tech/neondb/auth`) from your Neon project.
- Email OTP enabled on the Neon Auth project.
- Vite only: the app origin (for example `http://localhost:5173`) added as a trusted origin on the Neon Auth project.
- Next.js only: `NEON_AUTH_COOKIE_SECRET`, generated with `openssl rand -base64 32`.

## Setup notes
- Both apps use `@neon/auth` 0.8.1. After `shadcn add`, run `npm i better-auth@~1.7.12` (or the pnpm equivalent) so a single better-auth 1.7.x is installed; better-auth's npm `latest` is a 1.8 beta.
- Next.js: `auth.middleware({ loginUrl, publicRoutes })` takes extra public routes. The defaults cover every signed-out better-auth-ui 1.7 view, so the demo only adds `/`. See [next/README.md](next/README.md).
- Both apps guard `navigate` against protocol-relative (`//host`) redirect targets (a `@better-auth-ui/core` 1.7.30 open-redirect issue, unfixed upstream); remove the guard once it is fixed.

## Comparison with neondatabase/examples
See [COMPARISON.md](COMPARISON.md).

## License
MIT
