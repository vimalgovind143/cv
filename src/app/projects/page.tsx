import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { RESUME_DATA } from '@/data/resume-data';
import { TerminalWindow } from '@/components/TerminalWindow';

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

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-neon-green"
      >
        <ArrowLeft className="h-4 w-4" />
        ~/home
      </Link>

      {/* Header */}
      <div className="mb-12">
        <p className="mb-2 font-mono text-sm text-neon-green">~/projects</p>
        <h1 className="mb-3 font-heading text-4xl font-bold text-foreground md:text-5xl">
          Projects
        </h1>
        <p className="font-mono text-muted-foreground">
          Enterprise solutions built and shipped over 16+ years
        </p>
      </div>

      {/* Terminal summary */}
      <TerminalWindow title="ls -la projects/" className="mb-12">
        <div className="space-y-1">
          <p>
            <span className="text-neon-green">vg@dev</span>
            <span className="text-muted-foreground"> ~$ </span>
            <span className="text-foreground">ls -la projects/</span>
          </p>
          <p className="text-muted-foreground">total {RESUME_DATA.projects.length} projects</p>
          {RESUME_DATA.projects.map((p, i) => (
            <p key={p.title} className="font-mono text-xs">
              <span className="mr-4 text-neon-blue">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-foreground">{p.title}</span>
              <span className="ml-2 text-muted-foreground">
                [{p.techStack.slice(0, 2).join(', ')}]
              </span>
            </p>
          ))}
        </div>
      </TerminalWindow>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {RESUME_DATA.projects.map((project) => (
          <article
            key={project.title}
            className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:border-neon-green/50"
          >
            {/* Title row */}
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-neon-green">
                {project.title}
              </h2>
              {project.link && (
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${project.link.label}`}
                  className="shrink-0 text-muted-foreground transition-colors hover:text-neon-green"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Description */}
            <p className="mb-5 flex-1 font-body text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
