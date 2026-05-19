# DevForum Agent Rules

## Stack Versions (Breaking Changes)

- **Next.js 16.2.6** — new caching system, read `node_modules/next/dist/docs/` before coding
- **React 19.2.4** — useActionState (not useFormState), useOptimistic
- **Prisma 7.x** — driver adapters required, NO url in schema.prisma
- **NextAuth v5 beta** — JWT only (adapter incompatible with Prisma 7)
- **Tailwind v4** — CSS-based config (no tailwind.config.js)
- **Sonner** — toast library (NOT shadcn toast component)
- **pnpm** — package manager (NOT npm/yarn)

## Prisma 7 Critical Rules

1. **NO `url` in schema.prisma** — put it in `prisma.config.ts` with `defineConfig`
2. **Driver adapter required** — `@prisma/adapter-pg` + `pg`, pass to PrismaClient constructor
3. **DATABASE_URL** — must be in `.env` (NOT `.env.local`)
4. **All commands** — add `--config ./prisma.config.ts` flag
5. **Generator** — `provider = "prisma-client-js"` (NOT "prisma-client")
6. **NO `directUrl`** — removed in v7

### PrismaClient Singleton
```ts
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}
const prisma = globalThis.prisma ?? prismaClientSingleton()
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
export default prisma
```

## Next.js 16 Caching Rules

1. **next.config.ts** — set `cacheComponents: true`
2. **'use cache' directive** — must be FIRST line in function body (not a string):
   ```ts
   async function getData() {
     "use cache"  // ✅ correct
     cacheTag("posts")
     cacheLife("hours")
     return db.query()
   }
   ```
3. **cacheTag() and cacheLife()** — must be top-level calls in the function, NOT inside conditionals
4. **revalidateTag()** — requires second arg: `revalidateTag("tag", "max")`
5. **updateTag()** — use in Server Actions for immediate invalidation (no wait)
6. **NO revalidatePath** — replaced by cache tags
7. **NO unstable_cache** — that's Next.js 15 pattern

## Auth Rules

- **Session strategy** — JWT (database sessions break with Prisma 7 adapter)
- **Route protection** — `proxy.ts` (Next.js 16 middleware), but do NOT check ownership there
- **Ownership checks** — always in page/action, NEVER in middleware (avoids existence leak)
- **Silent fails** — use `notFound()` when auth/ownership fails (don't reveal if resource exists)
- **User creation** — manual in `signIn` callback (adapter doesn't work)
- **Session.user.id** — extend via `jwt` + `session` callbacks in auth.ts
- **Client auth** — `useSession()` from `next-auth/react`, wrap app in `<SessionProvider>` in layout.tsx

## Server Actions Pattern

```ts
"use server"
import { auth } from "@/auth"
import { revalidateTag, updateTag } from "next/cache"

export async function createPost(prevState: State, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Unauthorized" }
  
  const validated = schema.safeParse(Object.fromEntries(formData))
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors }
  
  const post = await prisma.post.create({ data: validated.data })
  
  updateTag("posts")  // immediate invalidation in actions
  redirect(`/posts/${post.id}`)
}
```

## Critical Patterns

### Parameterized Server Action
```ts
// action
export async function updatePost(postId: string, prevState: State, formData: FormData) {}

// component
const boundAction = updatePost.bind(null, postId)
const [state, action] = useActionState(boundAction, null)
```

### Ownership Check (silent fail)
```ts
const post = await prisma.post.findUnique({ where: { id } })
if (!post) return notFound()
if (post.authorId !== session.user.id) return notFound()  // don't reveal post exists
```

### Vote Toggle
```ts
if (!existingVote) create(vote)
else if (existingVote.type === voteType) delete(vote)  // undo
else update(vote, { type: voteType })                   // flip
```

### Optimistic Update
```ts
"use client"
import { useOptimistic, useTransition } from "react"

const [optimisticState, setOptimisticState] = useOptimistic(committedState)
const [pending, startTransition] = useTransition()

const handleAction = (newValue) => {
  startTransition(async () => {
    setOptimisticState(newValue)
    await serverAction(newValue)
  })
}
```

## Critical Conventions

1. **No src/** — all code at project root
2. **Server Components default** — only add "use client" for hooks/events
3. **SessionProvider** — must wrap entire app in layout.tsx
4. **Ownership in pages** — NOT in middleware (prevents existence leaks)
5. **updateTag in actions** — NOT revalidateTag (updateTag is immediate)
6. **Sonner toast** — `toast.success()`, NOT shadcn Toast component

## Common Mistakes to Avoid

1. ❌ `url = env("DATABASE_URL")` in schema.prisma → ✅ put in prisma.config.ts
2. ❌ `revalidatePath()` → ✅ use updateTag() or revalidateTag()
3. ❌ `'use cache'` as string literal → ✅ must be directive (first line)
4. ❌ Ownership check in proxy.ts → ✅ do it in page/action
5. ❌ `revalidateTag("tag")` → ✅ `revalidateTag("tag", "max")`
6. ❌ Database session strategy → ✅ JWT only (adapter breaks)
7. ❌ `.env.local` for DATABASE_URL → ✅ use `.env`

## Commands

```bash
pnpm seed                                           # seed topics
npx prisma studio --config ./prisma.config.ts      # open Studio
npx prisma migrate dev --config ./prisma.config.ts --name <name>  # new migration
npx prisma generate --config ./prisma.config.ts    # generate client
```

## Key Files

- **auth.ts** — NextAuth config, GitHub OAuth, JWT callbacks with user.id extension
- **proxy.ts** — route protection (middleware replacement), protects /posts/create, /dashboard, /posts/:id/edit
- **prisma.config.ts** — DATABASE_URL config for Prisma 7
- **lib/prisma.ts** — PrismaClient singleton with driver adapter
- **actions/posts.ts** — all Server Actions (create, update, delete, vote, comment)
- **app/layout.tsx** — SessionProvider wrapper + Toaster
