# 🌾 AgriMind AI

An AI-powered agricultural intelligence platform built for Bangladeshi farmers — providing crop information, farming guidance, community discussion, and an AI chat assistant for agricultural queries.

## ✨ Features

- 🔐 **Authentication** — Email/password login & registration via BetterAuth
- 🌱 **Crop Database** — Browse, search, and filter crops by season
- ➕ **Add Crop Data** — Authenticated users can contribute crop intelligence (farming tips, common diseases, difficulty level, region)
- 💬 **Discussion Forum** — Comment on crop entries to ask questions or share insights

- 📊 **User Dashboard** — Manage your own crop posts and comments (edit/delete)

## 🛠️ Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Framework      | Next.js (App Router)             |
| Language       | TypeScript                       |
| Styling        | Tailwind CSS                     |
| Animation      | Framer Motion                    |
| Icons          | React Icons                      |
| Forms          | React Hook Form + Zod validation |
| Authentication | Better Auth                      |
| ORM            | Prisma                           |
| Database       | PostgreSQL (Neon)                |
| AI             | Groq SDK (Llama 3.3 70B)         |

## 📁 Project Structure

```
agrimind/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── actions/
│   │   ├── crop.ts          # Server actions: create, read, update, delete crops
│   │   └── comment.ts       # Server actions: create, read, update, delete comments
│   ├── api/
│   │   └── auth/[...all]/route.ts   # Better Auth handler
│   ├── crops/
│   │   ├── page.tsx         # Crop explore/listing page
│   │   └── [id]/page.tsx    # Crop details + comments
│   ├── add-crops/page.tsx   # Add new crop form
│   ├── dashboard/page.tsx   # User's crops & comments management
│   ├── lib/
│   │   ├── auth.ts          # Better Auth server config
│   │   ├── auth-client.ts   # Better Auth client instance
│   │   ├── prisma.ts        # Prisma client singleton
│   │   └── validations/
│   │       ├── auth.ts      # Zod schemas: login, register
│   │       └── crop.ts      # Zod schema: crop form
│   └── components/
│       ├── Navbar.tsx
│       ├── Footer.jsx
│       ├── Hero.tsx
│       └── HomeCrops.tsx
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── generated/
│   └── prisma/               # Generated Prisma Client
├── prisma.config.ts
└── .env


## 📜 Key Commands Reference

| Command | Purpose |
|---|---|
| `npx prisma generate` | Regenerate Prisma Client after schema changes |
| `npx prisma migrate dev --name <name>` | Create & apply a new migration |
| `npx prisma migrate status` | Check if migrations are applied |
| `npx prisma studio` | Open visual database browser |
| `npm run dev` | Start development server |

## ⚠️ Version Notes

- Uses **Prisma 6.x** (not 7.x) for stability with Better Auth's Prisma adapter
- Generator provider must remain `prisma-client-js` (not the newer `prisma-client` unified generator)
- If switching Prisma major versions, always delete the `generated/prisma` folder and `.next` cache before regenerating



```
