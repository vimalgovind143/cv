import Link from 'next/link';
import { PostMeta } from '@/lib/blog';
import { Calendar, Tag, Clock } from 'lucide-react';

interface ArticleCardProps {
  post: PostMeta;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="border-border/80 bg-card/75 hover:border-neon-green/50 hover:bg-card motion-safe:group-hover:-translate-y-1 flex h-full min-h-72 flex-col rounded-lg border p-6 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-black/5">
        <div className="text-muted-foreground mb-3 flex items-center gap-4 text-sm">
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
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        <h3 className="font-heading text-foreground group-hover:text-neon-green mb-3 text-lg font-semibold transition-colors md:text-xl">
          {post.title}
        </h3>

        <p className="text-muted-foreground mb-5 line-clamp-4 flex-1 text-sm leading-6">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded px-2 py-1 font-mono text-xs"
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
