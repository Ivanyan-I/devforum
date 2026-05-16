export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      <div className="border rounded-lg p-6 space-y-4">
        <div className="h-7 w-96 bg-muted rounded animate-pulse" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
