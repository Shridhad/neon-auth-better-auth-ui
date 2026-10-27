import { viewPaths } from "@better-auth-ui/core"
import { emailOtpPlugin } from "@better-auth-ui/core/plugins/email-otp"
import { notFound } from "next/navigation"
import { Auth } from "@/components/auth/auth"

const validAuthPaths = new Set<string>([
  ...Object.values(viewPaths.auth),
  ...Object.values(emailOtpPlugin().viewPaths.auth ?? {})
])

export default async function AuthPage({
  params
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params
  if (!validAuthPaths.has(path)) notFound()

  return (
    <div className="flex justify-center my-auto p-4 md:p-6">
      <Auth path={path} />
    </div>
  )
}
