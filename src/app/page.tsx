import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, ExternalLink, Mail, MapPin, Newspaper } from 'lucide-react';
import { RESUME_DATA } from '@/data/resume-data';
import { TerminalWindow } from '@/components/TerminalWindow';
import { Reveal } from '@/components/motion';
import { getRecentPosts } from '@/lib/blog';
import { generatePersonStructuredData } from '@/lib/structured-data';
import { CopyEmailButton } from '@/components/CopyEmailButton';

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} - .NET Backend & SQL Engineer`,
  description: RESUME_DATA.about,
  keywords: [
    '.NET Core',
    'C#',
    'SQL Server',
    'Entity Framework',
    'ASP.NET',
    'senior software engineer',
    'full stack developer',
    'Bahrain',
    'ERP systems',
    RESUME_DATA.name,
  ],
  alternates: {
    canonical: 'https://hellovg.win',
  },
};

const techStack = [
  '.NET Core',
  'C#',
  'SQL Server',
  'EF Core',
  'Azure',
  'Semantic Kernel',
  'Azure OpenAI',
];

const stats = [
  { value: '16+', label: 'years engineering enterprise systems' },
  { value: '30+', label: 'projects shipped across ERP domains' },
  { value: '9+', label: 'technical articles and notes' },
];

const featuredProjects = RESUME_DATA.projects.slice(0, 3);

export default function HomePage() {
  const recentPosts = getRecentPosts(3);

  const jsonLd = generatePersonStructuredData();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: structured data
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mb-20 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div>
          <Reveal
            as="div"
            immediate
            className="border-neon-green/30 bg-neon-green/10 text-neon-green mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs"
          >
            <span className="bg-neon-green h-1.5 w-1.5 rounded-full" />
            Available for enterprise backend and modernization work
          </Reveal>
          <Reveal
            as="h1"
            immediate
            delay={0.06}
            className="font-heading text-foreground max-w-3xl text-4xl font-semibold tracking-normal md:text-6xl"
          >
            Senior full stack engineer building reliable ERP and business systems.
          </Reveal>
          <Reveal
            as="p"
            immediate
            delay={0.12}
            className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8"
          >
            I help teams modernize legacy platforms, design maintainable .NET services, and keep
            SQL-heavy enterprise applications fast, observable, and supportable.
          </Reveal>
          <Reveal
            as="div"
            immediate
            delay={0.18}
            className="text-muted-foreground mt-5 flex flex-wrap items-center gap-3 text-sm"
          >
            <span className="inline-flex items-center gap-2">
              <MapPin className="text-neon-green h-4 w-4" />
              {RESUME_DATA.location}
            </span>
            <span className="bg-muted-foreground/50 hidden h-1 w-1 rounded-full sm:block" />
            <span>{techStack.join(' / ')}</span>
          </Reveal>

          <Reveal as="div" immediate delay={0.24} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${RESUME_DATA.contact.email}`}
              className="bg-neon-green hover:bg-neon-green/85 inline-flex h-11 items-center gap-2 rounded-lg px-5 font-mono text-sm font-semibold text-[#0b1118] transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact me
            </a>
            <Link
              href="/projects"
              className="border-border bg-card/70 text-foreground hover:border-neon-blue/60 hover:text-neon-blue inline-flex h-11 items-center gap-2 rounded-lg border px-5 font-mono text-sm transition-colors"
            >
              View projects
              <ArrowRight className="h-4 w-4" />
            </Link>
            <CopyEmailButton email={RESUME_DATA.contact.email} />
          </Reveal>

          <Reveal as="div" immediate delay={0.3} className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="border-border/80 bg-card/70 rounded-lg border p-4">
                <div className="font-heading text-foreground text-2xl font-semibold">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1 text-sm leading-5">{stat.label}</div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal as="aside" immediate delay={0.2} className="space-y-5">
          <div className="border-border/80 bg-card/80 relative overflow-hidden rounded-lg border p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
            <div className="border-border/70 relative overflow-hidden rounded-md border">
              <img
                src={RESUME_DATA.avatarUrl}
                alt={RESUME_DATA.name}
                className="h-72 w-full object-cover grayscale"
              />
            </div>
            <div className="mt-4">
              <p className="font-heading text-foreground text-lg font-semibold">Vimal Govind</p>
              <p className="text-muted-foreground mt-1 text-sm">.NET, SQL Server, ERP systems</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {RESUME_DATA.contact.social.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="border-border text-muted-foreground hover:border-neon-green/60 hover:text-neon-green flex h-9 w-9 items-center justify-center rounded-md border transition-all"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
          <TerminalWindow title="focus.json">
            <div className="space-y-1">
              <p>
                <span className="text-muted-foreground">{'{'}</span>
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">&quot;role&quot;</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-yellow-300">&quot;Senior Engineer&quot;</span>,
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">&quot;systems&quot;</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-yellow-300">&quot;ERP, payroll, accounting&quot;</span>,
              </p>
              <p className="pl-4">
                <span className="text-neon-blue">&quot;strength&quot;</span>
                <span className="text-muted-foreground">: </span>
                <span className="text-yellow-300">&quot;reliable modernization&quot;</span>
              </p>
              <p>
                <span className="text-muted-foreground">{'}'}</span>
              </p>
            </div>
          </TerminalWindow>
        </Reveal>
      </section>

      <section className="mb-16">
        <Reveal as="div" className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-foreground flex items-center gap-2 text-2xl font-semibold">
            <BriefcaseBusiness className="text-neon-green h-5 w-5" />
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-neon-blue hover:text-neon-green flex items-center gap-1 font-mono text-sm transition-colors"
          >
            view all <ArrowRight className="h-3 w-3" />
          </Link>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.07} className="h-full">
              <a
                href={project.link?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-border/80 bg-card/75 hover:border-neon-green/50 hover:bg-card motion-safe:hover:-translate-y-1 flex h-full min-h-64 flex-col rounded-lg border p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="font-heading text-foreground group-hover:text-neon-green text-base font-semibold transition-colors">
                  {project.title}
                </h3>
                <ExternalLink className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              </div>
              <p className="text-muted-foreground mb-5 line-clamp-4 flex-1 text-sm leading-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="mb-16">
          <Reveal as="div" className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-foreground flex items-center gap-2 text-2xl font-semibold">
              <Newspaper className="text-neon-blue h-5 w-5" />
              Recent Writing
            </h2>
            <Link
              href="/blog"
              className="text-neon-blue hover:text-neon-green flex items-center gap-1 font-mono text-sm transition-colors"
            >
              all articles <ArrowRight className="h-3 w-3" />
            </Link>
          </Reveal>
          <div className="grid gap-3">
            {recentPosts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.07}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group border-border/80 bg-card/70 hover:border-neon-blue/50 motion-safe:hover:-translate-y-0.5 grid gap-2 rounded-lg border p-4 transition-all duration-300 md:grid-cols-[120px_1fr_auto] md:items-center"
                >
                  <span className="text-muted-foreground font-mono text-xs">{post.date}</span>
                  <span className="font-heading text-foreground group-hover:text-neon-blue text-base font-medium transition-colors">
                    {post.title}
                  </span>
                  <span className="text-muted-foreground hidden font-mono text-xs md:block">
                    {post.tags.join(', ')}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <Reveal as="section" className="mb-8">
        <TerminalWindow title="subscribe.sh">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-foreground font-mono text-sm">
                <span className="text-neon-green">$</span> subscribe --topic engineering
              </p>
              <p className="text-muted-foreground mt-1 font-mono text-xs">
                New articles on .NET, SQL, architecture &amp; AI — no spam.
              </p>
            </div>
            <a
              href={`mailto:${RESUME_DATA.contact.email}?subject=Subscribe%20to%20your%20newsletter&body=Hey%20Vimal%2C%20please%20add%20me%20to%20your%20mailing%20list!`}
              className="border-neon-green/60 bg-neon-green/10 text-neon-green hover:bg-neon-green inline-flex shrink-0 items-center gap-2 rounded border px-4 py-2 font-mono text-sm transition-all hover:text-[#0b1118]"
            >
              <Mail className="h-4 w-4" />
              Subscribe via email
            </a>
          </div>
        </TerminalWindow>
      </Reveal>
    </div>
  );
}
