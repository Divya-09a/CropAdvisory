// Full Advisory Report Tab
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useWeather } from '../../hooks/useWeather';
import AdvisoryCard from '../../components/AdvisoryCard';
import ScoreGauge from '../../components/ScoreGauge';
import RiskAlertBanner from '../../components/RiskAlertBanner';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

export default function AdvisoryTab() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const { weather, advisory, isLoading, error, lastUpdated, refresh } =
    useWeather(user?.location || '', user?.crop || '');

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌾 Crop Advisory Report</Text>
          <Text style={styles.headerSub}>
            Rule-Based Analysis for {user?.crop} in {user?.location}
          </Text>
          {lastUpdated && (
            <Text style={styles.timestamp}>
              Generated: {lastUpdated.toLocaleString('en-IN')}
            </Text>
          )}
        </View>

        {/* Weather Summary Banner */}
        {weather && (
          <View style={styles.weatherBanner}>
            <Text style={styles.weatherBannerText}>
              {weather.conditionIcon} {weather.temperature}°C • {weather.humidity}% humidity • {weather.condition}
            </Text>
          </View>
        )}

        {isLoading && !advisory ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Generating advisory report...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <Pressable onPress={refresh} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : advisory ? (
          <>
            {/* Score Gauge */}
            <ScoreGauge score={advisory.score} status={advisory.overallStatus} cropName={advisory.cropName} />

            {/* Risk Alerts */}
            <RiskAlertBanner alerts={advisory.riskAlerts} />

            {/* Advisory Cards */}
            <Text style={styles.sectionTitle}>Detailed Advisories ({advisory.advisories.length})</Text>
            <Text style={styles.tapHint}>Tap each advisory to see recommended action</Text>
            {advisory.advisories.map((adv, i) => (
              <AdvisoryCard key={i} advisory={adv} />
            ))}

            {/* Rule Engine Info */}
            <View style={styles.ruleInfo}>
              <Text style={styles.ruleInfoTitle}>ℹ️ About This Advisory</Text>
              <Text style={styles.ruleInfoText}>
                This advisory is generated using a rule-based logic engine — not AI or machine learning.
                Advisories are based on comparing current weather conditions against predefined crop condition thresholds
                established by agricultural best practices.
              </Text>
              <View style={styles.ruleList}>
                <Text style={styles.ruleItem}>• IF temp {">"} crop_max_temp → Irrigation advisory</Text>
                <Text style={styles.ruleItem}>• IF humidity {">"} max_humidity → Fungal disease warning</Text>
                <Text style={styles.ruleItem}>• IF rainfall {"<"} min_rainfall → Drought risk alert</Text>
                <Text style={styles.ruleItem}>• IF wind {">"} crop_wind_limit → Wind damage warning</Text>
              </View>
            </View>

            {/* Refresh */}
            <Pressable style={styles.refreshBtn} onPress={refresh}>
              <Text style={styles.refreshText}>🔄 Refresh Advisory</Text>
            </Pressable>
          </>
        ) : null}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md },
  header: { marginBottom: Spacing.lg },
  headerTitle: { fontSize: Typography.xl, fontWeight: Typography.extraBold, color: Colors.white, marginBottom: 4 },
  headerSub: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: 4 },
  timestamp: { fontSize: Typography.xs, color: Colors.textMuted },
  weatherBanner: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  weatherBannerText: { fontSize: Typography.sm, color: Colors.textSecondary },
  loadingCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  loadingText: { color: Colors.textSecondary, fontSize: Typography.sm },
  errorCard: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.4)',
  },
  errorText: { color: '#ff8a80', fontSize: Typography.sm, marginBottom: Spacing.md },
  retryBtn: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  retryText: { color: Colors.white, fontSize: Typography.sm, fontWeight: Typography.semiBold },
  sectionTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.white, marginBottom: Spacing.xs },
  tapHint: { fontSize: Typography.xs, color: Colors.textMuted, marginBottom: Spacing.md },
  ruleInfo: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  ruleInfoTitle: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: Colors.white, marginBottom: Spacing.sm },
  ruleInfoText: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  ruleList: { gap: 6 },
  ruleItem: { fontSize: Typography.xs, color: Colors.textMuted, fontFamily: 'SpaceMono' },
  refreshBtn: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  refreshText: { color: Colors.textSecondary, fontSize: Typography.sm, fontWeight: Typography.medium },
});
