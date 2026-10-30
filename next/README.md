# Neon Auth + better-auth-ui 1.7 (no Neon UI package)

Demo: Next.js App Router using `@better-auth-ui/react` / `core` 1.7.30 (shadcn registry components)
directly with `@neon/auth@0.8.1`. The Neon client from `createAuthClient()`
(`@neon/auth/next`) is passed to `AuthProvider` as-is: no adapter, no cast.

## Setup as performed
```bash
pnpm create next-app@latest next --ts --tailwind --app --eslint --use-pnpm --no-src-dir --import-alias "@/*" --yes
pnpm dlx shadcn@latest init -d --yes
pnpm add @neon/auth@^0.8.1 @better-auth-ui/core@1.7.30 @better-auth-ui/react@1.7.30 \
  @tanstack/react-query @tanstack/query-core cn zod react-email \
  sonner next-themes
pnpm dlx shadcn@latest add @better-auth-ui/auth @better-auth-ui/settings @better-auth-ui/user-button @better-auth-ui/email-otp --yes
pnpm add better-auth@~1.7.12   # after shadcn add; the copied components import types from better-auth
```
The `@better-auth-ui` registry namespace resolves with no `components.json` entry.
better-auth's npm `latest` is a 1.8 beta, so the `~1.7.12` range (the one `@neon/auth` 0.8.1 uses) keeps a single 1.7.x installed; no pnpm override needed.

## Hand-written files
`lib/auth/server.ts`, `lib/auth/client.ts`, `lib/query-client.ts`, `app/api/auth/[...path]/route.ts`,
`proxy.ts`, `components/providers.tsx`, `app/auth/[path]/page.tsx`, `app/settings/[path]/page.tsx`,
`app/page.tsx`, edits to `app/layout.tsx` and `next.config.ts`, `.env.local(.example)`.
Everything else under `components/auth/**`, `components/ui/**`, `lib/auth/*-plugin.ts` etc. is shadcn-generated.

## Public routes
`proxy.ts` is `auth.middleware({ loginUrl: "/auth/sign-in", publicRoutes: ["/"] })`. The middleware's default public routes already cover all better-auth-ui 1.7 signed-out views (sign-in, sign-up, reset-password, verify-email, error, redirect, sign-out, magic-link-sent, ...). `/auth` itself and `/settings/*` stay protected; add entries to `publicRoutes` for any other page that should be reachable signed out (this demo adds `/`).

## Known issues
- `navigate` in `components/providers.tsx` and the copied `auth-redirect.tsx` replace any target starting with `//` with `/`. `getSafeRedirectTo()` in `@better-auth-ui/core` 1.7.30 can return protocol-relative paths after URL normalization (for example `?redirectTo=/a/..//host`), an open redirect that is unfixed upstream. Remove the guard once upstream fixes it.

## Email verification
`components/providers.tsx` sets `emailAndPassword={{ requireEmailVerification: false }}`. This is not a workaround; it mirrors the Neon Auth project's "verify email at signup" setting being off. If you enable it on the project, set it to `true` so sign-up routes to the verify-email view.

## Other workarounds
- `next.config.ts`: `cacheComponents` / `partialPrefetching` set to false (create-next-app canary enables them;
  they reject `export const dynamic`).
- Settings page does not do the upstream server-side `ensureSessionServer` prefetch (needs a real
  better-auth server instance; Neon's `auth` is a proxy). Settings is protected by the Neon middleware.

## Run
Copy `.env.local.example` to `.env.local`, fill `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` (`openssl rand -base64 32`), then `pnpm dev`. Open `/`, `/auth/sign-in`, `/settings/account`.
Note: email-OTP views need the Neon Auth project to have the email OTP plugin/provider enabled.
