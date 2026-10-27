import Link from "next/link"
import { UserButton } from "@/components/auth/user/user-button"
import { auth } from "@/lib/auth/server"

export const dynamic = "force-dynamic"

export default async function Home() {
  const { data: session } = await auth.getSession()

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Neon Auth + Better Auth UI</h1>
        <UserButton />
      </div>
      <p>
        {session?.user
          ? `Signed in as ${session.user.email}`
          : "Not signed in"}
      </p>
      <nav className="flex gap-4 underline">
        <Link href="/auth/sign-in">Sign in</Link>
        <Link href="/settings/account">Settings</Link>
      </nav>
    </main>
  )
}
