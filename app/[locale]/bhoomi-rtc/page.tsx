'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Home, Leaf, Droplets, FileText } from 'lucide-react';

interface LandRecord {
  id: string;
  rtcNumber: string;
  surveyNumber: string;
  ownerName: string;
  landSize: number;
  soilType: string;
  cropType: string;
  irrigationType: string;
  cultivationStatus: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface DistrictData {
  name: string;
  records: LandRecord[];
}

const KARNATAKA_DISTRICTS: Record<string, DistrictData> = {
  bangalore: {
    name: 'Bangalore Urban',
    records: [
      {
        id: 'BNG001',
        rtcNumber: 'RTC-2024-001',
        surveyNumber: 'SN-45-A',
        ownerName: 'Rajesh Kumar',
        landSize: 2.5,
        soilType: 'Red Loamy',
        cropType: 'Sugarcane',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Bengaluru Rural, Bangalore',
        latitude: 13.0827,
        longitude: 77.6033,
      },
      {
        id: 'BNG002',
        rtcNumber: 'RTC-2024-002',
        surveyNumber: 'SN-46-B',
        ownerName: 'Priya Sharma',
        landSize: 1.8,
        soilType: 'Black Soil',
        cropType: 'Maize',
        irrigationType: 'Flood Irrigation',
        cultivationStatus: 'Active',
        location: 'Yelahanka, Bangalore',
        latitude: 13.1045,
        longitude: 77.5976,
      },
      {
        id: 'BNG003',
        rtcNumber: 'RTC-2024-003',
        surveyNumber: 'SN-47-C',
        ownerName: 'Ramakrishna',
        landSize: 3.2,
        soilType: 'Red Soil',
        cropType: 'Coconut',
        irrigationType: 'Well',
        cultivationStatus: 'Active',
        location: 'Doddaballapur, Bangalore',
        latitude: 13.2076,
        longitude: 77.5499,
      },
      {
        id: 'BNG004',
        rtcNumber: 'RTC-2024-100',
        surveyNumber: 'SN-48-D',
        ownerName: 'Anita Singh',
        landSize: 2.2,
        soilType: 'Laterite',
        cropType: 'Tomato',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Whitefield, Bangalore',
        latitude: 13.0351,
        longitude: 77.7596,
      },
      {
        id: 'BNG005',
        rtcNumber: 'RTC-2024-101',
        surveyNumber: 'SN-49-E',
        ownerName: 'Mohan Das',
        landSize: 4.0,
        soilType: 'Red Loamy',
        cropType: 'Groundnut',
        irrigationType: 'Canal',
        cultivationStatus: 'Active',
        location: 'Hoskote, Bangalore',
        latitude: 13.1604,
        longitude: 77.8196,
      },
    ],
  },
  mysore: {
    name: 'Mysore',
    records: [
      {
        id: 'MYS001',
        rtcNumber: 'RTC-2024-004',
        surveyNumber: 'SN-78-A',
        ownerName: 'Venkatesh T',
        landSize: 4.0,
        soilType: 'Red Loamy',
        cropType: 'Coffee',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Hunsur, Mysore',
        latitude: 12.2268,
        longitude: 75.9129,
      },
      {
        id: 'MYS002',
        rtcNumber: 'RTC-2024-005',
        surveyNumber: 'SN-79-B',
        ownerName: 'Lakshmi Devi',
        landSize: 2.5,
        soilType: 'Black Soil',
        cropType: 'Paddy',
        irrigationType: 'Canal',
        cultivationStatus: 'Active',
        location: 'Srirangapatna, Mysore',
        latitude: 12.4166,
        longitude: 76.6833,
      },
      {
        id: 'MYS003',
        rtcNumber: 'RTC-2024-102',
        surveyNumber: 'SN-80-C',
        ownerName: 'Akshay Kumar',
        landSize: 3.5,
        soilType: 'Red Soil',
        cropType: 'Pepper',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Chamundi Hills, Mysore',
        latitude: 12.2654,
        longitude: 75.7866,
      },
      {
        id: 'MYS004',
        rtcNumber: 'RTC-2024-103',
        surveyNumber: 'SN-81-D',
        ownerName: 'Sunita Rao',
        landSize: 2.8,
        soilType: 'Alluvial',
        cropType: 'Sugarcane',
        irrigationType: 'Canal',
        cultivationStatus: 'Fallow',
        location: 'Mandakalli, Mysore',
        latitude: 12.3074,
        longitude: 75.8064,
      },
    ],
  },
  mandya: {
    name: 'Mandya',
    records: [
      {
        id: 'MND001',
        rtcNumber: 'RTC-2024-006',
        surveyNumber: 'SN-112-A',
        ownerName: 'Suresh Kumar',
        landSize: 5.5,
        soilType: 'Alluvial',
        cropType: 'Sugarcane',
        irrigationType: 'Canal',
        cultivationStatus: 'Active',
        location: 'Mandya City, Mandya',
        latitude: 12.5302,
        longitude: 76.8868,
      },
      {
        id: 'MND002',
        rtcNumber: 'RTC-2024-007',
        surveyNumber: 'SN-113-B',
        ownerName: 'Madhavi',
        landSize: 3.0,
        soilType: 'Red Soil',
        cropType: 'Groundnut',
        irrigationType: 'Borewell',
        cultivationStatus: 'Active',
        location: 'Pandavapura, Mandya',
        latitude: 12.6667,
        longitude: 76.5833,
      },
      {
        id: 'MND003',
        rtcNumber: 'RTC-2024-104',
        surveyNumber: 'SN-114-C',
        ownerName: 'Prakash Nair',
        landSize: 4.2,
        soilType: 'Black Soil',
        cropType: 'Cotton',
        irrigationType: 'Flood Irrigation',
        cultivationStatus: 'Active',
        location: 'Sira, Mandya',
        latitude: 12.9575,
        longitude: 76.8833,
      },
      {
        id: 'MND004',
        rtcNumber: 'RTC-2024-105',
        surveyNumber: 'SN-115-D',
        ownerName: 'Rukmini',
        landSize: 2.1,
        soilType: 'Red Loamy',
        cropType: 'Chili',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Malavalli, Mandya',
        latitude: 12.2933,
        longitude: 76.8533,
      },
    ],
  },
  hassan: {
    name: 'Hassan',
    records: [
      {
        id: 'HAS001',
        rtcNumber: 'RTC-2024-008',
        surveyNumber: 'SN-156-A',
        ownerName: 'Gowda H R',
        landSize: 6.0,
        soilType: 'Red Loamy',
        cropType: 'Cardamom',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Belur, Hassan',
        latitude: 13.1904,
        longitude: 75.7638,
      },
      {
        id: 'HAS002',
        rtcNumber: 'RTC-2024-009',
        surveyNumber: 'SN-157-B',
        ownerName: 'Jayamma',
        landSize: 2.8,
        soilType: 'Black Soil',
        cropType: 'Arecanut',
        irrigationType: 'Well',
        cultivationStatus: 'Fallow',
        location: 'Arsikere, Hassan',
        latitude: 13.1225,
        longitude: 75.6683,
      },
      {
        id: 'HAS003',
        rtcNumber: 'RTC-2024-106',
        surveyNumber: 'SN-158-C',
        ownerName: 'Srinivas',
        landSize: 3.8,
        soilType: 'Red Soil',
        cropType: 'Ginger',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Alur, Hassan',
        latitude: 13.1733,
        longitude: 75.5500,
      },
      {
        id: 'HAS004',
        rtcNumber: 'RTC-2024-107',
        surveyNumber: 'SN-159-D',
        ownerName: 'Ramakrishnan',
        landSize: 5.2,
        soilType: 'Laterite',
        cropType: 'Coconut',
        irrigationType: 'Well',
        cultivationStatus: 'Active',
        location: 'Hassan City, Hassan',
        latitude: 13.3350,
        longitude: 75.9500,
      },
    ],
  },
  tumkur: {
    name: 'Tumkur',
    records: [
      {
        id: 'TUM001',
        rtcNumber: 'RTC-2024-010',
        surveyNumber: 'SN-234-A',
        ownerName: 'Harish',
        landSize: 4.2,
        soilType: 'Red Soil',
        cropType: 'Sunflower',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Tumkur City, Tumkur',
        latitude: 13.2172,
        longitude: 77.1139,
      },
      {
        id: 'TUM002',
        rtcNumber: 'RTC-2024-108',
        surveyNumber: 'SN-235-B',
        ownerName: 'Divya Kumari',
        landSize: 3.0,
        soilType: 'Red Loamy',
        cropType: 'Maize',
        irrigationType: 'Borewell',
        cultivationStatus: 'Active',
        location: 'Kunigal, Tumkur',
        latitude: 13.4000,
        longitude: 77.3000,
      },
      {
        id: 'TUM003',
        rtcNumber: 'RTC-2024-109',
        surveyNumber: 'SN-236-C',
        ownerName: 'Vikram Singh',
        landSize: 2.5,
        soilType: 'Black Soil',
        cropType: 'Groundnut',
        irrigationType: 'Canal',
        cultivationStatus: 'Active',
        location: 'Tiptur, Tumkur',
        latitude: 13.4686,
        longitude: 76.2405,
      },
    ],
  },
  kolar: {
    name: 'Kolar',
    records: [
      {
        id: 'KOL001',
        rtcNumber: 'RTC-2024-011',
        surveyNumber: 'SN-189-A',
        ownerName: 'Manjunath',
        landSize: 3.5,
        soilType: 'Red Loamy',
        cropType: 'Onion',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Kolar, Kolar',
        latitude: 13.1487,
        longitude: 78.1293,
      },
      {
        id: 'KOL002',
        rtcNumber: 'RTC-2024-110',
        surveyNumber: 'SN-190-B',
        ownerName: 'Shanthi M',
        landSize: 2.8,
        soilType: 'Red Soil',
        cropType: 'Potato',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Mulbagal, Kolar',
        latitude: 13.4500,
        longitude: 78.5750,
      },
      {
        id: 'KOL003',
        rtcNumber: 'RTC-2024-111',
        surveyNumber: 'SN-191-C',
        ownerName: 'Bhaskar Kumar',
        landSize: 4.0,
        soilType: 'Black Soil',
        cropType: 'Chili',
        irrigationType: 'Borewell',
        cultivationStatus: 'Active',
        location: 'Kolar Gold Fields, Kolar',
        latitude: 13.2625,
        longitude: 78.2458,
      },
    ],
  },
  chikmagalur: {
    name: 'Chikmagalur',
    records: [
      {
        id: 'CHK001',
        rtcNumber: 'RTC-2024-012',
        surveyNumber: 'SN-267-A',
        ownerName: 'Ravi Kumar',
        landSize: 7.0,
        soilType: 'Red Loamy',
        cropType: 'Coffee',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Chikmagalur, Chikmagalur',
        latitude: 13.3149,
        longitude: 75.7764,
      },
      {
        id: 'CHK002',
        rtcNumber: 'RTC-2024-112',
        surveyNumber: 'SN-268-B',
        ownerName: 'Nalini',
        landSize: 5.5,
        soilType: 'Red Soil',
        cropType: 'Pepper',
        irrigationType: 'Drip Irrigation',
        cultivationStatus: 'Active',
        location: 'Mudigere, Chikmagalur',
        latitude: 13.0608,
        longitude: 75.5183,
      },
      {
        id: 'CHK003',
        rtcNumber: 'RTC-2024-113',
        surveyNumber: 'SN-269-C',
        ownerName: 'Ashraf Khan',
        landSize: 6.5,
        soilType: 'Red Loamy',
        cropType: 'Cardamom',
        irrigationType: 'Well',
        cultivationStatus: 'Active',
        location: 'Balehonnur, Chikmagalur',
        latitude: 13.3749,
        longitude: 75.6658,
      },
    ],
  },
};

export default function BhoomiRTCPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const t = getTranslation(locale);
  const [selectedDistrict, setSelectedDistrict] = useState('bangalore');
  const [searchQuery, setSearchQuery] = useState('');

