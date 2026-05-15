import Link from "next/link";

export default function TopicNotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-2">Topic not found</h2>
      <p className="text-muted-foreground mb-6">
        This topic doesn&apos;t exist or has been removed.
      </p>
      <Link href="/" className="text-sm font-medium hover:underline">
        ← Back to home
      </Link>
    </div>
  );
}
