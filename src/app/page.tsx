import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Rss, ArrowRight } from 'lucide-react';
import { RESUME_DATA } from '@/data/resume-data';
import { GitHubIcon, LinkedInIcon, XIcon, IGIcon } from '@/components/icons';
import { TerminalWindow } from '@/components/TerminalWindow';
import { getRecentPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} - .NET Backend & SQL Engineer`,
  description: RESUME_DATA.about,
};

const techStack = ['.NET Core', 'C#', 'SQL Server', 'EF Core', 'REST API', 'Docker', 'Azure'];

const stats = [
  { value: '16+', label: 'years exp' },
  { value: '30+', label: 'projects' },
  { value: '9+', label: 'articles' },
];

export default function HomePage() {
  const recentPosts = getRecentPosts(3);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* ─── Hero: Two-Column Layout ─── */}
      <section className="mb-24 flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-20">
        {/* Left Column */}
        <div className="flex-1">
          {/* Terminal Window */}
          <TerminalWindow title="welcome.sh" className="mb-10">
            <div className="space-y-1">
              <p>
                <span className="text-muted-foreground"># welcome.sh</span>
              </p>
              <p>
                <span className="text-neon-green">vg@dev</span>
                <span className="text-muted-foreground"> ~$ </span>
                <span className="text-foreground">cat intro.md</span>
              </p>
              <br />
              <p>
                <span className="text-purple-400">const </span>
                <span className="text-foreground">developer </span>
                <span className="text-muted-foreground">= {'{'}</span>
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">name</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-yellow-300">&quot;{RESUME_DATA.name}&quot;</span>
                <span className="text-muted-foreground">,</span>
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">role</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-yellow-300">&quot;Senior .NET Backend Engineer&quot;</span>
                <span className="text-muted-foreground">,</span>
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">location</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-yellow-300">&quot;{RESUME_DATA.location}&quot;</span>
                <span className="text-muted-foreground">,</span>
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">passion</span>
                <span className="text-muted-foreground">: [</span>
                <span className="text-yellow-300">&quot;.NET Core&quot;</span>
                <span className="text-muted-foreground">, </span>
                <span className="text-yellow-300">&quot;SQL Server&quot;</span>
                <span className="text-muted-foreground">, </span>
                <span className="text-yellow-300">&quot;Clean Architecture&quot;</span>
                <span className="text-muted-foreground">],</span>
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">status</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-yellow-300">&quot;Building enterprise APIs&quot;</span>
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-neon-green align-middle" />
              </p>
              <p>
                <span className="text-muted-foreground">{'}'}</span>
                <span className="text-muted-foreground">;</span>
              </p>
              <br />
              <p>
                <span className="text-neon-green">vg@dev</span>
                <span className="text-muted-foreground"> ~$ </span>
                <span className="animate-pulse text-neon-green">▎</span>
              </p>
            </div>
          </TerminalWindow>

          {/* Greeting */}
          <h1 className="mb-3 font-heading text-5xl font-bold text-foreground md:text-6xl">
            Hello, I&apos;m
          </h1>
          <h2 className="mb-6 font-heading text-5xl font-bold text-neon-green md:text-6xl">
            Vimal Govind
          </h2>

          {/* Description */}
          <p className="mb-8 max-w-lg font-body text-muted-foreground leading-relaxed">
            Backend engineer specializing in{' '}
            <span className="text-neon-green">.NET Core APIs</span>,{' '}
            <span className="text-neon-blue">SQL Server</span>, and enterprise ERP systems.
            16+ years delivering scalable, maintainable software in the Middle East.
          </p>

          {/* Social + CTA */}
          <div className="flex flex-wrap items-center gap-3">
            {RESUME_DATA.contact.social.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-neon-green/60 hover:text-neon-green"
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
            <a
              href={`mailto:${RESUME_DATA.contact.email}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-neon-green/60 hover:text-neon-green"
            >
              <Mail className="h-5 w-5" />
            </a>
            <Link
              href="/blog"
              className="ml-2 font-mono text-sm text-neon-blue transition-colors hover:text-neon-green"
            >
              read blog →
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-80 xl:w-96">
          {/* Photo + Badge */}
          <div className="relative mb-6">
            <div className="relative overflow-hidden rounded-xl border border-border">
              <img
                src={RESUME_DATA.avatarUrl}
                alt={RESUME_DATA.name}
                className="h-72 w-full object-cover grayscale"
              />
              {/* Code badge */}
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded border border-neon-green bg-background/90 px-2 py-1">
                <span className="font-mono text-xs font-bold text-neon-green">{'</>'}</span>
              </div>
            </div>
            {/* Version badge */}
            <div className="mt-3 inline-block rounded border border-neon-blue/60 px-3 py-1">
              <span className="font-mono text-xs text-neon-blue">v16.0</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-card p-4 text-center"
              >
                <div
                  className={`font-heading text-2xl font-bold ${
                    i === 0 ? 'text-foreground' : i === 1 ? 'text-neon-blue' : 'text-yellow-400'
                  }`}
                >
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">stack:</span>
            {techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs text-foreground/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Recent Activity Log ─── */}
      {recentPosts.length > 0 && (
        <section className="mb-16">
          <TerminalWindow title="recent-activity.log">
            <div className="space-y-2">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex flex-wrap items-center gap-2 group transition-colors hover:bg-muted/20 -mx-2 px-2 py-1 rounded"
                >
                  <span className="text-muted-foreground text-xs">[{post.date}]</span>
                  <span className="rounded border border-neon-green/40 bg-neon-green/10 px-2 py-0.5 text-xs font-bold text-neon-green">
                    PUBLISHED
                  </span>
                  <span className="text-foreground/80 group-hover:text-neon-blue transition-colors">
                    {post.title}
                  </span>
                  <span className="ml-auto hidden font-mono text-xs text-muted-foreground md:block">
                    {post.tags.join(', ')}
                  </span>
                </Link>
              ))}
              <div className="pt-2">
                <Link
                  href="/blog"
                  className="flex items-center gap-2 font-mono text-xs text-neon-green hover:underline"
                >
                  <ArrowRight className="h-3 w-3" />
                  view all articles
                </Link>
              </div>
            </div>
          </TerminalWindow>
        </section>
      )}
    </div>
  );
}
