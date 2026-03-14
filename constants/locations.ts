// Tamil Nadu Districts with OpenWeatherMap coordinates
// Used for weather API calls

export interface TamilNaduDistrict {
  name: string;
  lat: number;
  lon: number;
  region: string; // Agro-climatic zone
}

export const TAMIL_NADU_DISTRICTS: TamilNaduDistrict[] = [
  { name: 'Chennai',         lat: 13.0827, lon: 80.2707, region: 'Coastal' },
  { name: 'Coimbatore',      lat: 11.0168, lon: 76.9558, region: 'Western' },
  { name: 'Madurai',         lat: 9.9252,  lon: 78.1198, region: 'Southern' },
  { name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047, region: 'Central' },
  { name: 'Salem',           lat: 11.6643, lon: 78.1460, region: 'Northwestern' },
  { name: 'Tirunelveli',     lat: 8.7139,  lon: 77.7567, region: 'Southern' },
  { name: 'Erode',           lat: 11.3410, lon: 77.7172, region: 'Western' },
  { name: 'Thanjavur',       lat: 10.7870, lon: 79.1378, region: 'Delta' },
  { name: 'Vellore',         lat: 12.9165, lon: 79.1325, region: 'Northeastern' },
  { name: 'Dindigul',        lat: 10.3673, lon: 77.9803, region: 'Southern' },
  { name: 'Kanchipuram',     lat: 12.8185, lon: 79.6947, region: 'Coastal' },
  { name: 'Thoothukudi',     lat: 8.7642,  lon: 78.1348, region: 'Coastal' },
  { name: 'Karur',           lat: 10.9601, lon: 78.0766, region: 'Central' },
  { name: 'Namakkal',        lat: 11.2190, lon: 78.1674, region: 'Northwestern' },
  { name: 'Virudhunagar',    lat: 9.5851,  lon: 77.9619, region: 'Southern' },
  { name: 'Sivagangai',      lat: 9.8473,  lon: 78.4811, region: 'Southern' },
  { name: 'Ramanathapuram',  lat: 9.3639,  lon: 78.8395, region: 'Coastal' },
  { name: 'Dharmapuri',      lat: 12.1211, lon: 78.1582, region: 'Northwestern' },
  { name: 'Krishnagiri',     lat: 12.5266, lon: 78.2138, region: 'Northwestern' },
  { name: 'Cuddalore',       lat: 11.7449, lon: 79.7680, region: 'Coastal' },
];

export const getDistrict = (name: string): TamilNaduDistrict | undefined =>
  TAMIL_NADU_DISTRICTS.find(d => d.name === name);
