# Neon Auth + better-auth-ui 1.7 (no Neon UI package)

Demo: Next.js App Router using `@better-auth-ui/react` / `core` 1.7.30 (shadcn registry components)
directly with `@neon/auth@0.8.0`. The Neon client from `createAuthClient()`
(`@neon/auth/next`) is passed to `AuthProvider` as-is: no adapter, no cast.

## Setup as performed
```bash
pnpm create next-app@latest next --ts --tailwind --app --eslint --use-pnpm --no-src-dir --import-alias "@/*" --yes
pnpm dlx shadcn@latest init -d --yes
pnpm add @neon/auth@0.8.0 @better-auth-ui/core@1.7.30 @better-auth-ui/react@1.7.30 \
  @tanstack/react-query @tanstack/query-core cn zod react-email \
  @better-auth/passkey@1.7.6 @better-auth/api-key@1.7.6 better-auth@1.7.6 sonner next-themes
pnpm dlx shadcn@latest add @better-auth-ui/auth @better-auth-ui/settings @better-auth-ui/user-button @better-auth-ui/email-otp --yes
```
The `@better-auth-ui` registry namespace resolves with no `components.json` entry.
Single `better-auth@1.7.6` is installed; no pnpm override needed.

## Hand-written files
`lib/auth/server.ts`, `lib/auth/client.ts`, `lib/query-client.ts`, `app/api/auth/[...path]/route.ts`,
`proxy.ts`, `components/providers.tsx`, `app/auth/[path]/page.tsx`, `app/settings/[path]/page.tsx`,
`app/page.tsx`, edits to `app/layout.tsx` and `next.config.ts`, `.env.local(.example)`.
Everything else under `components/auth/**`, `components/ui/**`, `lib/auth/*-plugin.ts` etc. is shadcn-generated.

## Known `@neon/auth` 0.8.0 gaps (workarounds kept here)
1. **Middleware skip routes.** `DEFAULT_AUTH_SKIP_ROUTES` (`packages/auth/src/server/middleware/route-protection.ts`) only lists `/api/auth` and the `/auth/{callback,sign-in,sign-up,magic-link,email-otp,forgot-password}` routes. It lacks reset-password, verify-email, error, redirect, sign-out and magic-link-sent, so `proxy.ts` bypasses a fuller public list before delegating to `auth.middleware()`.
2. **Error codes.** The SDK normalizes errors to Supabase-style codes in `customFetchImpl` (for example `email_not_confirmed`, with no `.error` field), so better-auth-ui branches that check better-auth codes such as `EMAIL_NOT_VERIFIED` never fire.

## Other workarounds
- `next.config.ts`: `cacheComponents` / `partialPrefetching` set to false (create-next-app canary enables them;
  they reject `export const dynamic`).
- `proxy.ts`: Neon's middleware uses a hardcoded skip-route list (`loginUrl` is the only option), which lacks
  `/`, reset-password, verify-email, etc. The proxy bypasses a fuller public list before delegating.
- Settings page does not do the upstream server-side `ensureSessionServer` prefetch (needs a real
  better-auth server instance; Neon's `auth` is a proxy). Settings is protected by the Neon middleware.

## Run
Copy `.env.local.example` to `.env.local`, fill `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` (`openssl rand -base64 32`), then `pnpm dev`. Open `/`, `/auth/sign-in`, `/settings/account`.
Note: email-OTP views need the Neon Auth project to have the email OTP plugin/provider enabled.
