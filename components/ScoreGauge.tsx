// Favorability Score Gauge
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface Props {
  score: number; // 0–100
  status: 'Favorable' | 'Moderate' | 'Unfavorable';
  cropName: string;
}

export default function ScoreGauge({ score, status, cropName }: Props) {
  const statusConfig = {
    Favorable:   { color: '#4caf50', emoji: '🌟' },
    Moderate:    { color: '#ff9800', emoji: '⚡' },
    Unfavorable: { color: '#f44336', emoji: '⚠️' },
  };

  const config = statusConfig[status];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{config.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>Crop Favorability Score</Text>
          <Text style={styles.crop}>{cropName}</Text>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreNum, { color: config.color }]}>{score}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${score}%` as any, backgroundColor: config.color }]} />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.status, { color: config.color }]}>{status} Conditions</Text>
        <Text style={styles.tip}>
          {score >= 70
            ? 'Proceed with normal farming operations.'
            : score >= 45
            ? 'Take precautionary measures as advised.'
            : 'Immediate action required. See advisories below.'}
        </Text>
      </View>
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
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  crop: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  scoreCircle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  scoreNum: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extraBold,
  },
  scoreMax: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    marginTop: 8,
  },
  barBg: {
    height: 10,
    backgroundColor: Colors.whiteAlpha20,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  barFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  footer: {
    gap: 4,
  },
  status: {
    fontSize: Typography.base,
    fontWeight: Typography.semiBold,
  },
  tip: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
});
