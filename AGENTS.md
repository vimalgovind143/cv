# AGENTS.md

Guidance for AI coding agents (Codex, Claude Code, Cursor, etc.) working in this
repository. If anything below disagrees with `package.json` or the source tree,
**the code wins** — please update this file instead of guessing.

## Project Overview

A **terminal-styled CV + technical blog** for Vimal Govind Markkasseri, built as a
statically exported Next.js 16 site and deployed to Cloudflare Pages. All CV
content lives in a single TypeScript file; blog posts are Markdown files compiled
with `gray-matter` + `remark` + `rehype-highlight`.

## Commands

The scripts in `package.json` use **npm**. The repo also ships a `pnpm-lock.yaml`
and a `Dockerfile` that uses `pnpm@8`, so both work — pick one and stay
consistent. (`yarn.lock` is a leftover and should not be used.)

```bash
npm run dev          # next dev (http://localhost:3000)
npm run build        # next build → produces ./out (static export)
npm run start        # npx serve@latest out  (serve the static export)
npm run preview      # build then serve
npm run lint         # ESLint (eslint.config.mjs + legacy .eslintrc.json)
npm run type-check   # tsc --noEmit
npm run format       # Prettier --write .
npm run deploy       # next build && wrangler pages deploy out
```

### Docker

```bash
docker compose build     # Build the image (uses pnpm@8 internally)
docker compose up -d     # Run the container
docker compose down      # Stop the container
```

### Linting & formatting notes

- The active linter is **ESLint** (`eslint.config.mjs` flat config plus a legacy
  `.eslintrc.json`). TypeScript and React/React Hooks rules are enabled.
- Formatting is **Prettier** (with the `prettier-plugin-tailwindcss` plugin).
- A `biome.json` is checked in but **Biome is not wired into any npm script**.
  Don't run `biome` unless you also wire it up.

## Architecture

### Routes (App Router)

- `/` — landing page: hero, stats, featured projects, recent writing, subscribe
- `/about` — full CV (work history, skills grouped by domain, education, export)
- `/projects` — full project list
- `/blog` — Markdown post listing with client-side tag filtering
- `/blog/[slug]` — individual post (statically generated from Markdown)
- `/feed.xml` — RSS feed
- `/sitemap.ts` — auto-generated sitemap

### Source tree

```
src/
├── app/                       # App Router routes
│   ├── about/, blog/, projects/
│   ├── feed.xml/, sitemap.ts, opengraph-image.tsx, loading.tsx
│   ├── layout.tsx             # Root layout: fonts, theme, nav, analytics
│   ├── page.tsx               # Landing page
│   └── globals.css            # Tailwind 4 entry + print + theme tokens
├── components/
│   ├── ui/                    # shadcn/ui primitives (avatar, badge, button,
│   │                          #   card, command, dialog, drawer, section)
│   ├── blog/                  # ArticleCard, BlogClient, GitHubRepoCard,
│   │                          #   MarkdownRenderer, TagFilter
│   ├── icons/                 # Brand icons (GitHub, LinkedIn, X, IG)
│   ├── Navigation.tsx         # Top nav + theme toggle
│   ├── command-menu.tsx       # Cmd/Ctrl+J palette (cmdk)
│   ├── print-drawer.tsx       # Print-friendly CV drawer
│   ├── ResumeExportButton.tsx # Print / save-as-PDF trigger
│   ├── CopyEmailButton.tsx    # Copy-to-clipboard email
│   ├── CvChatAssistant.tsx    # Floating CV chatbot (Cloudflare Workers AI)
│   ├── TerminalWindow.tsx     # Reusable terminal-styled card
│   ├── BackgroundAnimation.tsx
│   ├── PointerTechTrail.tsx
│   ├── ThemeProvider.tsx / ThemeToggle.tsx
│   └── error-boundary.tsx, section-error-boundary.tsx, section-skeleton.tsx
├── content/blog/              # 23 Markdown posts (frontmatter: title, date,
│                              #   tags, excerpt)
├── data/
│   └── resume-data.tsx        # SINGLE source of truth for all CV content
├── lib/
│   ├── blog.ts                # Markdown loading, reading time, tag filtering
│   ├── cv-knowledge.ts        # Knowledge base fed to CvChatAssistant
│   ├── structured-data.ts     # JSON-LD (Person, etc.) generators
│   └── utils.ts               # `cn()` helper (clsx + tailwind-merge)
├── types/
│   └── resume.ts              # WorkExperience, Project, Education, etc.
└── images/logos/              # Company logo components (Amthal, MV, BIM, …)
```

### Key technologies

- **Framework:** Next.js 16 (App Router, `output: 'export'` → fully static)
- **UI:** React 19, TypeScript 6, Tailwind CSS 4
- **Components:** shadcn/ui on Radix UI primitives
- **Theming:** `next-themes` (light/dark, system default, persisted under
  `cv-theme-mode`)
- **Command palette:** `cmdk` — bound to **Cmd/Ctrl + J** (not K)
- **Markdown:** `gray-matter` + `remark` + `remark-html` + `rehype-highlight`
- **Animation:** `framer-motion`, `vaul` (drawer), custom pointer trail
- **Analytics:** `@vercel/analytics` (works fine on Cloudflare Pages)
- **Deployment:** Cloudflare Pages via `wrangler` (`wrangler.toml` declares an
  `AI` binding used by `CvChatAssistant`)

### Important files

- `src/data/resume-data.tsx` — edit this to change anything on the CV
- `src/lib/cv-knowledge.ts` — edit this to change what the chat assistant knows
- `src/content/blog/*.md` — Markdown blog posts
- `src/app/layout.tsx` — metadata, fonts, theme, global providers
- `src/app/globals.css` — Tailwind 4 `@theme` tokens, print styles
- `biome.json` — config file present but unused; see "Linting notes" above

## Development Notes

### Editing the CV

All CV content is in the `RESUME_DATA` constant in
`src/data/resume-data.tsx`. The layout reads from this object, so adding new
fields is safe (just update `src/types/resume.ts` for typing).

### Adding a blog post

Drop a new `*.md` file into `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2026-04-17"
tags: [".NET", "Architecture"]
excerpt: "Brief description for the listing page"
---
```

Posts are picked up at build time by `getAllPosts()` in `src/lib/blog.ts`. The
`<h1>` in each post is demoted to `<h2>` so the page's own `<h1>` stays unique.

### Chat assistant (CvChatAssistant)

`CvChatAssistant` calls a Cloudflare Workers AI binding (`wrangler.toml` →
`[ai]`) using the knowledge entries in `src/lib/cv-knowledge.ts`. When the AI
quota is exhausted it surfaces the contact email (`hey@hellovg.win`) — see
`CV_AI_QUOTA_MESSAGE` and `CV_OUT_OF_SCOPE_MESSAGE`.

### Print / PDF export

`ResumeExportButton` opens `print-drawer.tsx`, which renders a print-friendly
version of the CV and triggers `window.print()`. The `@media print` block in
`globals.css` controls page breaks, colours, and margins — test by printing
after any layout change.

### SEO

- `metadataBase` is `https://hellovg.win`; keep `personalWebsiteUrl` in sync.
- `sitemap.ts` and `feed.xml` regenerate from the route + Markdown tree.
- `opengraph-image.tsx` generates the OG image at build time.

### Deployment

Primary target is Cloudflare Pages (`wrangler pages deploy out`). The static
`out/` directory can be hosted anywhere that serves static files (Vercel, Netlify,
GitHub Pages, Nginx, etc.). `images.unoptimized = true` is set because static
export does not support Next's image optimiser.
