import { createAuthClient } from '@neon/auth'
import { BetterAuthReactAdapter } from '@neon/auth/react/adapters'

const url = import.meta.env.VITE_NEON_AUTH_URL

export const authClient = createAuthClient(url)

export const reactAdapterAuthClient = createAuthClient(url, {
  adapter: BetterAuthReactAdapter(),
})
