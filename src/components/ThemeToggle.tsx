'use client';

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => {
        if (theme === 'system') {
          setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
        } else {
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }
      }}
      className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-all hover:border-neon-green/60 hover:text-neon-green"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
