## <!-- .claude/skills/new-feature/SKILL.md -->

name: new-feature
description: Scaffold a new DevForum feature following project conventions

---

When adding a new feature to DevForum:

1. **Server Action first** (actions/posts.ts or new actions file):
   - auth() check → Zod validation → DB mutation → revalidateTag → redirect
   - Always return { errors } shape on validation failure

2. **Page (Server Component)**:
   - Use `use cache` + cacheTag + cacheLife for cacheable routes
   - Auth-gated: check session, redirect if missing

3. **Client Component** (only if needed):
   - useActionState + useFormStatus pattern
   - SubmitButton must be a CHILD component of <form>
   - Sonner toast on success/error

4. **DB change**: generate migration with npx prisma migrate dev --config ./prisma.config.ts

5. **Revalidation**: use revalidateTag("posts", "max") or revalidateTag("topics", "max")

Ask for the feature description, then scaffold all files.
