'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Calculator } from 'lucide-react';

interface LoanCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

const translations = {
  en: {
    title: 'Loan Calculator',
    loanAmount: 'Loan Amount (₹)',
    loanTenure: 'Loan Tenure (Years)',
    repaymentFrequency: 'Repayment Frequency',
    purposeOfLoan: 'Purpose of Loan',
    landOwnershipType: 'Land Ownership Type',
    results: 'Loan Calculation Results',
    monthlyInstallment: 'Equated Monthly Installment (EMI)',
    totalInterest: 'Total Interest Payable',
    totalAmount: 'Total Amount Payable',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annual: 'Annual',
    cropProduction: 'Crop Production',
    farmEquipment: 'Farm Equipment',
    farmBuilding: 'Farm Building',
    irrigation: 'Irrigation System',
    owned: 'Owned',
    leased: 'Leased',
    mortgaged: 'Mortgaged',
    calculate: 'Calculate',
    reset: 'Reset',
    interestRate: 'Annual Interest Rate (%)',
  },
  hi: {
    title: 'ऋण कैलकुलेटर',
    loanAmount: 'ऋण राशि (₹)',
    loanTenure: 'ऋण अवधि (वर्ष)',
    repaymentFrequency: 'पुनर्भुगतान आवृत्ति',
    purposeOfLoan: 'ऋण का उद्देश्य',
    landOwnershipType: 'भूमि स्वामित्व प्रकार',
    results: 'ऋण गणना परिणाम',
    monthlyInstallment: 'समान मासिक किस्त (EMI)',
    totalInterest: 'कुल ब्याज देय',
    totalAmount: 'कुल राशि देय',
    monthly: 'मासिक',
    quarterly: 'त्रैमासिक',
    annual: 'वार्षिक',
    cropProduction: 'फसल उत्पादन',
    farmEquipment: 'कृषि उपकरण',
    farmBuilding: 'कृषि भवन',
    irrigation: 'सिंचाई प्रणाली',
    owned: 'स्वामित्व',
    leased: 'पट्टेदारी',
    mortgaged: 'गिरवी',
    calculate: 'गणना करें',
    reset: 'रीसेट करें',
    interestRate: 'वार्षिक ब्याज दर (%)',
  },
  kn: {
    title: 'ಸಾಲ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    loanAmount: 'ಸಾಲದ ಮೊತ್ತ (₹)',
    loanTenure: 'ಸಾಲದ ಅವಧಿ (ವರ್ಷಗಳು)',
    repaymentFrequency: 'ಮರುಪಾವತಿ ಆವೃತ್ತಿ',
    purposeOfLoan: 'ಸಾಲದ ಉದ್ದೇಶ',
    landOwnershipType: 'ಭೂಮಿ ಮಾಲಿಕತ್ವ ವಿಧ',
    results: 'ಸಾಲ ಲೆಕ್ಕಾಚಾರ ಫಲಿತಾಂಶಗಳು',
    monthlyInstallment: 'ಸಮಾನ ಮಾಸಿಕ ಕಂತು (EMI)',
    totalInterest: 'ಒಟ್ಟು ಬಡ್ಡಿ ಪಾವತಿಸಬೇಕಾಗಿದೆ',
    totalAmount: 'ಒಟ್ಟು ಮೊತ್ತ ಪಾವತಿಸಬೇಕಾಗಿದೆ',
    monthly: 'ಮಾಸಿಕ',
    quarterly: 'ತ್ರೈಮಾಸಿಕ',
    annual: 'ವಾರ್ಷಿಕ',
    cropProduction: 'ಪುರಾಣೆ ಉತ್ಪಾದನ',
    farmEquipment: 'ಕೃಷಿ ಸಾಧನ',
    farmBuilding: 'ಕೃಷಿ ಕಟ್ಟಡ',
    irrigation: 'ನೀರಾವರಣ ವ್ಯವಸ್ಥೆ',
    owned: 'ಸ್ವಂತ',
    leased: 'ಬಾಡಿಗೆ',
    mortgaged: 'ಮೊದಲೂ',
    calculate: 'ಲೆಕ್ಕ ಹಾಕಿ',
    reset: 'ಮರುಹೊಂದಿಸಿ',
    interestRate: 'ವಾರ್ಷಿಕ ಬಡ್ಡಿ ದರ (%)',
  },
};

const getTranslation = (locale: string, key: keyof (typeof translations)[keyof typeof translations]) => {
  const trans = translations[locale as keyof typeof translations] || translations.en;
  return trans[key] || key;
};

