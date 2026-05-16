export default function SearchLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="h-8 w-32 bg-muted rounded animate-pulse" />
      <div className="h-10 w-full bg-muted rounded animate-pulse" />
      <div className="space-y-3 mt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            <div className="h-3 w-48 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
