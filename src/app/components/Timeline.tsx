'use client';

import { memo } from 'react';
import { motion, useScroll, useSpring } from "framer-motion";
import { WorkExperience, Education } from "@/types/resume";

interface TimelineProps {
  work: WorkExperience[];
  education: Education[];
}

interface TimelineEvent {
  date: string;
  title: string;
  subtitle: string;
  description?: string;
  type: 'work' | 'education';
}

const TimelineItem = memo(({ date, title, subtitle, description }: {
  date: string;
  title: string;
  subtitle: string;
  description?: string;
}) => (
  <motion.div
    className="relative flex items-start gap-6 py-4"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
  >
    <div className="flex-none">
      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-zinc-100 text-sm font-medium dark:bg-zinc-800">
        {date.split('-')[0]}
      </div>
    </div>
    <div className="flex-grow">
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        {description && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        )}
      </div>
    </div>
  </motion.div>
));

TimelineItem.displayName = 'TimelineItem';

export function Timeline({ work, education }: TimelineProps) {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const allEvents: TimelineEvent[] = [
    ...work.map(w => ({
      date: w.start,
      title: w.company,
      subtitle: w.title,
      description: w.description,
      type: 'work' as const
    })),
    ...education.map(e => ({
      date: e.start,
      title: e.school,
      subtitle: e.degree,
      type: 'education' as const
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="relative mt-8">
      <motion.div
        className="absolute left-[20px] top-0 bottom-0 w-[2px] origin-top bg-zinc-200 dark:bg-zinc-700"
        style={{ scaleY }}
      />
      <div className="relative">
        {allEvents.map((event, index) => (
          <TimelineItem
            key={`${event.type}-${index}`}
            date={event.date}
            title={event.title}
            subtitle={event.subtitle}
            description={event.description}
          />
        ))}
      </div>
    </div>
  );
}
