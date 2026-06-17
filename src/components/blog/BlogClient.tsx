'use client';

import { useState } from 'react';
import { TagFilter } from './TagFilter';
import { ArticleCard } from './ArticleCard';
import { Reveal } from '@/components/motion';
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
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="search"
          placeholder="Search articles…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-border/80 bg-card/75 text-foreground placeholder:text-muted-foreground focus:border-neon-green/60 w-full rounded-lg border py-3 pr-4 pl-9 text-sm focus:outline-none"
        />
      </div>

      <div className="mb-10">
        <TagFilter tags={tags} onTagChange={setActiveTag} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, index) => (
            <Reveal key={post.slug} delay={Math.min(index, 8) * 0.06} className="h-full">
              <ArticleCard post={post} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground font-mono">No articles found.</p>
      )}
    </>
  );
}
