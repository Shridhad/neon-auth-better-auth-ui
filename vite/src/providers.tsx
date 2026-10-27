import { AuthProvider } from '@/components/auth/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { authClient } from '@/lib/auth-client'
import { emailOtpPlugin } from '@/lib/auth/email-otp-plugin'
import type { ComponentProps, ReactNode } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router'

type AuthLink = ComponentProps<typeof AuthProvider>['Link']

const Link: AuthLink = ({ href, to, ...props }) => (
  <RouterLink to={to ?? href} {...props} />
)

export function Providers({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <AuthProvider
      authClient={authClient}
      navigate={({ to, replace }) => navigate(to, { replace })}
      Link={Link}
      plugins={[emailOtpPlugin()]}
    >
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </AuthProvider>
  )
}
