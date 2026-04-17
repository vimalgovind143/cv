# Transform CV to Personal Developer Blog

## Overview
Transform the existing CV/resume site into a programmer-focused personal blog while keeping resume data. The new design will feature a dark theme with fluorescent accents, monospaced fonts, markdown rendering, syntax highlighting, and organized article management.

## Implementation Plan

### Task 1: Update Theme & Color Scheme
**Files to modify:**
- [tailwind.config.js](file:///d:/GitHub/CV/cv/tailwind.config.js) - Add new color variables
- [src/app/globals.css](file:///d:/GitHub/CV/cv/src/app/globals.css) - Update CSS variables

**Changes:**
- Update color scheme to match requirements:
  - Background: `#1e1e1e` (dark gray)
  - Text: `#e6e6e6` (bright text)
  - Accent 1: `#00FF00` (fluorescent green)
  - Accent 2: `#00D7FF` (fluorescent blue)
- Add new Tailwind color utilities: `terminal-bg`, `code-text`, `neon-green`, `neon-blue`
- Update dark mode variables to use the new scheme
- Keep light mode but adjust to match the aesthetic

### Task 2: Update Typography & Fonts
**Files to modify:**
- [src/app/layout.tsx](file:///d:/GitHub/CV/cv/src/app/layout.tsx) - Add new font imports
- [tailwind.config.js](file:///d:/GitHub/CV/cv/tailwind.config.js) - Configure font families

**Changes:**
- Import modern sans-serif font for titles (e.g., `Inter` or `JetBrains Sans`)
- Import monospaced font for code/text (e.g., `Fira Code`, `JetBrains Mono`, or `Source Code Pro`)
- Configure Tailwind font families:
  - `font-heading`: Modern sans-serif
  - `font-body`: Monospaced font
  - `font-code`: Monospaced font for code blocks
- Update body class to use monospaced font by default

### Task 3: Install Required Dependencies
**Command to run:**
```bash
npm install gray-matter remark remark-html rehype-highlight highlight.js
npm install -D @types/highlight.js
```

**Purpose:**
- `gray-matter`: Parse frontmatter from markdown files
- `remark` + `remark-html`: Convert markdown to HTML
- `rehype-highlight` + `highlight.js`: Syntax highlighting for code blocks

### Task 4: Create Blog Data Structure
**New directory:** `src/content/blog/`

**Create sample markdown files:**
- `src/content/blog/hello-world.md`
- `src/content/blog/understanding-react-hooks.md`
- `src/content/blog/nodejs-best-practices.md`

**Markdown frontmatter structure:**
```markdown
---
title: "Article Title"
date: "2026-04-17"
tags: ["Front End", "React", "TypeScript"]
excerpt: "Brief description of the article"
coverImage: "/images/covers/article-1.jpg" (optional)
---

Article content with code blocks...
```

### Task 5: Create Blog Utility Functions
**New file:** `src/lib/blog.ts`

**Functions to implement:**
- `getAllPosts()`: Read and parse all markdown files from `src/content/blog/`
- `getPostBySlug(slug: string)`: Get single post by filename
- `getAllTags()`: Extract unique tags from all posts
- `getPostsByTag(tag: string)`: Filter posts by tag
- Sort posts by date (newest first)

### Task 6: Create Blog Components
**New files:**

1. `src/components/blog/CodeBlock.tsx`
   - Custom code block component with syntax highlighting
   - Copy to clipboard functionality
   - Language label display
   - Styled with neon green/blue accents

2. `src/components/blog/MarkdownRenderer.tsx`
   - Render markdown content to HTML
   - Apply syntax highlighting to code blocks
   - Style headings, links, lists, etc. with new theme

3. `src/components/blog/TagFilter.tsx`
   - Tag navigation component
   - Filter articles by: Front End / Back End / Tools
   - Highlighted active tag with neon accent

4. `src/components/blog/ArticleCard.tsx`
   - Article preview card
   - Display: title, date, tags, excerpt
   - Terminal/code editor aesthetic
   - Hover effects with neon glow

5. `src/components/blog/GitHubRepoCard.tsx`
   - GitHub repository card component
   - Display: repo name, description, stars, forks, language
   - Link to GitHub repository
   - Styled with code editor theme

### Task 7: Create Blog Pages

1. **Blog List Page:** `src/app/blog/page.tsx`
   - Display all articles in grid/list view
   - Tag filtering system (Front End / Back End / Tools)
   - Search functionality
   - Article cards with metadata
   - Pagination (if needed)

2. **Blog Post Page:** `src/app/blog/[slug]/page.tsx`
   - Dynamic route for individual articles
   - Markdown rendering with syntax highlighting
   - Table of contents (optional)
   - Previous/Next article navigation
   - Tags and date display
   - Reading time estimate

3. **Update Main Page:** `src/app/page.tsx`
   - Keep existing resume sections
   - Add hero section with:
     - Avatar
     - Introduction/bio
     - Social links (GitHub, LinkedIn, X, etc.)
     - Terminal-style animation or typing effect
   - Add "Latest Articles" section showing 3 recent blog posts
   - Add navigation to full blog page

### Task 8: Update Navigation & Layout
**Files to modify:**
- [src/app/layout.tsx](file:///d:/GitHub/CV/cv/src/app/layout.tsx)
- Create `src/components/Navigation.tsx`

**Changes:**
- Add navigation bar with links: Home, Blog, Projects, About
- Responsive mobile menu
- Active page highlighting
- Terminal/geek aesthetic with monospaced font
- Update CommandMenu to include blog navigation

### Task 9: Create About Page
**New file:** `src/app/about/page.tsx`

**Content sections:**
- Technology Stack (with icons/badges)
- Work Experience (reuse existing resume data)
- Education (reuse existing resume data)
- Contact Information (email, social links)
- GitHub stats/contributions (optional)
- Styled with new dark theme

### Task 10: Update Existing Components
**Files to modify:**
- [src/app/components/Header.tsx](file:///d:/GitHub/CV/cv/src/app/components/Header.tsx) - Update styling
- [src/app/components/Projects.tsx](file:///d:/GitHub/CV/cv/src/app/components/Projects.tsx) - Add GitHub repo cards
- [src/app/components/Skills.tsx](file:///d:/GitHub/CV/cv/src/app/components/Skills.tsx) - Update with new theme
- All other component files - Apply new color scheme and typography

**Changes:**
- Replace warm paper theme colors with dark terminal theme
- Update borders, shadows, and backgrounds
- Add neon accent highlights to key elements
- Ensure code snippets use monospaced font
- Update hover states with neon glow effects

### Task 11: Add Visual Elements
**New files:**

1. `src/components/TerminalAnimation.tsx`
   - Animated terminal window on homepage
   - Typing effect with code snippets
   - Blinking cursor animation
   - Dark theme with syntax highlighting

2. Update `src/components/BackgroundAnimation.tsx`
   - Subtle code-related background pattern
   - Matrix-style rain effect (optional, subtle)
   - Geometric shapes or circuit board patterns
   - Keep it minimalist and professional

### Task 12: Update Metadata & SEO
**Files to modify:**
- [src/app/layout.tsx](file:///d:/GitHub/CV/cv/src/app/layout.tsx)
- [src/app/page.tsx](file:///d:/GitHub/CV/cv/src/app/page.tsx)
- New: `src/app/blog/layout.tsx`
- New: `src/app/about/layout.tsx`

**Changes:**
- Update site title, description, keywords
- Add Open Graph tags for blog posts
- Update Twitter card metadata
- Add structured data for articles (BlogPosting schema)
- Update robots.txt and sitemap to include blog routes

### Task 13: Add Blog-Specific Styles
**File to modify:** [src/app/globals.css](file:///d:/GitHub/CV/cv/src/app/globals.css)

**Add:**
- Code block styling with dark background
- Syntax highlighting color overrides
- Terminal window component styles
- Neon glow effects for hover states
- Custom scrollbar styling
- Selection highlight colors
- Print styles for articles

### Task 14: Testing & Verification
**Verification steps:**
1. Run `npm run dev` and verify:
   - Homepage displays avatar, intro, social links, latest articles
   - Blog page shows all articles with tag filtering
   - Individual blog posts render correctly with syntax highlighting
   - About page displays tech stack and contact info
   - Navigation works correctly
   - Dark theme applied throughout
   - Monospaced fonts used for body text
   - Code blocks properly highlighted
2. Test responsive design on mobile/tablet/desktop
3. Verify all links and social icons work
4. Check that existing resume data is preserved and styled correctly

## Technical Notes

- **Next.js Version:** 16.x (already in use) - supports App Router
- **Static Site Generation:** Blog posts will be pre-rendered at build time using `generateStaticParams`
- **Markdown Processing:** Server-side processing for better performance
- **Code Highlighting:** Using highlight.js with a custom dark theme
- **No Database:** All content stored as markdown files in the repository
- **Preserve Existing Features:** Command menu, theme toggle, analytics, error boundaries

## File Structure After Implementation

```
src/
├── app/
│   ├── page.tsx (updated - homepage with blog section)
│   ├── layout.tsx (updated - new theme)
│   ├── globals.css (updated - new colors/fonts)
│   ├── blog/
│   │   ├── page.tsx (new - blog list)
│   │   ├── layout.tsx (new - blog layout)
│   │   └── [slug]/
│   │       └── page.tsx (new - individual post)
│   ├── about/
│   │   ├── page.tsx (new - about page)
│   │   └── layout.tsx (new - about layout)
│   └── components/ (existing components, updated styling)
├── components/
│   ├── blog/ (new - blog-specific components)
│   │   ├── CodeBlock.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   ├── TagFilter.tsx
│   │   ├── ArticleCard.tsx
│   │   └── GitHubRepoCard.tsx
│   └── ... (existing components)
├── content/
│   └── blog/ (new - markdown files)
│       ├── hello-world.md
│       └── ... (more articles)
├── lib/
│   ├── blog.ts (new - blog utilities)
│   └── ... (existing utilities)
└── data/
    └── resume-data.tsx (preserved)
```
