'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Cloud, CloudRain, Wind, Droplets, AlertCircle, MapPin, Droplets as WaterIcon, Eye } from 'lucide-react';

interface WeatherData {
  name: string;
  coord: { lat: number; lon: number };
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    description: string;
    main: string;
    icon: string;
  }>;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  visibility: number;
  rain?: { '1h': number };
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{ description: string; main: string }>;
    wind: { speed: number };
    rain?: { '3h': number };
  }>;
}

export default function WeatherPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  const t = getTranslation(locale);
  const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';

  useEffect(() => {
    // Request geolocation on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setPermissionDenied(true);
            setError('Location permission denied. Please allow location access to see weather data.');
          }
        }
      );
    }
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError('');
      setPermissionDenied(false);

      if (!OPENWEATHER_API_KEY) {
        setError('Weather API key not configured');
        return;
      }

      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const current = await currentResponse.json();
      setWeatherData(current);
      setCurrentLocation(current.name);

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      if (forecastResponse.ok) {
        const forecast = await forecastResponse.json();
        setForecastData(forecast);
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('[v0] Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchLocation.trim()) return;

    try {
      setLoading(true);
      setError('');

      if (!OPENWEATHER_API_KEY) {
        setError('Weather API key not configured');
        return;
      }

      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchLocation)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );

      if (!geoResponse.ok) {
        throw new Error('Location not found');
      }

      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        setError('Location not found. Please try another location.');
        return;
      }

      const { lat, lon } = geoData[0];
      setSearchLocation('');
      setPermissionDenied(false);
      await fetchWeatherByCoords(lat, lon);
    } catch (err) {
      setError('Failed to find location. Please try another search.');
      console.error('[v0] Geo search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('rain')) return <CloudRain className="h-16 w-16" />;
    if (iconCode.includes('cloud')) return <Cloud className="h-16 w-16" />;
    return <Cloud className="h-16 w-16" />;
  };

  const getDailyForecast = () => {
    if (!forecastData) return [];

    const dailyData: Record<string, ForecastData['list'][0]> = {};

    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dailyData[date]) {
        dailyData[date] = item;
      }
    });

    return Object.values(dailyData).slice(0, 7);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">{t.weather.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.weather.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="mb-8 flex gap-2">
          <Input
            placeholder="Search location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </div>

        {/* Permission Denied Message */}
        {permissionDenied && (
          <Card className="mb-8 border-destructive/50 bg-destructive/10 p-4 text-destructive flex gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Location Permission Required</p>
              <p className="text-sm">Please enable location access in your browser settings to see real-time weather for your area.</p>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && !permissionDenied && (
          <Card className="mb-8 border-destructive/50 bg-destructive/10 p-4 text-destructive flex gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </Card>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Fetching weather data...</p>
          </div>
        )}

        {weatherData && !loading && !permissionDenied && (
          <div className="space-y-8">
            {/* Current Weather */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5" />
                      <h2 className="text-2xl font-bold">{weatherData.name}</h2>
                    </div>
                    <div className="text-5xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
                    <p className="mt-2 text-sm capitalize text-white/90">{weatherData.weather[0].description}</p>
                    <p className="text-sm text-white/80">Feels like {Math.round(weatherData.main.feels_like)}°C</p>
                  </div>
                  <div className="text-white/80">{getWeatherIcon(weatherData.weather[0].icon)}</div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-5">
                  <div>
                    <p className="text-xs font-semibold text-white/80 mb-1">Humidity</p>
                    <p className="font-bold flex items-center gap-1">
                      <WaterIcon className="h-4 w-4" />
                      {weatherData.main.humidity}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 mb-1">Wind</p>
                    <p className="font-bold flex items-center gap-1">
                      <Wind className="h-4 w-4" />
                      {Math.round(weatherData.wind.speed)} m/s
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 mb-1">Pressure</p>
                    <p className="font-bold">{weatherData.main.pressure} mb</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 mb-1">Visibility</p>
                    <p className="font-bold flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {(weatherData.visibility / 1000).toFixed(1)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 mb-1">Temp Range</p>
                    <p className="font-bold">{Math.round(weatherData.main.temp_min)}°-{Math.round(weatherData.main.temp_max)}°C</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Agricultural Insights */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Agricultural Insights</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-1">Farming Recommendation</p>
                  <p className="text-sm text-foreground">
                    {weatherData.main.humidity > 70
                      ? 'High humidity detected - Monitor crops for fungal diseases'
                      : 'Optimal conditions for most farming operations'}
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/10 p-4 border border-secondary/20">
                  <p className="text-sm font-semibold text-secondary mb-1">Irrigation Status</p>
                  <p className="text-sm text-foreground">
                    {weatherData.main.humidity < 40
                      ? 'Low humidity - Consider irrigation'
                      : 'Sufficient moisture in the air'}
                  </p>
                </div>
              </div>
            </Card>

            {/* 7-Day Forecast */}
            {forecastData && getDailyForecast().length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">7-Day Forecast</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {getDailyForecast().map((day, idx) => (
                    <div key={idx} className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
                      <p className="font-semibold text-sm text-foreground mb-2">
                        {new Date(day.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <div className="mb-3 text-center">
                        <p className="text-2xl font-bold text-primary">{Math.round(day.main.temp)}°C</p>
                        <p className="text-xs text-muted-foreground capitalize">{day.weather[0].description}</p>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Range:</span>
                          <span className="font-semibold">
                            {Math.round(day.main.temp_min)}° - {Math.round(day.main.temp_max)}°
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Humidity:</span>
                          <span className="font-semibold">{day.main.humidity}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wind:</span>
                          <span className="font-semibold">{Math.round(day.wind.speed)} m/s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {!weatherData && !loading && !error && !permissionDenied && (
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Enable location access to see weather data for your area</p>
            <p className="text-sm text-muted-foreground">or search for a specific location above</p>
          </Card>
        )}
      </div>
    </div>
  );
}
