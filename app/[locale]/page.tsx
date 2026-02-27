'use client';

import React, { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Sprout, Users, Truck, Cloud, FileText, Settings, Phone } from 'lucide-react';

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [showCallAgent, setShowCallAgent] = useState(false);

  const t = getTranslation(locale);

  const features = [
    {
      icon: Sprout,
      title: t.nav.farmer,
      description: 'Get instant answers to farming questions powered by AI',
      href: `/${locale}/farmer`,
      color: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: Users,
      title: t.nav.experts,
      description: 'Connect with government-approved agricultural experts',
      href: `/${locale}/experts`,
      color: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: Truck,
      title: t.nav.marketplace,
      description: 'List and sell your agricultural products directly',
      href: `/${locale}/marketplace`,
      color: 'bg-amber-100 dark:bg-amber-900',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: Cloud,
      title: t.nav.weather,
      description: 'Real-time weather analysis for better farming decisions',
      href: `/${locale}/weather`,
      color: 'bg-sky-100 dark:bg-sky-900',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    {
      icon: FileText,
      title: t.nav.schemes,
      description: 'Explore government schemes, subsidies, and loan programs',
      href: `/${locale}/schemes`,
      color: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: Settings,
      title: t.nav.account,
      description: 'Manage your profile and preferences',
      href: `/${locale}/account`,
      color: 'bg-gray-100 dark:bg-gray-900',
      iconColor: 'text-gray-600 dark:text-gray-400',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.home.title}
          </h1>
          <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">{t.home.subtitle}</p>
          <p className="mt-6 text-lg text-muted-foreground">{t.home.description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2" disabled title="Coming soon">
              <Phone className="h-5 w-5" />
              Call AI Agent Now
            </Button>
            <a href="tel:7204954791">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                Call Agri Expert
              </Button>
            </a>
            <Link href={`/${locale}/farmer`}>
              <Button size="lg" className="w-full sm:w-auto">
                {t.nav.farmer}
              </Button>
            </Link>
            <Link href={`/${locale}/schemes`}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t.nav.schemes}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground">Our Services</h2>
          <p className="mt-3 text-muted-foreground">Everything you need for successful farming</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} href={feature.href}>
                <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-primary">
                  <div className="p-6">
                    <div className={`inline-flex rounded-lg ${feature.color} p-3 mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    <div className="mt-4">
                      <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                        Learn More →
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-primary">10+</div>
              <p className="mt-2 text-muted-foreground">Experts Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">10+</div>
              <p className="mt-2 text-muted-foreground">Government Schemes</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">8</div>
              <p className="mt-2 text-muted-foreground">Languages Supported</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Call Agent - Coming Soon */}
    </div>
  );
}
