import React from 'react';
import type { Locale } from '@/i18n.config';
import Navigation from '@/components/Navigation';
import ThemeProvider from '@/components/ThemeProvider';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col font-sans antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-card py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Kisan Call Centre. All rights reserved.</p>
        </footer>
      </div>
    </ThemeProvider>
  );
}
