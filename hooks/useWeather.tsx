// Weather Hook — fetches weather + generates advisory
import { useState, useEffect, useCallback } from 'react';
import { fetchWeather, fetchForecast, WeatherData, ForecastDay } from '../services/weatherService';
import { generateAdvisory, AdvisoryReport } from '../services/advisoryService';
import { getDistrict } from '../constants/locations';
import { getCrop } from '../constants/crops';

export function useWeather(locationName: string, cropName: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [advisory, setAdvisory] = useState<AdvisoryReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (!locationName || !cropName) return;

    const district = getDistrict(locationName);
    const crop = getCrop(cropName);

    if (!district || !crop) {
      setError('Invalid location or crop selection.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchWeather(district),
        fetchForecast(district),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);

      // Generate rule-based advisory from fetched weather
      const advisoryReport = generateAdvisory(crop, weatherData);
      setAdvisory(advisoryReport);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch weather data.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [locationName, cropName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { weather, forecast, advisory, isLoading, error, lastUpdated, refresh };
}
