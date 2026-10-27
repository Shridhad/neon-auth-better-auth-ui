# Neon Auth + better-auth-ui (Vite SPA demo)

Throwaway demo: `@neon/auth@0.8.0` client passed straight into
`@better-auth-ui/react@1.7.30` `AuthProvider`, no Neon UI wrapper, no adapter, no cast.

## Run
```
pnpm install
# copy .env.example to .env and set VITE_NEON_AUTH_URL (your Neon Auth URL)
pnpm dev
pnpm build   # tsc -b && vite build
```
Routes: `/`, `/auth/:path` (sign-in, sign-up, ...), `/settings/:path` (guarded; e.g. `/settings/account`).

## Commands performed
```
pnpm create vite@latest vite --template react-ts
pnpm add tailwindcss @tailwindcss/vite      # + vite.config.ts plugin/alias, `@import "tailwindcss"`, tsconfig paths
pnpm dlx shadcn@latest init -d -y
pnpm add @neon/auth@0.8.0 @better-auth-ui/core@1.7.30 @better-auth-ui/react@1.7.30 \
  better-auth@1.7.6 zod react-router sonner @tanstack/react-query @tanstack/query-core react-email \
  @better-auth/api-key@1.7.6 @better-auth/passkey@1.7.6 cn
pnpm dlx shadcn@latest add @better-auth-ui/auth @better-auth-ui/settings @better-auth-ui/user-button @better-auth-ui/email-otp -y
```

## Files
- shadcn-generated: `components.json`, `src/components/auth/**`, `src/components/ui/**`, `src/lib/auth/**`, `src/lib/utils.ts`, theme vars in `src/index.css`.
- Hand-written: `src/lib/auth-client.ts`, `src/providers.tsx`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/typecheck-probe.tsx`, `vite.config.ts`, tsconfig `paths`, `.env*`.
- `src/typecheck-probe.tsx` is evidence only: both clients into `AuthProvider`, plus a `@ts-expect-error` negative control.

## Findings
- Both `createAuthClient(url)` and `createAuthClient(url, { adapter: BetterAuthReactAdapter() })` typecheck as `authClient` with no cast.
- better-auth: single version 1.7.6 (pinned directly; `@neon/auth` pins it exactly). No legacy `@neondatabase/auth`, `@neondatabase/auth-ui` or `@daveyplate/better-auth-ui` in the install.
- Cross-origin: SPA origin must be allowed by the Neon Auth project's trusted origins / CORS (configure in Neon console); not configured by this demo.

## Known `@neon/auth` 0.8.0 gaps
1. **Error codes.** The SDK normalizes errors to Supabase-style codes in `customFetchImpl` (for example `code: "email_not_confirmed"`, no `.error`), so better-auth-ui's `error.error?.code === "EMAIL_NOT_VERIFIED"` branch never fires.
2. **Middleware skip routes.** `DEFAULT_AUTH_SKIP_ROUTES` in `@neon/auth/server` omits reset-password, verify-email, error, redirect, sign-out and magic-link-sent. This only affects Next.js middleware, so this SPA is unaffected; see the Next.js app README for the `proxy.ts` workaround.
