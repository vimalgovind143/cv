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
        className={`rounded-full px-4 py-2 text-sm font-mono transition-all duration-200 ${
          activeTag === null
            ? 'bg-neon-green text-terminal-bg font-semibold'
            : 'bg-muted text-muted-foreground hover:border-neon-green/50 hover:text-foreground'
        } border border-border`}
      >
        All
      </button>
      
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`rounded-full px-4 py-2 text-sm font-mono transition-all duration-200 ${
            activeTag === tag
              ? 'bg-neon-blue text-terminal-bg font-semibold'
              : 'bg-muted text-muted-foreground hover:border-neon-blue/50 hover:text-foreground'
          } border border-border`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
