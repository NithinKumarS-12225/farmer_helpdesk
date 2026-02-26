'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { locales } from '@/i18n.config';
import { useTheme } from '@/lib/theme-context';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Globe, User, Bell, Lock, LogOut } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  region: string;
}

export default function AccountPage() {
  const routerInstance = useRouter();
  const routerParams = useParams();
  const locale = (routerParams?.locale as Locale) || 'en';
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    region: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load profile from localStorage
    const saved = localStorage.getItem('user-profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [locale]);

  const t = getTranslation(locale);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    localStorage.setItem('user-profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    routerInstance.push(`/${locale}`);
  };

  const handleLanguageChange = (newLocale: Locale) => {
    routerInstance.push(`/${newLocale}/account`);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">{t.account.title}</h1>
          <p className="mt-2 text-muted-foreground">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <p className="font-semibold text-foreground">{profile.name || 'Farmer'}</p>
              <p className="text-sm text-muted-foreground">{profile.email || 'Not set'}</p>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Section */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t.account.profile}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      saveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t.account.profile} Name</label>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="+91"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Region</label>
                  <Input
                    name="region"
                    value={profile.region}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    placeholder="Your region"
                  />
                </div>
              </div>
            </Card>

            {/* Preferences Section */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t.account.preferences}
              </h2>

              <div className="space-y-4">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                    <div>
                      <p className="font-medium text-foreground">{t.account.theme}</p>
                      <p className="text-sm text-muted-foreground">
                        {isDark ? t.account.dark : t.account.light} mode
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleTheme}>
                    Toggle
                  </Button>
                </div>

                {/* Language Selection */}
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{t.account.language}</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(locales as Locale[]).map((loc) => (
                      <Button
                        key={loc}
                        variant={locale === loc ? 'default' : 'outline'}
                        onClick={() => handleLanguageChange(loc)}
                        className="capitalize"
                      >
                        {loc === 'en' ? 'English' : loc === 'hi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">{t.account.notifications}</p>
                    <p className="text-sm text-muted-foreground">Get updates on schemes and weather</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 rounded border-border cursor-pointer"
                  />
                </div>
              </div>
            </Card>

            {/* Privacy & Security */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t.account.privacy}
              </h2>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Delete Account
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Privacy Policy
                </Button>
              </div>
            </Card>

            {/* Logout */}
            <Card className="p-6 bg-destructive/5 border-destructive/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Logout from your account</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </Card>

            {/* About */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">About Kisan Call Centre</h3>
              <p className="text-sm text-muted-foreground">
                Version 1.0 - AI-powered Agricultural Helpdesk. We're committed to helping Indian farmers with
                expert guidance, government schemes, real-time weather data, and marketplace services.
              </p>
              <p className="text-xs text-muted-foreground mt-4">© 2026 Kisan Call Centre. All rights reserved.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
