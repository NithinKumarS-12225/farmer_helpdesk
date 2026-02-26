'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { useTheme } from '@/lib/theme-context';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Globe, Menu, X, Sprout } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const { isDark, toggleTheme, mounted } = useTheme();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = getTranslation(locale);

  const handleLanguageChange = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const navItems = [
    { href: 'farmer', label: t.nav.farmer },
    { href: 'experts', label: t.nav.experts },
    { href: 'marketplace', label: t.nav.marketplace },
    { href: 'weather', label: t.nav.weather },
    { href: 'schemes', label: t.nav.schemes },
    { href: 'account', label: t.nav.account },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-lg text-primary">
            <Sprout className="h-6 w-6" />
            <span className="hidden sm:inline">Kisan Call Centre</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={`/${locale}/${item.href}`}>
                <Button
                  variant={pathname.includes(`/${item.href}`) ? 'default' : 'ghost'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                  English {locale === 'en' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('hi')}>
                  हिन्दी {locale === 'hi' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('kn')}>
                  ಕನ್ನಡ {locale === 'kn' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="space-y-2 pb-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}/${item.href}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button
                  variant={pathname.includes(`/${item.href}`) ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
