import { Auth } from '@/components/auth/auth'
import { Settings } from '@/components/auth/settings/settings'
import { UserButton } from '@/components/auth/user/user-button'
import { authClient } from '@/lib/auth-client'
import { useAuth, useSession } from '@better-auth-ui/react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router'

function Home() {
  const { authClient } = useAuth()
  const { data: session, isPending } = useSession(authClient)

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Neon Auth + better-auth-ui</h1>
        <UserButton />
      </div>
      <p>
        {isPending
          ? 'Loading session...'
          : session
            ? `Signed in as ${session.user.email}`
            : 'Signed out'}
      </p>
      <nav className="flex gap-4 underline">
        <Link to="/auth/sign-in">Sign in</Link>
        <Link to="/auth/sign-up">Sign up</Link>
        <Link to="/settings/account">Settings</Link>
      </nav>
    </div>
  )
}

function AuthPage() {
  const { path } = useParams()
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Auth path={path} />
    </main>
  )
}

function RequireSession({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession(authClient)
  if (isPending) return null
  if (!session) return <Navigate to="/auth/sign-in" replace />
  return children
}

function SettingsPage() {
  const { path } = useParams()
  return (
    <RequireSession>
      <main className="mx-auto max-w-3xl p-4">
        <Settings path={path} />
      </main>
    </RequireSession>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/:path" element={<AuthPage />} />
      <Route path="/settings/:path" element={<SettingsPage />} />
    </Routes>
  )
}
