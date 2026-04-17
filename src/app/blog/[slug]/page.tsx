import { getAllPostSlugs, getPostBySlug } from '@/lib/blog';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { TerminalWindow } from '@/components/TerminalWindow';
import { Calendar, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: `${post.title} - Mr Vimal Govind Markkasseri`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPostSlugs();
  const currentIndex = allPosts.indexOf(slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Breadcrumb */}
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-neon-green"
      >
        <ArrowLeft className="h-4 w-4" />
        ~/blog
      </Link>

      {/* Header Terminal */}
      <TerminalWindow title={`${slug}.md`} className="mb-10">
        <div className="space-y-1">
          <p>
            <span className="text-neon-blue">title</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-yellow-300">&quot;{post.title}&quot;</span>
          </p>
          <p>
            <span className="text-neon-blue">date</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-neon-green">{post.date}</span>
          </p>
          <p>
            <span className="text-neon-blue">tags</span>
            <span className="text-muted-foreground">: [</span>
            {post.tags.map((tag, i) => (
              <span key={tag}>
                <span className="text-yellow-300">&quot;{tag}&quot;</span>
                {i < post.tags.length - 1 && <span className="text-muted-foreground">, </span>}
              </span>
            ))}
            <span className="text-muted-foreground">]</span>
          </p>
        </div>
      </TerminalWindow>

      {/* Title */}
      <h1 className="mb-10 font-heading text-3xl font-bold text-foreground md:text-4xl">
        {post.title}
      </h1>

      {/* Content */}
      <div className="mb-16">
        <MarkdownRenderer content={post.contentHtml} />
      </div>

      {/* Navigation */}
      {(prevPost || nextPost) && (
        <nav className="flex items-center justify-between border-t border-border pt-8">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost}`}
              className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-neon-green"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Link>
          ) : (
            <div />
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost}`}
              className="flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-neon-green"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
