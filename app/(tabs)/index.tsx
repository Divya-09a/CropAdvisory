// Farmer Dashboard — Main Tab
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useWeather } from '../../hooks/useWeather';
import WeatherCard from '../../components/WeatherCard';
import ForecastCard from '../../components/ForecastCard';
import ScoreGauge from '../../components/ScoreGauge';
import RiskAlertBanner from '../../components/RiskAlertBanner';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

export default function DashboardTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { weather, forecast, advisory, isLoading, error, lastUpdated, refresh } =
    useWeather(user?.location || '', user?.crop || '');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || !user) {
    return (
      <LinearGradient colors={['#1a4a1e', '#2e7d32', '#1e5fa8']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  const cropEmoji = getCropEmoji(user.crop);

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
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#fff" />
        }
      >
        {/* Greeting Header */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingText}>
            <Text style={styles.greeting}>{getGreeting()}, {user.name.split(' ')[0]}! 👋</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <Pressable style={styles.refreshBtn} onPress={refresh}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </Pressable>
        </View>

        {/* Farmer Info Card */}
        <View style={styles.farmerCard}>
          <View style={styles.farmerRow}>
            <View style={styles.farmerAvatar}>
              <Text style={styles.avatarEmoji}>👨‍🌾</Text>
            </View>
            <View style={styles.farmerDetails}>
              <Text style={styles.farmerName}>{user.name}</Text>
              <Text style={styles.farmerMeta}>Age: {user.age} years • {user.location}</Text>
              <View style={styles.cropBadge}>
                <Text style={styles.cropBadgeText}>{cropEmoji} Growing: {user.crop}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Last Updated */}
        {lastUpdated && (
          <Text style={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
          </Text>
        )}

        {/* Risk Alerts */}
        {advisory && (
          <RiskAlertBanner alerts={advisory.riskAlerts} />
        )}

        {/* Favorability Score */}
        {advisory && (
          <ScoreGauge
            score={advisory.score}
            status={advisory.overallStatus}
            cropName={user.crop}
          />
        )}

        {/* Weather Card */}
        <Text style={styles.sectionTitle}>Current Weather</Text>
        {isLoading && !weather ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Fetching weather data for {user.location}...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <Pressable style={styles.retryBtn} onPress={refresh}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : weather ? (
          <WeatherCard weather={weather} />
        ) : null}

        {/* Advisory Preview */}
        {advisory && (
          <View style={styles.advisoryPreview}>
            <Text style={styles.sectionTitle}>Top Advisory</Text>
            <View style={styles.topAdvisoryCard}>
              <Text style={styles.topAdvisoryStatus}>
                {advisory.overallStatus === 'Favorable' ? '✅' :
                 advisory.overallStatus === 'Moderate' ? '⚠️' : '🚨'} {advisory.overallStatus} Conditions
              </Text>
              <Text style={styles.topAdvisoryText}>
                {advisory.advisories[0]?.message || 'No advisory generated.'}
              </Text>
              <Pressable style={styles.viewAllBtn} onPress={() => router.push('/(tabs)/advisory')}>
                <Text style={styles.viewAllText}>View Full Advisory Report →</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <View style={styles.forecastSection}>
            <Text style={styles.sectionTitle}>Weather Forecast</Text>
            <ForecastCard forecast={forecast} />
          </View>
        )}

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickLinks}>
          <QuickLink emoji="📋" title="Full Advisory" desc="All rules & actions" onPress={() => router.push('/(tabs)/advisory')} />
          <QuickLink emoji="🌾" title="Crop Database" desc="All 7 crops" onPress={() => router.push('/(tabs)/crops')} />
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </LinearGradient>
  );
}

function QuickLink({ emoji, title, desc, onPress }: { emoji: string; title: string; desc: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.quickLinkCard, pressed && { opacity: 0.8 }]}
    >
      <Text style={styles.quickLinkEmoji}>{emoji}</Text>
      <Text style={styles.quickLinkTitle}>{title}</Text>
      <Text style={styles.quickLinkDesc}>{desc}</Text>
    </Pressable>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getCropEmoji(cropName: string): string {
  const map: Record<string, string> = {
    Rice: '🌾', Wheat: '🌽', Sugarcane: '🎋',
    Cotton: '☁️', Maize: '🌽', Groundnut: '🥜', Banana: '🍌',
  };
  return map[cropName] || '🌿';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  greetingText: { flex: 1 },
  greeting: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.white },
  date: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  refreshBtn: {
    width: 44, height: 44,
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  refreshIcon: { fontSize: 18 },
  farmerCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    marginBottom: Spacing.md,
  },
  farmerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  farmerAvatar: {
    width: 60, height: 60,
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
  },
  avatarEmoji: { fontSize: 28 },
  farmerDetails: { flex: 1 },
  farmerName: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.white },
  farmerMeta: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  cropBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(76,175,80,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.4)',
  },
  cropBadgeText: { fontSize: Typography.xs, color: '#a5d6a7', fontWeight: Typography.medium },
  lastUpdated: { fontSize: Typography.xs, color: Colors.textMuted, marginBottom: Spacing.sm, textAlign: 'right' },
  sectionTitle: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.white, marginBottom: Spacing.md, marginTop: Spacing.sm },
  loadingCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    marginBottom: Spacing.md,
  },
  loadingText: { color: Colors.textSecondary, fontSize: Typography.sm, textAlign: 'center' },
  errorCard: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.4)',
    marginBottom: Spacing.md,
  },
  errorText: { color: '#ff8a80', fontSize: Typography.sm, marginBottom: Spacing.md, textAlign: 'center' },
  retryBtn: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  retryText: { color: Colors.white, fontSize: Typography.sm, fontWeight: Typography.semiBold },
  advisoryPreview: { marginTop: Spacing.md },
  topAdvisoryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  topAdvisoryStatus: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.white, marginBottom: Spacing.sm },
  topAdvisoryText: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
  viewAllBtn: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  viewAllText: { color: '#81d4fa', fontSize: Typography.sm, fontWeight: Typography.semiBold },
  forecastSection: { marginTop: Spacing.sm },
  quickLinks: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  quickLinkCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    alignItems: 'center',
  },
  quickLinkEmoji: { fontSize: 28, marginBottom: Spacing.sm },
  quickLinkTitle: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.white, textAlign: 'center' },
  quickLinkDesc: { fontSize: Typography.xs, color: Colors.textMuted, textAlign: 'center' },
});
