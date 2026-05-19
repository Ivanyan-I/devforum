## <!-- .claude/skills/review/SKILL.md -->

name: review
description: Review a component or server action for correctness against DevForum conventions

---

Review the specified file or component against these DevForum standards:

## Target

$ARGUMENTS

If no file was specified, ask the user which file or component to review before proceeding.

## Check for

**Auth & Security**

- Every Server Action has `await auth()` as first line
- Ownership checks use `notFound()` not unauthorized (silent fail)
- No session data exposed to client components directly

**Caching**

- Uses `use cache` + `cacheTag()` + `cacheLife()` — NOT `unstable_cache`
- No `revalidatePath` — only `revalidateTag("tag", "max")`

**Forms**

- `useFormStatus` is inside a child component of `<form>`
- `useActionState` used correctly with prevState + formData
- Sonner toast used (NOT shadcn toast)

**Prisma**

- Queries go through the singleton from `lib/prisma.ts`
- No raw SQL unless absolutely necessary
- Cascade deletes match schema (Comment → Post)

**Client vs Server**

- `"use client"` only added when hooks or event handlers are present
- Server Components fetch data directly — no useEffect data fetching
- `useSession()` used on client, `await auth()` on server

## Output format

- List issues by severity: Critical / Warning / Suggestion
- Include exact file + line reference for each issue
- Suggest the fix inline
