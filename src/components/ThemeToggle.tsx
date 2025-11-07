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
      className="fixed top-4 right-4 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm ring-1 ring-border shadow-lg transition-all duration-300"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 top-2 right-2" />
    </button>
  );
}