  const districtOptions = Object.entries(KARNATAKA_DISTRICTS).map(([key, data]) => ({
    key,
    name: data.name,
  }));

  const currentDistrictData = KARNATAKA_DISTRICTS[selectedDistrict];
  const filteredRecords = currentDistrictData.records.filter((record) =>
    record.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.soilType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t.bhoomiRtc.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t.bhoomiRtc.description}
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.bhoomiRtc.selectDistrict}
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSearchQuery('');
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {districtOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Records
              </label>
              <Input
                type="text"
                placeholder="Search by owner name, crop, or soil type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Land Records */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">{t.bhoomiRtc.noData}</p>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Owner & RTC Info */}
                  <div className="flex items-start gap-3">
                    <Home className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.bhoomiRtc.ownerName}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{record.ownerName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{t.bhoomiRtc.rtcNumber}: {record.rtcNumber}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{t.bhoomiRtc.surveyNumber}: {record.surveyNumber}</p>
                    </div>
                  </div>

                  {/* Land Details */}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.bhoomiRtc.landSize}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{record.landSize} Acres</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{t.bhoomiRtc.soilType}: {record.soilType}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{t.bhoomiRtc.location}: {record.location}</p>
                    </div>
                  </div>

                  {/* Crop & Cultivation */}
                  <div className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.bhoomiRtc.cropType}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{record.cropType}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{t.bhoomiRtc.cultivationStatus}: {record.cultivationStatus}</p>
                    </div>
                  </div>

                  {/* Irrigation */}
                  <div className="flex items-start gap-3">
                    <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.bhoomiRtc.irrigationType}</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{record.irrigationType}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Coordinates: {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}</p>
                    </div>
                  </div>
                </div>

                {/* Details Button */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    View Full RTC Details
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Info Box */}
        <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">About Bhoomi RTC</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Bhoomi RTC (Record of Rights, Tenancy and Cultivation) contains official agricultural land records from Karnataka government. 
            This data includes ownership details, soil type, land size, cultivation status, and irrigation information for different districts in Karnataka.
          </p>
        </Card>
      </div>
    </div>
  );
}
