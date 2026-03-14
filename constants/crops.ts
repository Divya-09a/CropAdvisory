// Crop Database with Ideal Growing Conditions
// Used for rule-based advisory generation — NO AI/ML

export interface CropConditions {
  name: string;
  emoji: string;
  season: string;
  description: string;
  // Temperature (°C)
  tempMin: number;
  tempMax: number;
  tempIdeal: number;
  // Humidity (%)
  humidityMin: number;
  humidityMax: number;
  // Rainfall (mm/month)
  rainfallMin: number;
  rainfallMax: number;
  // Wind speed (m/s)
  windMax: number;
  // Risk keywords for display
  risks: string[];
  // Suitable Tamil Nadu regions
  suitableRegions: string[];
}

export const CROP_DATABASE: CropConditions[] = [
  {
    name: 'Rice',
    emoji: '🌾',
    season: 'Kharif (June–November)',
    description: 'Paddy rice — the primary staple crop of Tamil Nadu, grown in delta and irrigated areas.',
    tempMin: 20, tempMax: 40, tempIdeal: 30,
    humidityMin: 60, humidityMax: 90,
    rainfallMin: 150, rainfallMax: 300,
    windMax: 12,
    risks: ['Blast disease', 'Brown planthopper', 'Flooding damage', 'Drought stress'],
    suitableRegions: ['Delta', 'Coastal', 'Central'],
  },
  {
    name: 'Wheat',
    emoji: '🌽',
    season: 'Rabi (November–March)',
    description: 'Cool-season cereal crop grown in mild winter conditions.',
    tempMin: 10, tempMax: 30, tempIdeal: 20,
    humidityMin: 40, humidityMax: 70,
    rainfallMin: 50, rainfallMax: 150,
    windMax: 10,
    risks: ['Rust disease', 'Aphid infestation', 'Heat stress', 'Waterlogging'],
    suitableRegions: ['Northwestern', 'Western', 'Central'],
  },
  {
    name: 'Sugarcane',
    emoji: '🎋',
    season: 'Year-round (12–18 months)',
    description: 'Long-duration cash crop requiring warm temperatures and ample water.',
    tempMin: 21, tempMax: 38, tempIdeal: 30,
    humidityMin: 50, humidityMax: 80,
    rainfallMin: 100, rainfallMax: 250,
    windMax: 15,
    risks: ['Red rot disease', 'Top borer pest', 'Cyclone damage', 'Drought'],
    suitableRegions: ['Western', 'Delta', 'Central', 'Northwestern'],
  },
  {
    name: 'Cotton',
    emoji: '☁️',
    season: 'Kharif (June–October)',
    description: 'Major fiber crop requiring warm and dry conditions during boll development.',
    tempMin: 20, tempMax: 40, tempIdeal: 30,
    humidityMin: 40, humidityMax: 70,
    rainfallMin: 60, rainfallMax: 150,
    windMax: 12,
    risks: ['Bollworm', 'Whitefly', 'Excessive humidity (boll rot)', 'Waterlogging'],
    suitableRegions: ['Southern', 'Northwestern', 'Western'],
  },
  {
    name: 'Maize',
    emoji: '🌽',
    season: 'Kharif & Rabi',
    description: 'Versatile cereal crop adaptable to varied conditions, grown for food and fodder.',
    tempMin: 18, tempMax: 35, tempIdeal: 27,
    humidityMin: 50, humidityMax: 80,
    rainfallMin: 60, rainfallMax: 150,
    windMax: 12,
    risks: ['Fall armyworm', 'Stalk borer', 'Downy mildew', 'Drought'],
    suitableRegions: ['Western', 'Northwestern', 'Central', 'Southern'],
  },
  {
    name: 'Groundnut',
    emoji: '🥜',
    season: 'Kharif (June–September)',
    description: 'Important oilseed crop thriving in well-drained sandy loam soils.',
    tempMin: 22, tempMax: 36, tempIdeal: 30,
    humidityMin: 40, humidityMax: 65,
    rainfallMin: 50, rainfallMax: 125,
    windMax: 10,
    risks: ['Tikka leaf spot', 'Collar rot', 'Excess moisture', 'Pod damage'],
    suitableRegions: ['Southern', 'Coastal', 'Northwestern', 'Western'],
  },
  {
    name: 'Banana',
    emoji: '🍌',
    season: 'Year-round (plantations)',
    description: 'Tropical fruit crop requiring warm, humid conditions and wind protection.',
    tempMin: 20, tempMax: 35, tempIdeal: 27,
    humidityMin: 60, humidityMax: 85,
    rainfallMin: 100, rainfallMax: 200,
    windMax: 8,
    risks: ['Panama wilt', 'Cyclone/wind damage', 'Sigatoka leaf spot', 'Cold stress'],
    suitableRegions: ['Delta', 'Coastal', 'Western', 'Southern'],
  },
];

export const getCrop = (name: string): CropConditions | undefined =>
  CROP_DATABASE.find(c => c.name === name);
