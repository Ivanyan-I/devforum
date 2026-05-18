// Shown instantly while DashboardContent is fetching auth + posts.
// Uses animate-pulse to give a visual loading feel.
// Matches the shape of the real content — same card structure.
export default function DashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="h-7 bg-muted rounded w-12" />
              <div className="h-7 bg-muted rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
