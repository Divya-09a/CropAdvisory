// Risk Alert Banner Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface Props {
  alerts: string[];
}

export default function RiskAlertBanner({ alerts }: Props) {
  if (!alerts.length) {
    return (
      <View style={[styles.container, styles.safe]}>
        <Text style={styles.safeText}>✅ No Active Risk Alerts — Conditions are favorable!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚨 Active Risk Alerts</Text>
      {alerts.map((alert, i) => (
        <View key={i} style={styles.alertItem}>
          <View style={styles.dot} />
          <Text style={styles.alertText}>{alert}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.4)',
    marginBottom: Spacing.md,
  },
  safe: {
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderColor: 'rgba(76,175,80,0.4)',
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: '#f44336',
    marginBottom: Spacing.sm,
  },
  safeText: {
    fontSize: Typography.sm,
    color: '#81c784',
    fontWeight: Typography.medium,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f44336',
  },
  alertText: {
    fontSize: Typography.sm,
    color: '#ffcdd2',
    flex: 1,
  },
});
