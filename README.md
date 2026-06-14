![cv](https://github.com/user-attachments/assets/5fcf8a2b-8d07-4822-a61f-b7a36d71d08b)

# Vimal Govind Markkasseri - Developer CV & Blog

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A terminal-inspired developer portfolio featuring a minimalist CV with an
integrated technical blog. Built for .NET backend engineers who appreciate
clean, focused design.

## ✨ Features

- 📝 **Single Config File** — update all your resume data in
  [one place](./src/data/resume-data.tsx)
- 🎨 **Terminal Aesthetic** — dark theme with neon accents and monospaced fonts
  (JetBrains Mono + Inter), light/dark toggle with `system` default
- 📱 **Fully Responsive** — optimised for mobile, tablet, and desktop
- 🖨️ **Print / Save as PDF** — dedicated print drawer with page-break-tuned
  styles in `globals.css`
- ⌨️ **Keyboard Navigation** — press `Cmd/Ctrl + J` for the command palette
  (powered by `cmdk`)
- 🤖 **CV Chat Assistant** — floating chatbot that answers questions about the
  CV, powered by Cloudflare Workers AI
- 🚀 **Static Export** — built with Next.js 16 in `output: 'export'` mode for
  fast, CDN-friendly delivery
- 📝 **Technical Blog** — Markdown-based articles with syntax highlighting and
  reading-time estimates
- 🏷️ **Tag Filtering** — client-side filter blog posts by technology tags
- 🔍 **SEO Optimised** — per-route metadata, JSON-LD `Person` schema,
  auto-generated `sitemap.ts`, `feed.xml`, and `opengraph-image.tsx`
- 🌐 **Cloudflare Pages** — one-command deploy via `wrangler pages deploy`

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, static export)
- **UI**: [React 19](https://react.dev/)
- **Language**: [TypeScript 6](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.3](https://tailwindcss.com/) (`@theme` tokens in
  `globals.css`)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) on [Radix UI](https://www.radix-ui.com/)
- **Theming**: [`next-themes`](https://github.com/pacocoursey/next-themes)
  (storage key `cv-theme-mode`)
- **Markdown**: [`gray-matter`](https://github.com/jonschlinkert/gray-matter)
  + [`remark`](https://github.com/remarkjs/remark)
- **Syntax Highlighting**: [`highlight.js`](https://highlightjs.org/) via
  [`rehype-highlight`](https://github.com/rehypejs/rehype-highlight)
- **Command Palette**: [`cmdk`](https://cmdk.paco.me/)
- **Animation**: [`framer-motion`](https://www.framer.com/motion/),
  [`vaul`](https://vaul.emilkowal.ski/) (drawer), custom pointer trail
- **Analytics**: [`@vercel/analytics`](https://vercel.com/analytics) (works on
  Cloudflare Pages)
- **AI**: Cloudflare Workers AI (`[ai]` binding in `wrangler.toml`)
- **Package Manager**: [npm](https://www.npmjs.com/) (primary). A
  `pnpm-lock.yaml` and a `pnpm`-based `Dockerfile` also ship; `yarn.lock` is a
  leftover and should not be used.
- **Linting / Formatting**: [ESLint](https://eslint.org/) (flat config in
  `eslint.config.mjs` + legacy `.eslintrc.json`) and [Prettier](https://prettier.io/)
  with `prettier-plugin-tailwindcss`. A `biome.json` is checked in but Biome is
  not wired into any script.
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) via
  [`wrangler`](https://developers.cloudflare.com/workers/wrangler/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ (or pnpm 8+ if you prefer — see above)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vimalgovind143/cv.git
   cd cv
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Customise your CV** — edit
   [`src/data/resume-data.tsx`](./src/data/resume-data.tsx) to change personal
   info, work experience, education, skills, and projects. Types are in
   `src/types/resume.ts`.

### Available Scripts

```bash
npm run dev          # Start the Next.js dev server
npm run build        # Build the static site → ./out
npm run start        # Serve the static export (npx serve@latest out)
npm run preview      # Build then serve
npm run lint         # ESLint
npm run type-check   # TypeScript --noEmit
npm run format       # Prettier --write .
npm run deploy       # Build then wrangler pages deploy out
```

## 📁 Project Structure

```
src/
├── app/                          # App Router routes
│   ├── layout.tsx                # Root layout: fonts, theme, nav, analytics
│   ├── page.tsx                  # Landing page (hero, stats, projects, posts)
│   ├── about/page.tsx            # Full CV (work, skills, education, export)
│   ├── projects/page.tsx         # Project listing
│   ├── blog/
│   │   ├── page.tsx              # Blog index with tag filtering
│   │   └── [slug]/page.tsx       # Static-generated post pages
│   ├── feed.xml/                 # RSS feed
│   ├── sitemap.ts                # Auto-generated sitemap
│   ├── opengraph-image.tsx       # OG image generator
│   ├── loading.tsx               # Loading UI
│   └── globals.css               # Tailwind 4 entry + print styles + tokens
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   │                             #   avatar, badge, button, card,
│   │                             #   command, dialog, drawer, section
│   ├── blog/                     # ArticleCard, BlogClient, GitHubRepoCard,
│   │                             #   MarkdownRenderer, TagFilter
│   ├── icons/                    # GitHubIcon, LinkedInIcon, XIcon, IGIcon
│   ├── Navigation.tsx            # Top nav + theme toggle
│   ├── command-menu.tsx          # Cmd/Ctrl+J palette (cmdk)
│   ├── print-drawer.tsx          # Print-friendly CV drawer
│   ├── ResumeExportButton.tsx    # Opens print drawer → window.print()
│   ├── CopyEmailButton.tsx       # Copy-to-clipboard email
│   ├── CvChatAssistant.tsx       # Floating CV chatbot (Workers AI)
│   ├── TerminalWindow.tsx        # Reusable terminal-styled card
│   ├── BackgroundAnimation.tsx
│   ├── PointerTechTrail.tsx
│   ├── ThemeProvider.tsx / ThemeToggle.tsx
│   ├── avatar.tsx
│   └── error-boundary.tsx, section-error-boundary.tsx, section-skeleton.tsx
├── content/
│   └── blog/                     # 23 Markdown posts with frontmatter
├── data/
│   └── resume-data.tsx           # ALL CV content (single source of truth)
├── lib/
│   ├── blog.ts                   # Markdown loading, reading time, tag filtering
│   ├── cv-knowledge.ts           # Knowledge base for CvChatAssistant
│   ├── structured-data.ts        # JSON-LD (Person, etc.) generators
│   └── utils.ts                  # `cn()` helper (clsx + tailwind-merge)
├── types/
│   └── resume.ts                 # ResumeData, WorkExperience, Project, …
└── images/
    └── logos/                    # Company logo components (Amthal, MV, BIM, …)
```

## 🎨 Customisation

### Resume data

All CV content is in one file:

```typescript
// src/data/resume-data.tsx
export const RESUME_DATA = {
  name: 'Your Name',
  initials: 'YN',
  location: 'Your City, Country',
  about: 'Brief description',
  summary: 'Professional summary',
  contact: { email: '…', social: [...] },
  education: [...],
  work: [...],
  skills: [...],
  projects: [...],
} as const;
```

The layout reads from this object, so adding new fields is safe — just extend
the type in `src/types/resume.ts`.

### Adding blog posts

Create a new Markdown file in `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2026-04-17"
tags: [".NET", "Architecture"]
excerpt: "Brief description for the listing page"
---

# Your Post Title

Content here...
```

Posts are picked up at build time by `getAllPosts()` in `src/lib/blog.ts`. Each
post's `<h1>` is automatically demoted to `<h2>` so the page's own `<h1>` stays
unique.

### Chat assistant knowledge

The `CvChatAssistant` answers from a curated knowledge base in
`src/lib/cv-knowledge.ts`. Edit those entries to change what the assistant
knows. When Cloudflare's AI quota is exhausted, the assistant falls back to a
contact-email CTA — see `CV_AI_QUOTA_MESSAGE` and `CV_OUT_OF_SCOPE_MESSAGE`.

### Styling

Tailwind 4 with `@theme` tokens in `src/app/globals.css`:

- **Colours**: neon green (`#00FF00`), neon blue (`#00D7FF`), terminal
  background (`#1e1e1e`)
- **Fonts**: JetBrains Mono (body/code), Inter (headings) — loaded via
  `next/font/google`
- **Print**: `@media print` block tunes page breaks, colours, and margins for
  the print drawer

## 🚢 Deployment

### Cloudflare Pages (primary)

```bash
npm run deploy
```

This runs `next build && wrangler pages deploy out`. The `[ai]` binding in
`wrangler.toml` exposes Cloudflare Workers AI to `CvChatAssistant` at runtime.

The static `./out` directory can be hosted anywhere — Vercel, Netlify, GitHub
Pages, Nginx, etc. `next.config.js` sets `images.unoptimized = true` because
`output: 'export'` does not support Next's image optimiser.

### Docker

```bash
docker compose build     # Build the container (uses pnpm@8 internally)
docker compose up -d     # Run the container
docker compose down      # Stop the container
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE)
file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/vimalgovind143">Vimal Govind Markkasseri</a>
</p>
