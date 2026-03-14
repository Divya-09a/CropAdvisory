// Rule-Based Crop Advisory Engine
// NO AI or ML — pure conditional logic

import { CropConditions } from '../constants/crops';
import { WeatherData } from './weatherService';

export interface Advisory {
  type: 'success' | 'warning' | 'danger' | 'info';
  category: string;
  message: string;
  action: string;
}

export interface AdvisoryReport {
  cropName: string;
  overallStatus: 'Favorable' | 'Moderate' | 'Unfavorable';
  advisories: Advisory[];
  riskAlerts: string[];
  score: number; // 0–100 favorability score
}

/**
 * Generate crop advisory based on rule-based conditions.
 * Rules are evaluated against current weather data and crop ideal ranges.
 */
export function generateAdvisory(
  crop: CropConditions,
  weather: WeatherData
): AdvisoryReport {
  const advisories: Advisory[] = [];
  const riskAlerts: string[] = [];
  let score = 100;

  const temp = weather.temperature;
  const humidity = weather.humidity;
  const rainfall = weather.rainfall;
  const windSpeed = weather.windSpeed;

  // ─────────────────────────────────────────────────────────────
  // TEMPERATURE RULES
  // ─────────────────────────────────────────────────────────────

  if (temp > crop.tempMax) {
    // Rule: IF temperature > crop_max_temp THEN high temp advisory
    const excess = temp - crop.tempMax;
    score -= excess > 5 ? 25 : 15;
    riskAlerts.push('High Temperature Stress');
    advisories.push({
      type: 'danger',
      category: 'Temperature',
      message: `High temperature detected (${temp}°C). ${crop.name} thrives below ${crop.tempMax}°C.`,
      action: 'Increase irrigation frequency. Apply mulching to retain soil moisture. Provide shade if possible.',
    });
  } else if (temp < crop.tempMin) {
    // Rule: IF temperature < crop_min_temp THEN cold stress advisory
    score -= 20;
    riskAlerts.push('Cold Stress Risk');
    advisories.push({
      type: 'warning',
      category: 'Temperature',
      message: `Low temperature detected (${temp}°C). ${crop.name} requires minimum ${crop.tempMin}°C.`,
      action: 'Protect young plants with covers. Delay irrigation during cold nights. Apply potassium fertilizer.',
    });
  } else if (Math.abs(temp - crop.tempIdeal) <= 3) {
    // Rule: IF temperature near ideal THEN favorable
    advisories.push({
      type: 'success',
      category: 'Temperature',
      message: `Temperature (${temp}°C) is ideal for ${crop.name} cultivation.`,
      action: 'Maintain current irrigation schedule. No temperature-related action needed.',
    });
  } else {
    advisories.push({
      type: 'info',
      category: 'Temperature',
      message: `Temperature (${temp}°C) is within acceptable range for ${crop.name}.`,
      action: 'Monitor temperature trends. Adjust irrigation if temperature rises.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // HUMIDITY RULES
  // ─────────────────────────────────────────────────────────────

  if (humidity > crop.humidityMax) {
    // Rule: IF humidity > crop_max_humidity THEN fungal disease risk
    score -= 20;
    riskAlerts.push('Fungal Disease Risk');
    advisories.push({
      type: 'danger',
      category: 'Humidity',
      message: `High humidity (${humidity}%) may cause fungal diseases in ${crop.name}.`,
      action: 'Apply preventive fungicide. Improve field drainage. Increase plant spacing for air circulation.',
    });
  } else if (humidity < crop.humidityMin) {
    // Rule: IF humidity < crop_min_humidity THEN dry stress advisory
    score -= 15;
    advisories.push({
      type: 'warning',
      category: 'Humidity',
      message: `Low humidity (${humidity}%) may cause moisture stress in ${crop.name}.`,
      action: 'Increase irrigation frequency. Consider drip irrigation for water efficiency. Apply organic mulch.',
    });
  } else {
    advisories.push({
      type: 'success',
      category: 'Humidity',
      message: `Humidity level (${humidity}%) is suitable for ${crop.name}.`,
      action: 'Maintain current humidity management. Regular monitoring recommended.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // RAINFALL RULES
  // ─────────────────────────────────────────────────────────────

  if (rainfall < crop.rainfallMin * 0.5) {
    // Rule: IF rainfall < 50% of minimum THEN severe drought advisory
    score -= 25;
    riskAlerts.push('Severe Drought Risk');
    advisories.push({
      type: 'danger',
      category: 'Rainfall',
      message: `Very low rainfall (${rainfall} mm). ${crop.name} is at high drought risk.`,
      action: 'Activate irrigation immediately. Consider drought-resistant varieties. Apply mulch to conserve moisture.',
    });
  } else if (rainfall < crop.rainfallMin) {
    // Rule: IF rainfall < crop_min_rainfall THEN plan irrigation
    score -= 15;
    advisories.push({
      type: 'warning',
      category: 'Rainfall',
      message: `Low rainfall (${rainfall} mm). Plan irrigation for ${crop.name}.`,
      action: 'Schedule supplemental irrigation. Check soil moisture levels daily. Consider water harvesting.',
    });
  } else if (rainfall > crop.rainfallMax) {
    // Rule: IF rainfall > crop_max_rainfall THEN waterlogging risk
    score -= 20;
    riskAlerts.push('Waterlogging Risk');
    advisories.push({
      type: 'warning',
      category: 'Rainfall',
      message: `Excess rainfall (${rainfall} mm). Risk of waterlogging for ${crop.name}.`,
      action: 'Ensure proper field drainage. Create drainage channels. Avoid fertilizer application during heavy rains.',
    });
  } else {
    advisories.push({
      type: 'success',
      category: 'Rainfall',
      message: `Rainfall (${rainfall} mm) is within ideal range for ${crop.name}.`,
      action: 'Rainfall is adequate. Maintain regular field monitoring.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // WIND SPEED RULES
  // ─────────────────────────────────────────────────────────────

  if (windSpeed > crop.windMax) {
    // Rule: IF wind speed exceeds crop tolerance THEN physical damage risk
    score -= 15;
    riskAlerts.push('Wind Damage Risk');
    advisories.push({
      type: 'warning',
      category: 'Wind',
      message: `High wind speed (${windSpeed} m/s) may damage ${crop.name} crops.`,
      action: 'Install windbreakers. Stake tall plants. Postpone pesticide/fertilizer spraying.',
    });
  } else if (windSpeed > crop.windMax * 0.7) {
    advisories.push({
      type: 'info',
      category: 'Wind',
      message: `Moderate wind speed (${windSpeed} m/s). Monitor for damage in ${crop.name} fields.`,
      action: 'Check plants for lodging. Avoid spraying operations in strong wind.',
    });
  } else {
    advisories.push({
      type: 'success',
      category: 'Wind',
      message: `Wind speed (${windSpeed} m/s) is safe for ${crop.name}.`,
      action: 'Wind conditions are favorable. Normal field operations can continue.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // WEATHER CONDITION RULES
  // ─────────────────────────────────────────────────────────────

  const condition = weather.condition.toLowerCase();
  if (condition.includes('thunderstorm') || condition.includes('storm')) {
    score -= 10;
    riskAlerts.push('Storm Warning');
    advisories.push({
      type: 'danger',
      category: 'Weather Alert',
      message: 'Thunderstorm conditions detected. Immediate protective action required.',
      action: 'Halt all field operations. Secure irrigation equipment. Stay indoors and monitor weather updates.',
    });
  } else if (condition.includes('rain')) {
    advisories.push({
      type: 'info',
      category: 'Weather Alert',
      message: 'Rainy conditions present. Adjust field operations accordingly.',
      action: 'Postpone fertilizer application. Check for waterlogging in low-lying areas.',
    });
  } else if (condition.includes('clear') || condition.includes('sunny')) {
    advisories.push({
      type: 'success',
      category: 'Weather Alert',
      message: 'Clear weather conditions are favorable for field operations.',
      action: 'Good time for spraying, harvesting, and other field activities.',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // DETERMINE OVERALL STATUS
  // ─────────────────────────────────────────────────────────────

  const clampedScore = Math.max(0, Math.min(100, score));
  let overallStatus: 'Favorable' | 'Moderate' | 'Unfavorable';
  if (clampedScore >= 70) {
    overallStatus = 'Favorable';
  } else if (clampedScore >= 45) {
    overallStatus = 'Moderate';
  } else {
    overallStatus = 'Unfavorable';
  }

  return {
    cropName: crop.name,
    overallStatus,
    advisories,
    riskAlerts,
    score: clampedScore,
  };
}
