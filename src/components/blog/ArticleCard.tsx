import Link from 'next/link';
import { PostMeta } from '@/lib/blog';
import { Calendar, Tag } from 'lucide-react';

interface ArticleCardProps {
  post: PostMeta;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(0,255,0,0.1)]">
        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>
        
        <h3 className="mb-2 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-neon-green md:text-xl">
          {post.title}
        </h3>
        
        <p className="mb-4 font-body text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
