import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
          storageKey="cv-theme"
        >
          <div className="relative min-h-screen bg-background transition-colors duration-300">
            <BackgroundAnimation />
            <main className="relative z-10">
              {children}
            </main>
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
