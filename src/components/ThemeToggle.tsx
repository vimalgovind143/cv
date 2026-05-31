'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const activeTheme = theme ?? 'system';
  const nextTheme =
    activeTheme === 'system' ? 'light' : activeTheme === 'light' ? 'dark' : 'system';
  const label =
    activeTheme === 'system'
      ? `Using system theme (${resolvedTheme ?? 'unknown'}). Switch to light theme.`
      : `Using ${activeTheme} theme. Switch to ${nextTheme} theme.`;

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="border-border text-muted-foreground hover:border-neon-green/60 hover:text-neon-green relative inline-flex h-8 w-8 items-center justify-center rounded-md border transition-all"
      aria-label={label}
      title={label}
    >
      {activeTheme === 'system' ? (
        <Monitor className="h-4 w-4" />
      ) : activeTheme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
