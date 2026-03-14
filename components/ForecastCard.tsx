// 5-Day Weather Forecast Card
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ForecastDay } from '../services/weatherService';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface Props {
  forecast: ForecastDay[];
}

export default function ForecastCard({ forecast }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {forecast.map((day, index) => (
            <View key={index} style={styles.dayCard}>
              <Text style={styles.dayDate}>{day.date}</Text>
              <Text style={styles.dayIcon}>{day.conditionIcon}</Text>
              <Text style={styles.dayCondition}>{day.condition}</Text>
              <View style={styles.tempRow}>
                <Text style={styles.tempHigh}>{day.tempHigh}°</Text>
                <Text style={styles.tempLow}>{day.tempLow}°</Text>
              </View>
              <Text style={styles.dayHumidity}>💧 {day.humidity}%</Text>
              {day.rainfall > 0 && (
                <Text style={styles.dayRain}>🌧️ {day.rainfall}mm</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dayCard: {
    width: 90,
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  dayDate: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  dayIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  dayCondition: {
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 6,
  },
  tempRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  tempHigh: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  tempLow: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
  dayHumidity: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  dayRain: {
    fontSize: Typography.xs,
    color: '#64b5f6',
    marginTop: 2,
  },
});
