import Link from "next/link";
import { signOut, useSession } from "next-auth/react"

export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <div className="flex justify-between">
      <Link href="/">
        <h1 className="text-4xl font-medium font-mono">0xSybil</h1>
      </Link>
      {!loading && session && (
        <a
          href={`/api/auth/signout`}
          onClick={(e) => {
            e.preventDefault()
            signOut()
          }}
        >
          Sign out
        </a>)}
    </div>
  )
}
