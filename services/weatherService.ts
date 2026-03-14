// Weather Service — OpenWeatherMap API Integration
// Falls back to mock data if API key is not configured

import { TamilNaduDistrict } from '../constants/locations';

// ─── Replace with your OpenWeatherMap API key ────────────────────────────────
// Free API key available at: https://openweathermap.org/api
const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';
const API_BASE = 'https://api.openweathermap.org/data/2.5';
// ─────────────────────────────────────────────────────────────────────────────

export interface WeatherData {
  temperature: number;      // °C
  feelsLike: number;        // °C
  humidity: number;         // %
  rainfall: number;         // mm (monthly estimate)
  windSpeed: number;        // m/s
  windDirection: number;    // degrees
  condition: string;        // e.g., "Clear", "Rain"
  conditionIcon: string;    // emoji representation
  description: string;      // full description
  pressure: number;         // hPa
  visibility: number;       // km
  uvIndex: number;          // UV index estimate
  sunrise: string;          // HH:MM
  sunset: string;           // HH:MM
  location: string;
  fetchedAt: string;        // ISO timestamp
}

export interface ForecastDay {
  date: string;
  condition: string;
  conditionIcon: string;
  tempHigh: number;
  tempLow: number;
  humidity: number;
  rainfall: number;
}

// Map weather condition codes to emojis
function conditionToEmoji(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('thunderstorm')) return '⛈️';
  if (c.includes('drizzle'))     return '🌦️';
  if (c.includes('rain'))        return '🌧️';
  if (c.includes('snow'))        return '❄️';
  if (c.includes('mist') || c.includes('fog')) return '🌫️';
  if (c.includes('clear'))       return '☀️';
  if (c.includes('cloud'))       return '⛅';
  return '🌤️';
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL API FETCH
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchWeatherReal(district: TamilNaduDistrict): Promise<WeatherData> {
  const url = `${API_BASE}/weather?lat=${district.lat}&lon=${district.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  const data = await response.json();

  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    rainfall: data.rain ? Math.round((data.rain['1h'] || 0) * 30) : 0,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    windDirection: data.wind.deg || 0,
    condition: data.weather[0].main,
    conditionIcon: conditionToEmoji(data.weather[0].main),
    description: data.weather[0].description,
    pressure: data.main.pressure,
    visibility: Math.round((data.visibility || 10000) / 1000),
    uvIndex: 5,
    sunrise: formatTime(data.sys.sunrise),
    sunset: formatTime(data.sys.sunset),
    location: `${district.name}, Tamil Nadu`,
    fetchedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK WEATHER DATA — realistic Tamil Nadu seasonal conditions
// ─────────────────────────────────────────────────────────────────────────────

function getMockWeather(district: TamilNaduDistrict): WeatherData {
  // Simulate weather variation by district and time of day
  const hour = new Date().getHours();
  const seed = district.lat + district.lon + hour;
  const variation = (seed % 10) - 5;

  // Base conditions by region
  const regionBases: Record<string, Partial<WeatherData>> = {
    'Coastal':      { temperature: 32, humidity: 78, rainfall: 85,  windSpeed: 5.2, condition: 'Partly Cloudy' },
    'Delta':        { temperature: 31, humidity: 82, rainfall: 120, windSpeed: 3.8, condition: 'Cloudy' },
    'Western':      { temperature: 29, humidity: 65, rainfall: 60,  windSpeed: 4.5, condition: 'Clear' },
    'Southern':     { temperature: 33, humidity: 70, rainfall: 45,  windSpeed: 4.0, condition: 'Clear' },
    'Central':      { temperature: 34, humidity: 58, rainfall: 30,  windSpeed: 3.2, condition: 'Clear' },
    'Northwestern': { temperature: 30, humidity: 55, rainfall: 40,  windSpeed: 3.5, condition: 'Clear' },
    'Northeastern': { temperature: 31, humidity: 72, rainfall: 75,  windSpeed: 4.2, condition: 'Partly Cloudy' },
  };

  const base = regionBases[district.region] || regionBases['Central'];

  const temp = Math.round((base.temperature || 32) + variation * 0.5);
  const humidity = Math.min(95, Math.max(35, (base.humidity || 65) + variation));
  const rainfall = Math.max(0, (base.rainfall || 50) + variation * 3);
  const wind = Math.max(0.5, (base.windSpeed || 4) + variation * 0.2);

  const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
  const conditionIdx = hour > 14 ? 1 : 0;
  const condition = base.condition || conditions[conditionIdx % conditions.length];

  return {
    temperature: temp,
    feelsLike: temp + 2,
    humidity,
    rainfall: Math.round(rainfall),
    windSpeed: Math.round(wind * 10) / 10,
    windDirection: 210,
    condition,
    conditionIcon: conditionToEmoji(condition),
    description: condition.toLowerCase(),
    pressure: 1013 + Math.round(variation),
    visibility: 10,
    uvIndex: hour > 10 && hour < 16 ? 8 : 4,
    sunrise: '06:15',
    sunset: '18:30',
    location: `${district.name}, Tamil Nadu`,
    fetchedAt: new Date().toISOString(),
  };
}

function getMockForecast(district: TamilNaduDistrict): ForecastDay[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const conditions = [
    { c: 'Clear', icon: '☀️' },
    { c: 'Partly Cloudy', icon: '⛅' },
    { c: 'Light Rain', icon: '🌦️' },
    { c: 'Cloudy', icon: '☁️' },
    { c: 'Clear', icon: '☀️' },
  ];
  const today = new Date();
  return days.map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + 1);
    const variation = (i * 3) % 7 - 3;
    const base = 31 + (district.lat % 3);
    return {
      date: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      condition: conditions[i].c,
      conditionIcon: conditions[i].icon,
      tempHigh: Math.round(base + variation + 2),
      tempLow: Math.round(base + variation - 4),
      humidity: 60 + i * 5,
      rainfall: i === 2 ? 45 : i === 3 ? 20 : 0,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API — auto-falls back to mock if no API key
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchWeather(district: TamilNaduDistrict): Promise<WeatherData> {
  if (OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
    // Return mock data after a brief simulated delay
    await new Promise(r => setTimeout(r, 1200));
    return getMockWeather(district);
  }
  try {
    return await fetchWeatherReal(district);
  } catch (err) {
    console.warn('Weather API failed, using mock data:', err);
    return getMockWeather(district);
  }
}

export async function fetchForecast(district: TamilNaduDistrict): Promise<ForecastDay[]> {
  await new Promise(r => setTimeout(r, 800));
  return getMockForecast(district);
}
