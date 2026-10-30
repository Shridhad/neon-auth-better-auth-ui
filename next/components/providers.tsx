"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { AuthProvider } from "@/components/auth/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { emailOtpPlugin } from "@/lib/auth/email-otp-plugin"
import { authClient } from "@/lib/auth/client"
import { getQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <QueryClientProvider client={getQueryClient()}>
      <AuthProvider
        authClient={authClient}
        redirectTo="/settings/account"
        emailAndPassword={{ requireEmailVerification: false }}
        // getSafeRedirectTo in @better-auth-ui/core 1.7.30 can return protocol-relative paths after URL normalization.
        navigate={({ to, replace }) => {
          const safe = to.trim().startsWith("//") ? "/" : to
          if (replace) router.replace(safe)
          else router.push(safe)
        }}
        plugins={[emailOtpPlugin()]}
        Link={Link}
      >
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}
