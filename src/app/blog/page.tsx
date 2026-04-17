import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogClient } from '@/components/blog/BlogClient';
import { TerminalWindow } from '@/components/TerminalWindow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Mr Vimal Govind Markkasseri',
  description: 'Articles about software engineering, system architecture, web development, and emerging technologies.',
};

export default function BlogPage() {
  const allTags = getAllTags();
  const allPosts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="mb-2 font-mono text-sm text-neon-green">~/blog</p>
        <h1 className="mb-3 font-heading text-4xl font-bold text-foreground md:text-5xl">
          Articles
        </h1>
        <p className="font-mono text-muted-foreground">
          Thoughts on software engineering, architecture, and technology
        </p>
      </div>

      {/* Posts Grid */}
      {allPosts.length > 0 ? (
        <BlogClient posts={allPosts} tags={allTags} />
      ) : (
        <TerminalWindow title="articles.log">
          <p className="text-muted-foreground">
            <span className="text-neon-green">vg@dev ~$ </span>
            ls articles/
          </p>
          <p className="mt-2 text-muted-foreground">No articles yet. Check back soon!</p>
        </TerminalWindow>
      )}
    </div>
  );
}
