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
}

export interface Post extends PostMeta {
  contentHtml: string;
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
  
  const contentHtml = processedContent.toString();
  
  return {
    slug,
    title: matterResult.data.title || slug,
    date: matterResult.data.date || '',
    tags: matterResult.data.tags || [],
    excerpt: matterResult.data.excerpt || '',
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
