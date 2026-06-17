import type { Metadata } from 'next';
import { RESUME_DATA } from '@/data/resume-data';
import { TerminalWindow } from '@/components/TerminalWindow';
import { BriefcaseBusiness, GraduationCap, Link as LinkIcon, Mail, MapPin } from 'lucide-react';
import { ResumeExportButton } from '@/components/ResumeExportButton';
import { Reveal } from '@/components/motion';

export const metadata: Metadata = {
  title: 'About - Mr Vimal Govind Markkasseri',
  description: 'Learn more about Mr Vimal Govind Markkasseri - Senior Full Stack Engineer',
};

const skillGroups = [
  {
    title: 'Backend',
    skills: ['.NET Core', 'ASP.NET', 'Entity Framework Core', 'REST APIs', 'Web APIs', 'SignalR'],
  },
  {
    title: 'Frontend',
    skills: ['React', 'Angular', 'TypeScript', 'JavaScript', 'HTML/CSS'],
  },
  {
    title: 'Architecture',
    skills: [
      'Clean Architecture',
      'SOLID Principles',
      'Microservices Architecture',
      'System Architecture',
      'Performance Optimization',
    ],
  },
  {
    title: 'Data & Infrastructure',
    skills: [
      'SQL Server',
      'Database Design',
      'Docker',
      'Kubernetes',
      'Azure',
      'Cloud Infrastructure',
    ],
  },
  {
    title: 'Business Domains',
    skills: [
      'ERP Systems',
      'Accounting Systems',
      'Payroll Systems',
      'Inventory Management',
      'Business Process Analysis',
    ],
  },
  {
    title: 'Applied AI',
    skills: [
      'Semantic Kernel',
      'Azure OpenAI',
      'Microsoft.Extensions.AI',
      'AI Agents',
      'Function Calling',
      'RAG',
      'Prompt Engineering',
      'Data Analysis',
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Reveal as="div" immediate className="mb-12">
        <p className="text-neon-green mb-2 font-mono text-sm">~/resume</p>
        <h1 className="font-heading text-foreground mb-4 text-4xl font-semibold md:text-5xl">
          Enterprise software engineer with a support-first view of architecture.
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg leading-8">{RESUME_DATA.summary}</p>
        <div className="mt-6">
          <ResumeExportButton />
        </div>
      </Reveal>
      <ResumeExportButton placement="floating" />

      <Reveal as="section" immediate delay={0.1} className="mb-12 grid gap-3 sm:grid-cols-3">
        <a
          href={`mailto:${RESUME_DATA.contact.email}`}
          className="border-border/80 bg-card/70 text-muted-foreground hover:border-neon-green/50 hover:text-foreground flex items-center gap-3 rounded-lg border p-4 text-sm transition-colors"
        >
          <Mail className="text-neon-green h-4 w-4" />
          {RESUME_DATA.contact.email}
        </a>
        <a
          href={RESUME_DATA.locationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border/80 bg-card/70 text-muted-foreground hover:border-neon-green/50 hover:text-foreground flex items-center gap-3 rounded-lg border p-4 text-sm transition-colors"
        >
          <MapPin className="text-neon-green h-4 w-4" />
          {RESUME_DATA.location}
        </a>
        <a
          href={RESUME_DATA.personalWebsiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border/80 bg-card/70 text-muted-foreground hover:border-neon-green/50 hover:text-foreground flex items-center gap-3 rounded-lg border p-4 text-sm transition-colors"
        >
          <LinkIcon className="text-neon-green h-4 w-4" />
          hellovg.win
        </a>
      </Reveal>

      <Reveal immediate delay={0.15}>
        <TerminalWindow title="career-focus.txt" className="mb-12">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-muted-foreground font-mono text-xs">Primary stack</p>
            <p className="text-foreground mt-1">
              .NET Core, SQL Server, Angular, React, Semantic Kernel
            </p>
          </div>
          <div>
            <p className="text-muted-foreground font-mono text-xs">Business depth</p>
            <p className="text-foreground mt-1">ERP, payroll, accounting, inventory</p>
          </div>
          <div>
            <p className="text-muted-foreground font-mono text-xs">Operating style</p>
            <p className="text-foreground mt-1">
              Reliable delivery, modernization, supportability, practical AI
            </p>
          </div>
        </div>
        </TerminalWindow>
      </Reveal>

      <section className="mb-12">
        <Reveal as="h2" className="font-heading text-foreground mb-6 text-2xl font-semibold">
          Technology Stack
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((group, index) => (
            <Reveal
              key={group.title}
              delay={index * 0.06}
              className="border-border/80 bg-card/70 motion-safe:hover:-translate-y-0.5 h-full rounded-lg border p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
            >
              <h3 className="font-heading text-foreground mb-3 text-base font-semibold">
                {group.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-muted text-muted-foreground rounded px-2 py-1 font-mono text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <Reveal
          as="h2"
          className="font-heading text-foreground mb-6 flex items-center gap-2 text-2xl font-semibold"
        >
          <BriefcaseBusiness className="text-neon-green h-5 w-5" />
          Work Experience
        </Reveal>
        <div className="space-y-5">
          {RESUME_DATA.work.map((job, index) => (
            <Reveal key={job.title} delay={index * 0.06}>
              <article
                className="border-border/80 bg-card/70 motion-safe:hover:-translate-y-0.5 relative rounded-lg border p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
              >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-foreground text-lg font-semibold">
                    {job.title}
                  </h3>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-blue font-mono text-sm hover:underline"
                  >
                    {job.company}
                  </a>
                </div>
                <span className="border-border bg-muted text-muted-foreground rounded-md border px-2 py-1 font-mono text-xs">
                  {job.start} — {job.end}
                </span>
              </div>
                <p className="text-muted-foreground text-sm leading-7">{job.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <Reveal
          as="h2"
          className="font-heading text-foreground mb-6 flex items-center gap-2 text-2xl font-semibold"
        >
          <GraduationCap className="text-neon-blue h-5 w-5" />
          Education
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {RESUME_DATA.education.map((edu, index) => (
            <Reveal
              key={edu.school}
              delay={index * 0.06}
              className="border-border/80 bg-card/70 motion-safe:hover:-translate-y-0.5 h-full rounded-lg border p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
            >
              <h3 className="font-heading text-foreground text-lg font-semibold">{edu.degree}</h3>
              <p className="text-neon-blue font-mono text-sm">{edu.school}</p>
              <span className="text-muted-foreground font-mono text-xs">
                {edu.start} — {edu.end}
              </span>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