export default function LoanCalculator({ isOpen, onClose, locale }: LoanCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(8.5);
  const [repaymentFrequency, setRepaymentFrequency] = useState('monthly');
  const [purposeOfLoan, setPurposeOfLoan] = useState('cropProduction');
  const [landOwnershipType, setLandOwnershipType] = useState('owned');

  const calculations = useMemo(() => {
    // Interest rate is annual, convert to period rate based on frequency
    let periodRate: number;
    let numberOfPayments: number;

    if (repaymentFrequency === 'monthly') {
      periodRate = interestRate / 100 / 12;
      numberOfPayments = loanTenure * 12;
    } else if (repaymentFrequency === 'quarterly') {
      periodRate = interestRate / 100 / 4;
      numberOfPayments = loanTenure * 4;
    } else {
      // annual
      periodRate = interestRate / 100;
      numberOfPayments = loanTenure;
    }

    // EMI Formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const numerator = loanAmount * periodRate * Math.pow(1 + periodRate, numberOfPayments);
    const denominator = Math.pow(1 + periodRate, numberOfPayments) - 1;
    const emi = numerator / denominator;

    const totalAmountPayable = emi * numberOfPayments;
    const totalInterestPayable = totalAmountPayable - loanAmount;

    return {
      emi: Math.round(emi),
      totalInterestPayable: Math.round(totalInterestPayable),
      totalAmountPayable: Math.round(totalAmountPayable),
    };
  }, [loanAmount, loanTenure, interestRate, repaymentFrequency]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">{getTranslation(locale, 'title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">{getTranslation(locale, 'loanAmount')}</label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(1000, parseFloat(e.target.value) || 0))}
                min="1000"
                step="10000"
              />
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">{getTranslation(locale, 'loanTenure')}</label>
                <Input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{getTranslation(locale, 'interestRate')}</label>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">{getTranslation(locale, 'repaymentFrequency')}</label>
                <select
                  value={repaymentFrequency}
                  onChange={(e) => setRepaymentFrequency(e.target.value)}
                  className="w-full rounded border border-input bg-background px-3 py-2"
                >
                  <option value="monthly">{getTranslation(locale, 'monthly')}</option>
                  <option value="quarterly">{getTranslation(locale, 'quarterly')}</option>
                  <option value="annual">{getTranslation(locale, 'annual')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{getTranslation(locale, 'purposeOfLoan')}</label>
                <select
                  value={purposeOfLoan}
                  onChange={(e) => setPurposeOfLoan(e.target.value)}
                  className="w-full rounded border border-input bg-background px-3 py-2"
                >
                  <option value="cropProduction">{getTranslation(locale, 'cropProduction')}</option>
                  <option value="farmEquipment">{getTranslation(locale, 'farmEquipment')}</option>
                  <option value="farmBuilding">{getTranslation(locale, 'farmBuilding')}</option>
                  <option value="irrigation">{getTranslation(locale, 'irrigation')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{getTranslation(locale, 'landOwnershipType')}</label>
              <select
                value={landOwnershipType}
                onChange={(e) => setLandOwnershipType(e.target.value)}
                className="w-full rounded border border-input bg-background px-3 py-2"
              >
                <option value="owned">{getTranslation(locale, 'owned')}</option>
                <option value="leased">{getTranslation(locale, 'leased')}</option>
                <option value="mortgaged">{getTranslation(locale, 'mortgaged')}</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-bold mb-4 text-foreground">{getTranslation(locale, 'results')}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/20">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  {getTranslation(locale, 'monthlyInstallment')}
                </p>
                <p className="text-2xl font-bold text-primary">
                  ₹{calculations.emi.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {repaymentFrequency === 'monthly'
                    ? 'Per Month'
                    : repaymentFrequency === 'quarterly'
                    ? 'Per Quarter'
                    : 'Per Year'}
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 p-4 border border-secondary/20">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  {getTranslation(locale, 'totalInterest')}
                </p>
                <p className="text-2xl font-bold text-secondary">
                  ₹{calculations.totalInterestPayable.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 p-4 border border-accent/20">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  {getTranslation(locale, 'totalAmount')}
                </p>
                <p className="text-2xl font-bold text-accent">
                  ₹{calculations.totalAmountPayable.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex gap-3 border-t border-border pt-6">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {getTranslation(locale, 'reset')}
            </Button>
            <Button className="flex-1" onClick={onClose}>
              {getTranslation(locale, 'calculate')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
