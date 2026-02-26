'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import expertsData from '@/data/experts.json';
import { Phone, Mail, MapPin, Award, Users, Search } from 'lucide-react';

interface Expert {
  id: number;
  name: string;
  qualification: string;
  specialty: string;
  experience: number;
  state: string;
  district: string;
  phone: string;
  email: string;
  serviceArea: string[];
  languages: string[];
}

export default function ExpertsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const t = getTranslation(locale);

  const experts: Expert[] = expertsData.experts;

  // Get unique specialties
  const specialties = Array.from(new Set(experts.map((e) => e.specialty)));

  // Filter experts
  const filtered = experts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = !selectedSpecialty || expert.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">{t.experts.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.experts.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t.experts.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">{t.experts.filter}</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'expert' : 'experts'} found
        </div>

        {/* Experts Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((expert) => (
              <Card key={expert.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-border">
                  <h3 className="font-bold text-lg text-foreground">{expert.name}</h3>
                  <p className="text-sm text-muted-foreground">{expert.qualification}</p>
                </div>

                <div className="flex-1 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{t.experts.specialty}</p>
                    <p className="text-sm font-medium text-foreground">{expert.specialty}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Award className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>
                      {expert.experience} {t.experts.experience}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>
                      {expert.district}, {expert.state}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Service Area</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.serviceArea.map((area) => (
                        <span
                          key={area}
                          className="inline-block rounded bg-primary/10 px-2 py-1 text-xs text-primary"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Languages</p>
                    <p className="text-sm text-foreground">{expert.languages.join(', ')}</p>
                  </div>
                </div>

                <div className="border-t border-border p-4 space-y-2">
                  <a href={`tel:${expert.phone}`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      {expert.phone}
                    </Button>
                  </a>
                  <a href={`mailto:${expert.email}`}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                  </a>
                  <Button className="w-full" size="sm">
                    {t.experts.contact}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No experts found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
