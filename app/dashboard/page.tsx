import DashboardContent from "@/components/dashboard-content";
import DashboardSkeleton from "@/components/dashboard-skeleton";

import Link from "next/link";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Link
          href="/posts/create"
          className="text-sm font-medium border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
        >
          + New Post
        </Link>
      </div>

      {/* Everything inside Suspense runs at request time.
          Next.js streams this in after auth + DB resolve. */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
