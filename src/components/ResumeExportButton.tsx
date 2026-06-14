'use client';

import { Download, Printer } from 'lucide-react';

type ResumeExportButtonProps = {
  placement?: 'inline' | 'floating';
};

export function ResumeExportButton({ placement = 'inline' }: ResumeExportButtonProps) {
  const handleExport = () => {
    window.print();
  };

  if (placement === 'floating') {
    return (
      <button
        type="button"
        onClick={handleExport}
        className="border-border bg-card/95 text-foreground hover:border-neon-green/60 hover:text-neon-green fixed bottom-4 left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border shadow-xl shadow-black/15 backdrop-blur transition-colors print:hidden sm:bottom-6 sm:left-6"
        aria-label="Export resume to PDF"
        title="Export resume to PDF"
      >
        <Download className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="bg-neon-green hover:bg-neon-green/85 inline-flex h-11 items-center gap-2 rounded-lg px-5 font-mono text-sm font-semibold text-[#0b1118] transition-colors print:hidden"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Export PDF
    </button>
  );
}
