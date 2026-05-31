import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogClient } from '@/components/blog/BlogClient';
import { TerminalWindow } from '@/components/TerminalWindow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Mr Vimal Govind Markkasseri',
  description:
    'Articles about software engineering, system architecture, web development, and emerging technologies.',
  keywords: [
    '.NET Core',
    'C#',
    'SQL Server',
    'software architecture',
    'clean architecture',
    'enterprise software',
    'ERP',
    'Azure',
    'React',
    'TypeScript',
    'technical blog',
    'Mr Vimal Govind Markkasseri',
  ],
  alternates: {
    canonical: 'https://hellovg.win/blog',
  },
};

export default function BlogPage() {
  const allTags = getAllTags();
  const allPosts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-neon-green mb-2 font-mono text-sm">~/blog</p>
        <h1 className="font-heading text-foreground mb-4 max-w-3xl text-4xl font-semibold md:text-5xl">
          Notes on software engineering, architecture, and practical AI.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-8">
          Field notes from building and modernizing enterprise systems with .NET, SQL Server, web
          platforms, and AI-assisted workflows.
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
          <p className="text-muted-foreground mt-2">No articles yet. Check back soon!</p>
        </TerminalWindow>
      )}
    </div>
  );
}
