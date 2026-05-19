## <!-- .claude/skills/db-change/SKILL.md -->

name: db-change  
description: Safely make a Prisma schema change and migration

---

For any Prisma schema change:

1. Show the schema diff first — get approval before proceeding
2. Add to schema.prisma following the existing patterns
3. Remember: NO url in datasource block (Prisma 7 rule)
4. Generate migration: npx prisma migrate dev --config ./prisma.config.ts --name <descriptive-name>
5. Generate client: npx prisma generate --config ./prisma.config.ts
6. Update any affected Server Actions and queries
7. Check for missing indexes on new foreign keys
