# Neon Auth + better-auth-ui (Vite SPA demo)

Throwaway demo: `@neon/auth@0.8.1` client passed straight into
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
pnpm add @neon/auth@^0.8.1 @better-auth-ui/core@1.7.30 @better-auth-ui/react@1.7.30 \
  zod react-router sonner @tanstack/react-query @tanstack/query-core react-email cn
pnpm dlx shadcn@latest add @better-auth-ui/auth @better-auth-ui/settings @better-auth-ui/user-button @better-auth-ui/email-otp -y
pnpm add better-auth@~1.7.12   # after shadcn add; the copied components import types from better-auth
```

## Files
- shadcn-generated: `components.json`, `src/components/auth/**`, `src/components/ui/**`, `src/lib/auth/**`, `src/lib/utils.ts`, theme vars in `src/index.css`.
- Hand-written: `src/lib/auth-client.ts`, `src/providers.tsx`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/typecheck-probe.tsx`, `vite.config.ts`, tsconfig `paths`, `.env*`.
- `src/typecheck-probe.tsx` is evidence only: both clients into `AuthProvider`, plus a `@ts-expect-error` negative control.

## Findings
- Both `createAuthClient(url)` and `createAuthClient(url, { adapter: BetterAuthReactAdapter() })` typecheck as `authClient` with no cast.
- better-auth: single version 1.7.12 (`~1.7.12`, the range `@neon/auth` 0.8.1 uses; better-auth's npm `latest` is a 1.8 beta). No legacy `@neondatabase/auth`, `@neondatabase/auth-ui` or `@daveyplate/better-auth-ui` in the install.
- Cross-origin: SPA origin must be allowed by the Neon Auth project's trusted origins / CORS (configure in Neon console); not configured by this demo.

## Public routes
The Next.js `proxy.ts` / `publicRoutes` option does not apply to this SPA; route guarding is client-side (`/settings/*`).

## Known issues
- `navigate` in `src/providers.tsx` and the copied `auth-redirect.tsx` replace any target starting with `//` with `/`. `getSafeRedirectTo()` in `@better-auth-ui/core` 1.7.30 can return protocol-relative paths after URL normalization (for example `?redirectTo=/a/..//host`), an open redirect that is unfixed upstream. Remove the guard once upstream fixes it.
