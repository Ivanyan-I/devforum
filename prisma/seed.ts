import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const topics = [
    {
      name: "JavaScript",
      slug: "javascript",
      description: "Everything about JS and the browser",
    },
    {
      name: "TypeScript",
      slug: "typescript",
      description: "Static typing for JavaScript",
    },
    { name: "React", slug: "react", description: "UI library and ecosystem" },
    {
      name: "Next.js",
      slug: "nextjs",
      description: "React framework for production",
    },
    {
      name: "Node.js",
      slug: "nodejs",
      description: "Server-side JavaScript runtime",
    },
    { name: "CSS", slug: "css", description: "Styling, layout, and design" },
    {
      name: "DevOps",
      slug: "devops",
      description: "CI/CD, containers, and deployment",
    },
    {
      name: "Career",
      slug: "career",
      description: "Career advice for developers",
    },
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic,
    });
  }

  console.log("✅ Topics seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
