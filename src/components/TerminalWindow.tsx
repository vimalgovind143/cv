import type { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({
  title = 'terminal',
  children,
  className = '',
}: TerminalWindowProps) {
  return (
    <div
      className={`border-border/80 bg-card/80 overflow-hidden rounded-lg border shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur ${className}`}
    >
      {/* Title bar */}
      <div className="border-border/60 bg-muted/45 flex items-center gap-2 border-b px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
        <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
        <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
        <span className="text-muted-foreground ml-2 font-mono text-xs">{title}</span>
      </div>
      {/* Content */}
      <div className="p-5 font-mono text-sm leading-relaxed">{children}</div>
    </div>
  );
}
