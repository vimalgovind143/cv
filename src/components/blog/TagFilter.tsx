'use client';

import { useState } from 'react';

interface TagFilterProps {
  tags: string[];
  onTagChange: (tag: string | null) => void;
}

export function TagFilter({ tags, onTagChange }: TagFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    onTagChange(tag);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleTagClick(null)}
        className={`rounded-md px-3 py-2 font-mono text-sm transition-all duration-200 ${
          activeTag === null
            ? 'bg-neon-green font-semibold text-[#0b1118]'
            : 'bg-card/75 text-muted-foreground hover:border-neon-green/50 hover:text-foreground'
        } border-border/80 border`}
      >
        All
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`rounded-md px-3 py-2 font-mono text-sm transition-all duration-200 ${
            activeTag === tag
              ? 'bg-neon-blue font-semibold text-[#0b1118]'
              : 'bg-card/75 text-muted-foreground hover:border-neon-blue/50 hover:text-foreground'
          } border-border/80 border`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
