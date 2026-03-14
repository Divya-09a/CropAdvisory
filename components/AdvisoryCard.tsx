// Crop Advisory Display Card
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Advisory } from '../services/advisoryService';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface Props {
  advisory: Advisory;
}

const typeConfig = {
  success: { color: '#4caf50', bg: 'rgba(76,175,80,0.15)', emoji: '✅', border: '#4caf50' },
  warning: { color: '#ff9800', bg: 'rgba(255,152,0,0.15)', emoji: '⚠️', border: '#ff9800' },
  danger:  { color: '#f44336', bg: 'rgba(244,67,54,0.15)', emoji: '🚨', border: '#f44336' },
  info:    { color: '#2196f3', bg: 'rgba(33,150,243,0.15)', emoji: 'ℹ️', border: '#2196f3' },
};

export default function AdvisoryCard({ advisory }: Props) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[advisory.type];

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: config.bg, borderColor: config.border },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.typeEmoji}>{config.emoji}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.category, { color: config.color }]}>{advisory.category}</Text>
          <Text style={styles.message}>{advisory.message}</Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {expanded && (
        <View style={[styles.actionContainer, { borderTopColor: config.border }]}>
          <Text style={styles.actionLabel}>Recommended Action:</Text>
          <Text style={styles.actionText}>{advisory.action}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  typeEmoji: {
    fontSize: 20,
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  category: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  message: {
    fontSize: Typography.sm,
    color: Colors.white,
    lineHeight: 18,
  },
  chevron: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionContainer: {
    borderTopWidth: 1,
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  actionLabel: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
