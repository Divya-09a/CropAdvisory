// Weather Display Card Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../services/weatherService';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface Props {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: Props) {
  return (
    <View style={styles.card}>
      {/* Main Temperature Display */}
      <View style={styles.mainRow}>
        <View style={styles.tempSection}>
          <Text style={styles.conditionIcon}>{weather.conditionIcon}</Text>
          <Text style={styles.temperature}>{weather.temperature}°C</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
          <Text style={styles.description}>{weather.description}</Text>
        </View>
        <View style={styles.feelsSection}>
          <Text style={styles.feelsLabel}>Feels Like</Text>
          <Text style={styles.feelsValue}>{weather.feelsLike}°C</Text>
          <View style={styles.dividerV} />
          <Text style={styles.feelsLabel}>UV Index</Text>
          <Text style={styles.feelsValue}>{weather.uvIndex}</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatItem emoji="💧" label="Humidity" value={`${weather.humidity}%`} />
        <StatItem emoji="🌧️" label="Rainfall" value={`${weather.rainfall} mm`} />
        <StatItem emoji="💨" label="Wind" value={`${weather.windSpeed} m/s`} />
        <StatItem emoji="🔵" label="Pressure" value={`${weather.pressure} hPa`} />
        <StatItem emoji="👁️" label="Visibility" value={`${weather.visibility} km`} />
        <StatItem emoji="📍" label="Region" value={weather.location.split(',')[0]} />
      </View>

      {/* Sun times */}
      <View style={styles.sunRow}>
        <View style={styles.sunItem}>
          <Text style={styles.sunIcon}>🌅</Text>
          <Text style={styles.sunLabel}>Sunrise</Text>
          <Text style={styles.sunValue}>{weather.sunrise}</Text>
        </View>
        <View style={styles.sunDivider} />
        <View style={styles.sunItem}>
          <Text style={styles.sunIcon}>🌇</Text>
          <Text style={styles.sunLabel}>Sunset</Text>
          <Text style={styles.sunValue}>{weather.sunset}</Text>
        </View>
      </View>
    </View>
  );
}

function StatItem({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tempSection: {
    flex: 1,
    alignItems: 'center',
  },
  conditionIcon: {
    fontSize: 52,
    marginBottom: 4,
  },
  temperature: {
    fontSize: Typography.xxl + 4,
    fontWeight: Typography.extraBold,
    color: Colors.white,
    lineHeight: 40,
  },
  condition: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: Colors.white,
  },
  description: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  feelsSection: {
    alignItems: 'center',
    paddingLeft: Spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: Colors.whiteAlpha20,
  },
  feelsLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  feelsValue: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  dividerV: {
    height: 1,
    width: 40,
    backgroundColor: Colors.whiteAlpha20,
    marginVertical: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  statItem: {
    width: '30%',
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  statValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  sunRow: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  sunItem: {
    flex: 1,
    alignItems: 'center',
  },
  sunIcon: {
    fontSize: 22,
  },
  sunLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  sunValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.white,
  },
  sunDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.whiteAlpha20,
  },
});
