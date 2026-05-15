import Link from "next/link";
import { auth } from "@/auth";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          DevForum
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user.name}
              </span>
              <Link href="/posts/create" className="text-sm font-medium">
                + New Post
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
}