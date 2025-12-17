import React from "react";
import type { RESUME_DATA } from "@/data/resume-data";
import { Section } from "../../components/ui/section";
import { cn } from "@/lib/utils";

interface AboutProps {
  summary: typeof RESUME_DATA.summary;
  className?: string;
}

/**
 * Summary section component
 * Displays a summary of professional experience and goals
 */
export function Summary({ summary, className }: AboutProps) {
  return (
    <Section
      className={cn(
        "rounded-lg border border-border bg-background p-4 shadow-sm print:border-0 print:bg-transparent print:p-0 print:shadow-none",
        className
      )}
    >
      <h2 className="text-xl font-bold" id="about-section">
        About
      </h2>
      <div className="text-pretty font-mono text-sm text-foreground/80 print:text-[12px]">
        {summary}
      </div>
    </Section>
  );
}
