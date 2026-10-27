# Comparison: this setup vs. the Neon Auth examples in `neondatabase/examples`

This compares how the apps in this repo set up Neon Auth with the five Neon Auth examples in
[neondatabase/examples](https://github.com/neondatabase/examples) (surveyed 2026-10-27). The
goal is a list of what each example needs to change to move to `@neon/auth` and better-auth-ui 1.7.

## The two approaches at a glance

| | `neondatabase/examples` today | This repo |
|---|---|---|
| SDK | `@neondatabase/auth` 0.4.2-beta – 0.6.0-beta (or `@neondatabase/neon-js` 0.7.0-beta) | `@neon/auth` 0.8.0 |
| UI library | `@neondatabase/auth-ui` 0.2.1-beta – 0.4.0-beta, which bundles `@daveyplate/better-auth-ui` 3.x | `@better-auth-ui/react` + `@better-auth-ui/core` 1.7.30, no Neon UI package |
| How UI arrives | Prebuilt components from npm | `npx shadcn add @better-auth-ui/...` copies component source into the app |
| Provider | `NeonAuthUIProvider` (Neon wrapper) | The upstream `AuthProvider`, copied by shadcn, with the Neon client passed straight in. No adapter or type casts. |
| Styling | `@import "@neondatabase/auth-ui/tailwind"` or `@neondatabase/auth-ui/css` | Nothing to import. The app's own Tailwind 4 compiles the copied components, themed with shadcn CSS variables. |
| Views | `<AuthView path>` (+ `<AccountView>`, not used by any example) | `<Auth path>`, `<Settings path>` |
| Routes | `/auth/[path]` (+ `/account/[path]`) | `/auth/[path]`, `/settings/[path]` |
| Data layer | Internal to the UI package | TanStack Query (`QueryClientProvider` required on Next.js) |
| React / Tailwind | React 18+, Tailwind 3 or 4 | React ≥ 19.2.6, Tailwind ≥ 4.3.2 |
| Hand-written auth files | 5–13 per example | Next.js ~9, Vite ~4 (plus config) |

Unchanged: `createNeonAuth()` / `auth.handler()` / `auth.middleware()` on the server,
`createAuthClient()` on the client, and the env vars (`NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`).
Moving from `@neondatabase/auth` to `@neon/auth` 0.8.0 only changed imports here; no API changes
were needed.

## What the new setup does better

- **Smaller installs.** `@neondatabase/auth` 0.7.0-beta still pulls in `@neondatabase/auth-ui` and
  `@daveyplate/better-auth-ui` even if you never import them. Switching these demos to `@neon/auth`
  removed about 116 packages from the Next.js app and about 122 from the Vite app.
- **Theming is plain shadcn.** No CSS entry point to pick, no `source(none)` or `?url` stylesheet tricks
  (seen in `realtime/with-nextjs`, `realtime/with-tanstack`), and the components are source files
  you can edit.
- **No hidden provider behavior.** Features are opt-in plugins (`plugins={[emailOtpPlugin()]}`)
  instead of flags a wrapper may override.
- **Types line up.** `createAuthClient()` from `@neon/auth` (vanilla, React adapter or `/next`)
  satisfies better-auth-ui's `AuthClient` type with no casts. Compare the `as any` casts in
  `with-tanstack-ai-starter-full-backend`. One caveat: plugin components such as email OTP cast
  the client internally, so plugin methods are checked only at runtime.

## What is not better (yet)

- **About the same number of hand-written files.** better-auth-ui 1.7 adds a `QueryClientProvider`, a
  required `Link` prop and a `navigate({ to, replace })` adapter. A Neon setup command (see the end)
  could write these files for you.
- **Many required peer dependencies.** `@better-auth-ui/react` requires `@better-auth/passkey`,
  `@better-auth/api-key`, `react-email`, `zod` 4, `cn` and TanStack Query, even for features you don't
  use.
- **A large component bundle.** The shadcn items copy about 40–70 files, and the Vite bundle is about 1.2 MB.
- **Two `@neon/auth` 0.8.0 gaps affect better-auth-ui directly:**
  1. **Public routes.** `auth.middleware()` hardcodes `DEFAULT_AUTH_SKIP_ROUTES`, which leaves out
     `/auth/reset-password`, `/auth/verify-email`, `/auth/error`, `/auth/sign-out` and others. This
     repo works around it in `next/proxy.ts`.
  2. **Error codes.** The client rewrites Better Auth error codes into Supabase-style ones
     (`EMAIL_NOT_VERIFIED` → `email_not_confirmed`), so better-auth-ui's verify-email redirect never
     fires. There's no workaround here; it needs an SDK fix.

## What each example needs to change

The same steps apply to every example:

1. **Swap packages.** Remove `@neondatabase/auth` / `@neondatabase/neon-js` and
   `@neondatabase/auth-ui`, then add `@neon/auth`. Rewrite imports to `@neon/auth/...`; the subpaths are the same.
2. **Add the UI from shadcn.** Run `npx shadcn init` (if needed), then
   `npx shadcn add @better-auth-ui/auth @better-auth-ui/settings @better-auth-ui/user-button @better-auth-ui/email-otp`,
   and install the required peers.
3. **Replace the provider.** `NeonAuthUIProvider` becomes the copied `AuthProvider`:
   - Pass `authClient`, `Link` and `navigate={({ to, replace }) => ...}`.
   - Change `redirectTo` only if you want a different destination.
   - Replace the `emailOTP` / `social` flags with `plugins={[...]}`.
   - On Next.js, wrap it in `QueryClientProvider`.
   - Drop `onSessionChange`, which better-auth-ui 1.7 doesn't support. Refreshing the session after sign-in or sign-out now goes through TanStack Query.
4. **Replace the views.** `<AuthView path>` becomes `<Auth path>`. Build valid paths from `viewPaths.auth`
   (+ plugin `viewPaths`) instead of `authViewPaths`. Add `/settings/[path]` if the app needs account settings.
5. **Remove the CSS imports.** Delete `@neondatabase/auth-ui/tailwind` / `/css` and keep the shadcn theme in `globals.css`.
6. **Upgrade the stack where needed.** React ≥ 19.2.6 and Tailwind ≥ 4.3.2.

Changes specific to each example:

| Example | Extra changes |
|---|---|
| `realtime/with-nextjs` | The `(auth)` route group with its own `auth-ui.css` and `source(none)` goes away; the components share the app's Tailwind. Keep the lazy `createNeonAuth`, because `next build` needs it to run without the cookie secret. Replace the never-settling `onSessionChange` promise with nothing. The proxy matcher is `["/"]` only, so the skip-route gap doesn't bite. |
| `realtime/with-tanstack` | Keep `createAuthServer` / `handleAuthProxyRequest`. Write a TanStack `Link` adapter mapping `href`/`to` (similar to `vite/src/providers.tsx`). Drop the `css?url` stylesheet link. Keep `ssr: false` on `/auth/$path`. Pass `redirectTo` explicitly, as today. |
| `realtime/guides-chat-app` | Vite SPA, closest to `vite/` in this repo. `account={false}` becomes simply not adding `/settings/*`. Keep the JWT/JWKS backend check. |
| `with-websockets-function/web` | Oldest pins (`^0.4.2-beta` / `^0.2.1-beta`), so jump straight to `@neon/auth`. Replace `SignedIn` / `SignedOut` / `RedirectToSignIn` with the 1.7 equivalents, or a `useSession` check. Keep `router.refresh()` in your own sign-out flow, since there's no `onSessionChange`. |
| `with-tanstack-ai-starter-full-backend` | Uses `@neondatabase/neon-js`, so move to `@neon/neon-js`. Its sign-in is a hand-built form, so it can either adopt `<Auth>` or keep the form, dropping `auth-ui` entirely. The `as any` casts around `signIn.social` should go away with `@neon/auth` types. |

## Suggested follow-ups

- **`@neon/auth`:** keep the raw Better Auth error on thrown errors, complete
  `DEFAULT_AUTH_SKIP_ROUTES` for better-auth-ui 1.7 views, and let `auth.middleware()` accept extra public routes.
- **Agent setup.** `neondatabase/examples` has an `AGENTS.md`, but nothing on setting up Neon Auth, and there is
  no `llms.txt`. Add a short "Neon Auth + better-auth-ui" section, or provide a Neon shadcn registry item that writes the
  Neon-specific files (client, provider, API route, pages) in one command.
- **Port one example first**, e.g. `realtime/with-nextjs`, and use it as the reference for the rest.
