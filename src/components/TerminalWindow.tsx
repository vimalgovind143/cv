import type { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({ title = 'terminal', children, className = '' }: TerminalWindowProps) {
  return (
    <div className={`rounded-lg border border-border bg-card overflow-hidden ${className}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-card px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
        <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
        <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">{title}</span>
      </div>
      {/* Content */}
      <div className="p-5 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
