import { AuthProvider } from '@/components/auth/auth-provider'
import { authClient, reactAdapterAuthClient } from '@/lib/auth-client'
import { useSession } from '@better-auth-ui/react'

const nav = () => {}
const Link = () => null

export const A = () => (
  <AuthProvider authClient={authClient} navigate={nav} Link={Link}>x</AuthProvider>
)
export const B = () => (
  <AuthProvider authClient={reactAdapterAuthClient} navigate={nav} Link={Link}>x</AuthProvider>
)
// Sanity: the probe can fail (wrong client shape is rejected).
export const C = () => (
  // @ts-expect-error not an auth client
  <AuthProvider authClient={{}} navigate={nav} Link={Link}>x</AuthProvider>
)
export function useIt() {
  const s = useSession(authClient)
  const email: string | undefined = s.data?.user.email
  return email
}
