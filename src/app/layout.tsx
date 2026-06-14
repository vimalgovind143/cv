import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navigation } from '@/components/Navigation';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import PointerTechTrail from '@/components/PointerTechTrail';
import CvChatAssistant from '@/components/CvChatAssistant';

import './globals.css';
import type React from 'react';
import { RESUME_DATA } from '@/data/resume-data';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hellovg.win'),
  title: {
    default: `${RESUME_DATA.name} - ${RESUME_DATA.about}`,
    template: `%s | ${RESUME_DATA.name}`,
  },
  description: RESUME_DATA.about,
  keywords: [
    'resume',
    'cv',
    'portfolio',
    RESUME_DATA.name,
    'software engineer',
    'full stack developer',
    'react',
    'next.js',
    'typescript',
  ],
  authors: [{ name: RESUME_DATA.name }],
  creator: RESUME_DATA.name,
  publisher: RESUME_DATA.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: RESUME_DATA.personalWebsiteUrl,
    siteName: `${RESUME_DATA.name}'s CV`,
    title: `${RESUME_DATA.name} - ${RESUME_DATA.about}`,
    description: RESUME_DATA.about,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: `${RESUME_DATA.name} - ${RESUME_DATA.about}`,
    description: RESUME_DATA.about,
    creator: '@vimalgovind',
  },
  icons: {
    icon: [
      {
        url: '/favicon-vg.png?v=vg-4',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/favicon.ico?v=vg-4',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
    ],
    shortcut: ['/favicon-vg.png?v=vg-4'],
    apple: [
      {
        url: '/apple-icon.png?v=vg-4',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  alternates: {
    canonical: RESUME_DATA.personalWebsiteUrl,
    types: {
      'application/rss+xml': `${RESUME_DATA.personalWebsiteUrl}/feed.xml`,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-body bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="cv-theme-mode"
        >
          <div className="bg-background text-foreground min-h-screen">
            <BackgroundAnimation />
            <PointerTechTrail />
            <Navigation />
            <main className="relative z-10">{children}</main>
            <CvChatAssistant />
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
