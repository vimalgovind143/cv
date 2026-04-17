import type { Metadata } from 'next';
import { RESUME_DATA } from '@/data/resume-data';
import { TerminalWindow } from '@/components/TerminalWindow';
import { Mail, MapPin, Link as LinkIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About - Mr Vimal Govind Markkasseri',
  description: 'Learn more about Mr Vimal Govind Markkasseri - Senior Full Stack Engineer',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Page Header */}
      <div className="mb-12">
        <p className="mb-2 font-mono text-sm text-neon-green">~/about</p>
        <h1 className="mb-3 font-heading text-4xl font-bold text-foreground md:text-5xl">
          About Me
        </h1>
        <p className="font-mono text-muted-foreground">
          {RESUME_DATA.about}
        </p>
      </div>

      {/* Contact terminal */}
      <TerminalWindow title="contact.json" className="mb-12">
        <div className="space-y-1">
          <p><span className="text-muted-foreground">{'{'}</span></p>
          <p className="pl-4">
            <span className="text-neon-blue">&quot;email&quot;</span>
            <span className="text-muted-foreground">: </span>
            <a href={`mailto:${RESUME_DATA.contact.email}`} className="text-yellow-300 hover:underline">
              &quot;{RESUME_DATA.contact.email}&quot;
            </a>
            <span className="text-muted-foreground">,</span>
          </p>
          <p className="pl-4">
            <span className="text-neon-blue">&quot;location&quot;</span>
            <span className="text-muted-foreground">: </span>
            <span className="text-yellow-300">&quot;{RESUME_DATA.location}&quot;</span>
            <span className="text-muted-foreground">,</span>
          </p>
          <p className="pl-4">
            <span className="text-neon-blue">&quot;website&quot;</span>
            <span className="text-muted-foreground">: </span>
            <a href={RESUME_DATA.personalWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:underline">
              &quot;{RESUME_DATA.personalWebsiteUrl}&quot;
            </a>
            <span className="text-muted-foreground">,</span>
          </p>
          <p className="pl-4">
            <span className="text-neon-blue">&quot;social&quot;</span>
            <span className="text-muted-foreground">: {'{'}</span>
          </p>
          {RESUME_DATA.contact.social.map((social, i) => (
            <p key={social.name} className="pl-8">
              <span className="text-neon-blue lowercase">&quot;{social.name.toLowerCase()}&quot;</span>
              <span className="text-muted-foreground">: </span>
              <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-neon-green hover:underline">
                &quot;{social.url}&quot;
              </a>
              {i < RESUME_DATA.contact.social.length - 1 && <span className="text-muted-foreground">,</span>}
            </p>
          ))}
          <p className="pl-4"><span className="text-muted-foreground">{'}'}</span></p>
          <p><span className="text-muted-foreground">{'}'}</span></p>
        </div>
      </TerminalWindow>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          <span className="text-neon-green">//</span> Technology Stack
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {RESUME_DATA.skills.map((skill) => (
            <div
              key={skill}
              className="rounded border border-border bg-card px-3 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-neon-green/40 hover:text-foreground"
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience */}
      <section className="mb-12">
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          <span className="text-neon-green">//</span> Work Experience
        </h2>
        <div className="space-y-4">
          {RESUME_DATA.work.map((job, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-neon-green/30">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{job.title}</h3>
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-neon-blue hover:underline"
                  >
                    {job.company}
                  </a>
                </div>
                <span className="rounded border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                  {job.start} — {job.end}
                </span>
              </div>
              <p className="font-body text-sm leading-relaxed text-muted-foreground">{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
          <span className="text-neon-green">//</span> Education
        </h2>
        <div className="space-y-4">
          {RESUME_DATA.education.map((edu, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-neon-green/30">
              <h3 className="font-heading text-lg font-semibold text-foreground">{edu.degree}</h3>
              <p className="font-mono text-sm text-neon-blue">{edu.school}</p>
              <span className="font-mono text-xs text-muted-foreground">{edu.start} — {edu.end}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
