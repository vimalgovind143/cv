'use client';

import { useState } from 'react';
import { TagFilter } from './TagFilter';
import { ArticleCard } from './ArticleCard';
import type { PostMeta } from '@/lib/blog';

interface BlogClientProps {
  posts: PostMeta[];
  tags: string[];
}

export function BlogClient({ posts, tags }: BlogClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  return (
    <>
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
        <p className="font-mono text-muted-foreground">No articles found for this tag.</p>
      )}
    </>
  );
}
