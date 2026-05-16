export default function HomeLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 bg-muted rounded animate-pulse" />
      <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
            <div className="h-3 w-48 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
