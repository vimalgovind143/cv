'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', label: '~/home' },
  { href: '/projects', label: '~/projects' },
  { href: '/blog', label: '~/blog' },
  { href: '/about', label: '~/about' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 font-mono text-base font-bold">
            <span className="text-neon-green">{'>&nbsp;_'}</span>
            <span className="text-foreground">&nbsp;VG</span>
            <span className="text-neon-green">.dev</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-mono text-sm transition-colors ${
                    isActive ? 'text-neon-green' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[17px] left-0 h-[1px] w-full bg-neon-green" />
                  )}
                </Link>
              );
            })}
            <ThemeToggle />
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border/40 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-mono text-sm transition-colors ${
                    pathname === link.href
                      ? 'text-neon-green'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
