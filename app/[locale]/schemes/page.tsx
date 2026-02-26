'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LoanCalculator from '@/components/LoanCalculator';
import schemesData from '@/data/schemes.json';
import { Search, FileText, DollarSign, Users, CheckCircle, ExternalLink, Calculator } from 'lucide-react';

interface Scheme {
  id: number;
  name: string;
  description: string;
  type: string;
  eligibility: string;
  coverage: string;
  premiumPercentage: string;
  benefits: string[];
  applicationProcess: string;
  states: string[];
  link: string;
}

interface LoanScheme {
  id: number;
  name: string;
  lender: string;
  purpose: string;
  amount: string;
  tenure: string;
  interestRate: string;
  collateral: string;
  documents: string[];
}

export default function SchemesPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showTab, setShowTab] = useState<'schemes' | 'loans'>('schemes');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const t = getTranslation(locale);

  const schemes: Scheme[] = schemesData.schemes;
  const loans: LoanScheme[] = schemesData.loanSchemes;

  // Get unique scheme types
  const schemeTypes = Array.from(new Set(schemes.map((s) => s.type)));

  // Filter schemes
  const filtered = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = !selectedType || scheme.type === selectedType;

    return matchesSearch && matchesType;
  });

  const schemeTypeLabels: Record<string, string> = {
    insurance: 'Insurance',
    soil_management: 'Soil Management',
    income_support: 'Income Support',
    irrigation: 'Irrigation',
    credit: 'Credit',
    organic_farming: 'Organic Farming',
    sustainable_agriculture: 'Sustainable Agriculture',
    price_support: 'Price Support',
    livestock: 'Livestock',
    fisheries: 'Fisheries',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">{t.schemes.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.schemes.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 border-b border-border">
          <Button
            variant={showTab === 'schemes' ? 'default' : 'ghost'}
            onClick={() => {
              setShowTab('schemes');
              setSelectedScheme(null);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Government Schemes
          </Button>
          <Button
            variant={showTab === 'loans' ? 'default' : 'ghost'}
            onClick={() => {
              setShowTab('loans');
              setSelectedScheme(null);
            }}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Loan Programs
          </Button>
        </div>

        {/* Schemes Tab */}
        {showTab === 'schemes' && (
          <>
            {/* Search and Filter */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t.schemes.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="">{t.schemes.filter}</option>
                {schemeTypes.map((type) => (
                  <option key={type} value={type}>
                    {schemeTypeLabels[type] || type}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="mb-6 text-sm text-muted-foreground">
              {filtered.length} scheme{filtered.length !== 1 ? 's' : ''} found
            </div>

            {/* Schemes List */}
            {filtered.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((scheme) => (
                  <Card
                    key={scheme.id}
                    className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-border">
                      <h3 className="font-bold text-lg text-foreground line-clamp-2">{scheme.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {schemeTypeLabels[scheme.type] || scheme.type}
                      </p>
                    </div>

                    <div className="flex-1 p-4 space-y-3">
                      <p className="text-sm text-foreground line-clamp-2">{scheme.description}</p>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">{t.schemes.coverage}</p>
                        <p className="text-sm text-foreground">{scheme.coverage}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Premium/Subsidy</p>
                        <p className="text-sm text-foreground">{scheme.premiumPercentage}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                          <span key={idx} className="inline-block rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                            {benefit}
                          </span>
                        ))}
                        {scheme.benefits.length > 2 && (
                          <span className="inline-block rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                            +{scheme.benefits.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-border p-4">
                      <Button className="w-full" onClick={() => setSelectedScheme(scheme)}>
                        {t.schemes.apply}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No schemes found matching your criteria</p>
              </Card>
            )}
          </>
        )}

        {/* Loans Tab */}
        {showTab === 'loans' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Available Loan Programs</h2>
              <Button onClick={() => setShowCalculator(true)} size="lg">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate EMI
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
            {loans.map((loan) => (
              <Card key={loan.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-border">
                  <h3 className="font-bold text-lg text-foreground">{loan.name}</h3>
                  <p className="text-sm text-muted-foreground">{loan.lender}</p>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Purpose</p>
                    <p className="text-sm text-foreground">{loan.purpose}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Loan Amount</p>
                      <p className="text-foreground font-medium">{loan.amount}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Tenure</p>
                      <p className="text-foreground font-medium">{loan.tenure}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Interest Rate</p>
                      <p className="text-foreground font-medium">{loan.interestRate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Collateral</p>
                      <p className="text-foreground font-medium text-xs">{loan.collateral}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Required Documents</p>
                    <ul className="space-y-1">
                      {loan.documents.map((doc, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-foreground">
                          <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 mt-0.5" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border p-4">
                  <Button className="w-full" size="sm">
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
            </div>
          </>
        )}

        {/* Loan Calculator Modal */}
        <LoanCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} locale={locale} />

        {/* Scheme Detail Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="max-h-[90vh] max-w-2xl w-full overflow-y-auto">
              <div className="sticky top-0 flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-foreground">{selectedScheme.name}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedScheme(null)}
                  className="ml-2"
                >
                  ✕
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedScheme.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
                  <p className="text-foreground">{selectedScheme.eligibility}</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Coverage</h3>
                    <p className="text-foreground">{selectedScheme.coverage}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Premium/Cost</h3>
                    <p className="text-foreground">{selectedScheme.premiumPercentage}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Key Benefits</h3>
                  <ul className="space-y-2">
                    {selectedScheme.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2 text-foreground">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">How to Apply</h3>
                  <p className="text-foreground">{selectedScheme.applicationProcess}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedScheme.states.map((state) => (
                    <span key={state} className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      {state}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 border-t border-border pt-6">
                  <Button className="flex-1">Apply Now</Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(selectedScheme.link, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
