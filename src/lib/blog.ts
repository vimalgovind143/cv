import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import highlight from 'rehype-highlight';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

/**
 * Estimate reading time in minutes based on word count (200 WPM).
 */
function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Demote all <h1> tags to <h2> so the page's own <h1> title stays unique.
 */
function demoteH1(html: string): string {
  return html.replace(/<h1(\s[^>]*)?>/g, '<h2$1>').replace(/<\/h1>/g, '</h2>');
}

/**
 * Get all posts metadata sorted by date (newest first)
 */
export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      
      return {
        slug,
        title: matterResult.data.title || slug,
        date: matterResult.data.date || '',
        tags: matterResult.data.tags || [],
        excerpt: matterResult.data.excerpt || '',
        readingTime: calculateReadingTime(matterResult.content),
      };
    });
  
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Get single post by slug with full content
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  // Convert markdown to HTML with syntax highlighting
  const processedContent = await remark()
    .use(html, { allowDangerousHtml: true })
    .use(highlight)
    .process(matterResult.content);
  
  const contentHtml = demoteH1(processedContent.toString());
  
  return {
    slug,
    title: matterResult.data.title || slug,
    date: matterResult.data.date || '',
    tags: matterResult.data.tags || [],
    excerpt: matterResult.data.excerpt || '',
    readingTime: calculateReadingTime(matterResult.content),
    contentHtml,
  };
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagsSet = new Set<string>();
  
  posts.forEach((post) => {
    post.tags.forEach((tag) => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Get posts filtered by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

/**
 * Get recent posts (for homepage)
 */
export function getRecentPosts(limit: number = 3): PostMeta[] {
  const posts = getAllPosts();
  return posts.slice(0, limit);
}

/**
 * Get all slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

/**
 * Get related posts based on shared tags, excluding the current post.
 */
export function getRelatedPosts(currentSlug: string, tags: string[], limit: number = 3): PostMeta[] {
  const posts = getAllPosts();
  return posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({ post: p, common: p.tags.filter((t) => tags.includes(t)).length }))
    .filter(({ common }) => common > 0)
    .sort((a, b) => b.common - a.common)
    .slice(0, limit)
    .map(({ post }) => post);
}
