import Link from "next/link";
import NavAuth from "@/components/nav-auth";

export default function Navbar() {
  return (
    <nav className="border-b px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          DevForum
        </Link>

        <form method="GET" action="/search" className="hidden sm:flex">
          <input
            name="q"
            type="text"
            placeholder="Search..."
            className="border rounded-md px-3 py-1.5 text-sm bg-background w-48"
          />
        </form>
        <NavAuth />
      </div>
    </nav>
  );
}
