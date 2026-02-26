'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import cropsData from '@/data/crops.json';
import { Plus, Search, Phone, MapPin, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  crop: string;
  landSize: string;
  location: string;
  quantity: number;
  unit: string;
  price: number;
  date: string;
}

export default function MarketplacePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  // Form states
  const [formData, setFormData] = useState({
    crop: '',
    landSize: '',
    location: '',
    quantity: '',
    unit: 'kg',
    price: '',
  });

  useEffect(() => {
    // Load products from localStorage
    const saved = localStorage.getItem('marketplace-products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const t = getTranslation(locale);
  const { crops, landSizes, locations } = cropsData;
  
  // Create flat list of location options from locations array
  const locationOptions = locations.flatMap((loc) =>
    loc.districts.map((district) => `${district}, ${loc.state}`)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.crop || !formData.landSize || !formData.location || !formData.quantity || !formData.price) {
      alert('Please fill all fields');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      crop: formData.crop,
      landSize: formData.landSize,
      location: formData.location,
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      price: parseFloat(formData.price),
      date: new Date().toLocaleDateString(locale),
    };

    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('marketplace-products', JSON.stringify(updated));

    setFormData({ crop: '', landSize: '', location: '', quantity: '', unit: 'kg', price: '' });
    setShowForm(false);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('marketplace-products', JSON.stringify(updated));
  };

  const filtered = products.filter((product) =>
    product.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">{t.marketplace.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.marketplace.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t.marketplace.crop}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            {t.marketplace.listProduct}
          </Button>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <Card className="mb-8 p-6">
            <h2 className="mb-4 text-xl font-semibold">{t.marketplace.listProduct}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">{t.marketplace.crop}</label>
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleInputChange}
                    className="w-full rounded border border-input bg-background px-3 py-2 text-foreground"
                  >
                    <option value="">Select Crop</option>
                    {crops.map((crop) => (
                      <option key={crop.id} value={crop.name}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t.marketplace.landSize}</label>
                  <select
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleInputChange}
                    className="w-full rounded border border-input bg-background px-3 py-2 text-foreground"
                  >
                    <option value="">Select Size</option>
                    {landSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t.marketplace.location}</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded border border-input bg-background px-3 py-2 text-foreground"
                  >
                    <option value="">Select Location</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t.marketplace.quantity}</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      className="flex-1"
                    />
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="rounded border border-input bg-background px-3 py-2"
                    >
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="bag">bag</option>
                      <option value="liter">liter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{t.marketplace.price}</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit">{t.common.save}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ crop: '', landSize: '', location: '', quantity: '', unit: 'kg', price: '' });
                  }}
                >
                  {t.common.cancel}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Products List */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">{t.marketplace.listings}</h2>
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-border">
                    <h3 className="font-bold text-lg text-foreground">{product.crop}</h3>
                    <p className="text-sm text-muted-foreground">{product.date}</p>
                  </div>

                  <div className="flex-1 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">{t.marketplace.quantity}</p>
                        <p className="text-foreground">
                          {product.quantity} {product.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">{t.marketplace.price}</p>
                        <p className="text-foreground font-bold">₹{product.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{product.location}</span>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">{t.marketplace.landSize}</p>
                      <p className="text-sm text-foreground">{product.landSize}</p>
                    </div>
                  </div>

                  <div className="border-t border-border p-4 space-y-2">
                    <Button className="w-full" size="sm">
                      <Phone className="mr-2 h-4 w-4" />
                      {t.marketplace.inquiry}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t.common.delete}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No products listed yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
