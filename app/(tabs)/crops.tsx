// Crop Database Tab
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CROP_DATABASE, CropConditions } from '../../constants/crops';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

export default function CropsTab() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState<CropConditions | null>(null);

  return (
    <LinearGradient
      colors={['#1a4a1e', '#2e7d32', '#2a9d8f', '#1e5fa8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🌿 Crop Database</Text>
        <Text style={styles.subtitle}>Ideal growing conditions for Tamil Nadu crops</Text>

        {/* Crop Grid */}
        <View style={styles.grid}>
          {CROP_DATABASE.map((crop) => (
            <Pressable
              key={crop.name}
              style={({ pressed }) => [
                styles.cropCard,
                pressed && { opacity: 0.85 },
                user?.crop === crop.name && styles.cropCardActive,
                selectedCrop?.name === crop.name && styles.cropCardSelected,
              ]}
              onPress={() => setSelectedCrop(selectedCrop?.name === crop.name ? null : crop)}
            >
              <Text style={styles.cropEmoji}>{crop.emoji}</Text>
              <Text style={[styles.cropName, user?.crop === crop.name && styles.cropNameActive]}>
                {crop.name}
              </Text>
              {user?.crop === crop.name && (
                <View style={styles.yourCropBadge}>
                  <Text style={styles.yourCropText}>Your Crop</Text>
                </View>
              )}
              <Text style={styles.cropSeason}>{crop.season}</Text>
            </Pressable>
          ))}
        </View>

        {/* Crop Detail */}
        {selectedCrop && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailEmoji}>{selectedCrop.emoji}</Text>
              <View style={styles.detailTitleBlock}>
                <Text style={styles.detailName}>{selectedCrop.name}</Text>
                <Text style={styles.detailSeason}>{selectedCrop.season}</Text>
              </View>
            </View>

            <Text style={styles.detailDesc}>{selectedCrop.description}</Text>

            {/* Conditions Table */}
            <Text style={styles.conditionsTitle}>Ideal Growing Conditions</Text>
            <View style={styles.conditionsGrid}>
              <CondRow emoji="🌡️" label="Temperature" value={`${selectedCrop.tempMin}°C – ${selectedCrop.tempMax}°C`} sub={`Ideal: ${selectedCrop.tempIdeal}°C`} />
              <CondRow emoji="💧" label="Humidity" value={`${selectedCrop.humidityMin}% – ${selectedCrop.humidityMax}%`} />
              <CondRow emoji="🌧️" label="Rainfall" value={`${selectedCrop.rainfallMin} – ${selectedCrop.rainfallMax} mm/mo`} />
              <CondRow emoji="💨" label="Wind Speed" value={`Max ${selectedCrop.windMax} m/s`} />
            </View>

            {/* Risk Conditions */}
            <Text style={styles.conditionsTitle}>Risk Conditions</Text>
            <View style={styles.risksList}>
              {selectedCrop.risks.map((risk, i) => (
                <View key={i} style={styles.riskItem}>
                  <Text style={styles.riskDot}>⚠️</Text>
                  <Text style={styles.riskText}>{risk}</Text>
                </View>
              ))}
            </View>

            {/* Suitable Regions */}
            <Text style={styles.conditionsTitle}>Suitable Tamil Nadu Regions</Text>
            <View style={styles.regionsList}>
              {selectedCrop.suitableRegions.map((r, i) => (
                <View key={i} style={styles.regionChip}>
                  <Text style={styles.regionText}>📍 {r}</Text>
                </View>
              ))}
            </View>

            <Pressable style={styles.closeDetailBtn} onPress={() => setSelectedCrop(null)}>
              <Text style={styles.closeDetailText}>Close</Text>
            </Pressable>
          </View>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>About the Crop Database</Text>
          <Text style={styles.infoText}>
            This database contains ideal condition parameters for 7 major Tamil Nadu crops.
            The rule-based advisory engine compares your current weather data against these
            parameters to generate actionable farming recommendations.
          </Text>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </LinearGradient>
  );
}

function CondRow({ emoji, label, value, sub }: { emoji: string; label: string; value: string; sub?: string }) {
  return (
    <View style={condStyles.row}>
      <Text style={condStyles.emoji}>{emoji}</Text>
      <View style={condStyles.content}>
        <Text style={condStyles.label}>{label}</Text>
        {sub ? <Text style={condStyles.sub}>{sub}</Text> : null}
      </View>
      <Text style={condStyles.value}>{value}</Text>
    </View>
  );
}

const condStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlpha10,
    gap: Spacing.sm,
  },
  emoji: { fontSize: 20, width: 28 },
  content: { flex: 1 },
  label: { fontSize: Typography.sm, color: Colors.textSecondary },
  sub: { fontSize: Typography.xs, color: Colors.textMuted },
  value: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.white },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md },
  title: { fontSize: Typography.xl + 2, fontWeight: Typography.extraBold, color: Colors.white, marginBottom: 4 },
  subtitle: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  cropCard: {
    width: '31%',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  cropCardActive: { borderColor: '#4caf50', backgroundColor: 'rgba(76,175,80,0.15)' },
  cropCardSelected: { borderColor: '#81d4fa', backgroundColor: 'rgba(129,212,250,0.12)' },
  cropEmoji: { fontSize: 32, marginBottom: 4 },
  cropName: { fontSize: Typography.xs, fontWeight: Typography.semiBold, color: Colors.textSecondary, textAlign: 'center' },
  cropNameActive: { color: '#a5d6a7' },
  yourCropBadge: {
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderRadius: Radius.full,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: 2,
    marginBottom: 2,
  },
  yourCropText: { fontSize: 8, color: '#a5d6a7', fontWeight: Typography.bold },
  cropSeason: { fontSize: 8, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  detailCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    marginBottom: Spacing.lg,
  },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  detailEmoji: { fontSize: 50 },
  detailTitleBlock: { flex: 1 },
  detailName: { fontSize: Typography.xl, fontWeight: Typography.extraBold, color: Colors.white },
  detailSeason: { fontSize: Typography.xs, color: Colors.textMuted },
  detailDesc: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  conditionsTitle: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.white, marginBottom: Spacing.sm, marginTop: Spacing.md },
  conditionsGrid: { marginBottom: Spacing.sm },
  risksList: { gap: 6, marginBottom: Spacing.sm },
  riskItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  riskDot: { fontSize: 14 },
  riskText: { fontSize: Typography.sm, color: '#ffcc80', flex: 1 },
  regionsList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  regionChip: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  regionText: { fontSize: Typography.xs, color: Colors.textSecondary },
  closeDetailBtn: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    marginTop: Spacing.sm,
  },
  closeDetailText: { color: Colors.textSecondary, fontSize: Typography.sm },
  infoBox: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    marginBottom: Spacing.md,
  },
  infoTitle: { fontSize: Typography.sm, fontWeight: Typography.semiBold, color: Colors.white, marginBottom: 6 },
  infoText: { fontSize: Typography.xs, color: Colors.textMuted, lineHeight: 18 },
});
