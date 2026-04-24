import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { generateBlogPostStructuredData } from '@/lib/structured-data';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { TerminalWindow } from '@/components/TerminalWindow';
import { Calendar, Tag, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const BASE_URL = 'https://hellovg.win';

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
    keywords: [
      ...post.tags,
      'software engineering',
      '.NET',
      'full stack',
      'Mr Vimal Govind Markkasseri',
    ],
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
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
  const relatedPosts = getRelatedPosts(slug, post.tags, 3);

  const jsonLd = generateBlogPostStructuredData({
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    slug,
    tags: post.tags,
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <span className="text-neon-blue">readingTime</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-neon-green">{post.readingTime} min read</span>
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

      {/* Title — sole H1 on the page */}
      <h1 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="mb-10 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {post.readingTime} min read
        </span>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 font-mono text-xs"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mb-16">
        <MarkdownRenderer content={post.contentHtml} />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mb-16 border-t border-border pt-12">
          <h2 className="mb-6 font-heading text-xl font-semibold text-foreground">
            You might also like
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="group block">
                <div className="h-full rounded-lg border border-border bg-card p-4 transition-all hover:border-neon-green/50">
                  <p className="mb-1 font-mono text-xs text-muted-foreground">{related.date}</p>
                  <h3 className="mb-2 font-heading text-sm font-semibold text-foreground transition-colors group-hover:text-neon-green">
                    {related.title}
                  </h3>
                  <span className="font-mono text-xs text-neon-blue">
                    {related.readingTime} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Prev/Next Navigation */}
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
