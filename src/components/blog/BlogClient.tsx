'use client';

import { useState } from 'react';
import { TagFilter } from './TagFilter';
import { ArticleCard } from './ArticleCard';
import type { PostMeta } from '@/lib/blog';
import { Search } from 'lucide-react';

interface BlogClientProps {
  posts: PostMeta[];
  tags: string[];
}

export function BlogClient({ posts, tags }: BlogClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = posts.filter((p) => {
    const matchesTag = activeTag ? p.tags.includes(activeTag) : true;
    const q = query.toLowerCase();
    const matchesSearch =
      q === '' ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  });

  return (
    <>
      {/* Search input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-neon-green/60 focus:outline-none"
        />
      </div>

      <div className="mb-10">
        <TagFilter tags={tags} onTagChange={setActiveTag} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="font-mono text-muted-foreground">No articles found.</p>
      )}
    </>
  );
}
