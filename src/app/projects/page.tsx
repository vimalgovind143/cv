import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Layers3 } from 'lucide-react';
import { RESUME_DATA } from '@/data/resume-data';
import { TerminalWindow } from '@/components/TerminalWindow';
import { Reveal } from '@/components/motion';

export const metadata: Metadata = {
  title: 'Projects - Mr Vimal Govind Markkasseri',
  description:
    'Enterprise software projects by Vimal Govind — ERP systems, payroll engines, accounting platforms, and more built with .NET Core, SQL Server, and Azure.',
  keywords: [
    '.NET Core',
    'enterprise projects',
    'ERP',
    'SQL Server',
    'clean architecture',
    'payroll system',
    'inventory management',
    RESUME_DATA.name,
  ],
  alternates: {
    canonical: 'https://hellovg.win/projects',
  },
};

function getProjectDomain(title: string) {
  if (title.includes('Payroll')) return 'Payroll';
  if (title.includes('Accounting')) return 'Finance';
  if (title.includes('Inventory')) return 'Operations';
  if (title.includes('Microfinance')) return 'Lending';
  if (title.includes('Trading')) return 'Sales';
  if (title.includes('Modernization')) return 'Modernization';
  if (title.includes('Document')) return 'Workflow';
  if (title.includes('Analytics')) return 'Analytics';
  return 'Enterprise';
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/"
        className="text-muted-foreground hover:text-neon-green mb-8 inline-flex items-center gap-2 font-mono text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        ~/home
      </Link>

      <Reveal as="div" immediate className="mb-12">
        <p className="text-neon-green mb-2 font-mono text-sm">~/projects</p>
        <h1 className="font-heading text-foreground mb-4 max-w-3xl text-4xl font-semibold md:text-5xl">
          Enterprise products across payroll, finance, operations, and modernization.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg leading-8">
          A selection of systems designed, built, modernized, and supported across ERP-heavy
          business environments.
        </p>
      </Reveal>

      <Reveal immediate delay={0.1}>
        <TerminalWindow title="ls -la projects/" className="mb-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-muted-foreground font-mono text-xs">Portfolio size</p>
            <p className="text-foreground mt-1 text-2xl font-semibold">
              {RESUME_DATA.projects.length} systems
            </p>
          </div>
          <div>
            <p className="text-muted-foreground font-mono text-xs">Core platform</p>
            <p className="text-foreground mt-1">.NET Core, SQL Server, Angular, Azure</p>
          </div>
          <div>
            <p className="text-muted-foreground font-mono text-xs">Common outcome</p>
            <p className="text-foreground mt-1">More reliable releases and cleaner operations</p>
          </div>
        </div>
        </TerminalWindow>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {RESUME_DATA.projects.map((project, index) => (
          <Reveal key={project.title} delay={index * 0.05} className="h-full">
            <article
              className="group border-border/80 bg-card/75 hover:border-neon-green/50 hover:bg-card motion-safe:hover:-translate-y-1 flex h-full min-h-80 flex-col rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <span className="border-neon-blue/30 bg-neon-blue/10 text-neon-blue mb-2 inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs">
                  <Layers3 className="h-3 w-3" />
                  {getProjectDomain(project.title)}
                </span>
                <h2 className="font-heading text-foreground group-hover:text-neon-green text-xl font-semibold transition-colors">
                  {project.title}
                </h2>
              </div>
              {project.link && (
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.link.label}`}
                  className="text-muted-foreground hover:text-neon-green shrink-0 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <p className="text-muted-foreground mb-5 line-clamp-5 flex-1 text-sm leading-7">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
