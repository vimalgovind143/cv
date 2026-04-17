![cv](https://github.com/user-attachments/assets/5fcf8a2b-8d07-4822-a61f-b7a36d71d08b)

# Vimal Govind Markkasseri - Developer CV & Blog

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A terminal-inspired developer portfolio featuring a minimalist CV with an integrated technical blog. Built for .NET backend engineers who appreciate clean, focused design.

## ✨ Features

- 📝 **Single Config File** - Update all your resume data in [one place](./src/data/resume-data.tsx)
- 🎨 **Terminal Aesthetic** - Dark theme with neon accents and monospaced fonts
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🖨️ **Print Optimized** - Clean print styles for physical copies
- ⌨️ **Keyboard Navigation** - Press `Cmd/Ctrl + K` for quick navigation
- 🚀 **Fast Performance** - Built with Next.js 16 and optimized for Core Web Vitals
- 📝 **Technical Blog** - Markdown-based articles with syntax highlighting
- 🏷️ **Tag Filtering** - Filter blog posts by technology tags
- 🔍 **SEO Optimized** - Comprehensive metadata and Open Graph support
- 🌐 **CI/CD Pipeline** - Automated builds and Cloudflare Pages deployment

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 6.0](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.1](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Markdown**: [gray-matter](https://github.com/jonschlinkert/gray-matter) + [remark/rehype](https://github.com/remarkjs/remark)
- **Syntax Highlighting**: [highlight.js](https://highlightjs.org/)
- **Package Manager**: [npm](https://www.npmjs.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

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

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

5. **Customize your CV**
   
   Edit the [src/data/resume-data.tsx](./src/data/resume-data.tsx) file to add your personal information, work experience, education, and skills.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx         # Root layout with metadata & navigation
│   ├── page.tsx           # Home page with hero & CV summary
│   ├── about/
│   │   └── page.tsx       # Detailed CV page
│   └── blog/
│       ├── page.tsx       # Blog listing with tag filtering
│       └── [slug]/
│           └── page.tsx   # Individual blog post
├── components/
│   ├── blog/              # Blog-specific components
│   │   ├── ArticleCard.tsx
│   │   ├── BlogClient.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   └── TagFilter.tsx
│   ├── ui/                # shadcn/ui components
│   └── Navigation.tsx     # Main navigation
├── content/
│   └── blog/              # Markdown blog posts
├── data/
│   └── resume-data.tsx    # Resume/CV configuration
└── lib/
    └── blog.ts            # Blog utilities
```

## 🎨 Customization

### Resume Data

All resume content is stored in a single configuration file:

```typescript
// src/data/resume-data.tsx
export const RESUME_DATA = {
  name: "Your Name",
  initials: "YN",
  location: "Your City, Country",
  about: "Brief description",
  summary: "Professional summary",
  // ... more fields
}
```

### Adding Blog Posts

Create a new markdown file in `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
date: "2026-04-17"
tags: [".NET", "Architecture"]
excerpt: "Brief description for listing page"
---

# Your Post Title

Content here...
```

### Styling

The app uses Tailwind CSS with custom design tokens:
- **Colors**: Neon green (#00FF00), Neon blue (#00D7FF), Terminal background (#1e1e1e)
- **Fonts**: JetBrains Mono (body/code), Inter (headings)
- Global styles in `src/app/globals.css`

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/vimalgovind143">Vimal Govind Markkasseri</a>
</p>
