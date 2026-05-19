import prisma from "../lib/prisma";

async function findDeepComments() {
  // Find all comments
  const comments = await prisma.comment.findMany({
    include: { parent: true },
  });

  const depths = new Map<string, number>();

  function calculateDepth(commentId: string, visited = new Set<string>()): number {
    if (visited.has(commentId)) return Infinity;
    if (depths.has(commentId)) return depths.get(commentId)!;

    const comment = comments.find((c) => c.id === commentId);
    if (!comment || !comment.parentId) {
      depths.set(commentId, 0);
      return 0;
    }

    visited.add(commentId);
    const depth = 1 + calculateDepth(comment.parentId, visited);
    depths.set(commentId, depth);
    return depth;
  }

  comments.forEach((c) => calculateDepth(c.id));

  const deepComments = comments.filter((c) => {
    const depth = depths.get(c.id)!;
    return depth > 4;
  });

  console.log("Comments with depth > 4:");
  deepComments.forEach((c) => {
    console.log(
      `ID: ${c.id}, Depth: ${depths.get(c.id)}, Content: ${c.content.substring(0, 50)}`
    );
  });

  if (deepComments.length > 0) {
    console.log("\nDeleting these comments...");
    for (const c of deepComments) {
      await prisma.comment.delete({ where: { id: c.id } });
      console.log(`Deleted: ${c.id}`);
    }
    console.log("\n✅ Cleanup complete!");
  } else {
    console.log("\n✅ No deep comments found.");
  }

  await prisma.$disconnect();
}

findDeepComments().catch(console.error);
