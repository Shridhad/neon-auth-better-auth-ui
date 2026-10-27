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

## Known gaps in `@neon/auth` 0.8.0
- Error codes are normalized to Supabase-style codes, so some better-auth-ui error branches never fire. See [vite/README.md](vite/README.md#known-neonauth-080-gaps).
- The middleware's default public routes omit reset-password, verify-email, error, redirect, sign-out and magic-link-sent, so the Next.js app carries a `proxy.ts` workaround. See [next/README.md](next/README.md#known-neonauth-080-gaps-workarounds-kept-here).

## Comparison with neondatabase/examples
See [COMPARISON.md](COMPARISON.md).

## License
MIT
