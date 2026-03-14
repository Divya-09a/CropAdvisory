// Landing Page — Weather-Based Crop Advisory System
import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions,
  ScrollView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  const features = [
    { emoji: '🌤️', title: 'Real-Time Weather', desc: 'Live weather data for your Tamil Nadu district' },
    { emoji: '🌾', title: 'Rule-Based Advisory', desc: 'Crop guidance using proven agricultural rules' },
    { emoji: '⚠️', title: 'Risk Alerts', desc: 'Early warnings for temperature, humidity and rainfall' },
    { emoji: '📊', title: 'Crop Database', desc: '7 major crops with ideal condition parameters' },
  ];

  const stats = [
    { value: '20', label: 'Districts' },
    { value: '7', label: 'Crops' },
    { value: '15+', label: 'Rules' },
    { value: '100%', label: 'Free' },
  ];

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
        {/* Header Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🎓 Academic Project 2024</Text>
          </View>
        </View>

        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image
            source={require('../assets/images/hero-farm.png')}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['transparent', 'rgba(30,95,168,0.7)']}
            style={styles.heroOverlay}
          />
        </View>

        {/* Hero Text */}
        <View style={styles.heroSection}>
          <Text style={styles.headline}>
            Smart Farming Starts with Knowing Your Weather
          </Text>
          <Text style={styles.subtext}>
            Get real-time rule-based crop advisories based on weather conditions in your region.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push('/register')}
          >
            <LinearGradient
              colors={['#4caf50', '#2e7d32']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnPrimaryText}>🌱 Get Started</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.btnSecondaryText}>🔑 Farmer Login</Text>
          </Pressable>
        </View>

        {/* Demo Credentials */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>📋 Demo Credentials</Text>
          <Text style={styles.demoText}>Email: ravi@farmer.com  |  Password: 123456</Text>
          <Text style={styles.demoText}>Email: meena@farmer.com  |  Password: 123456</Text>
        </View>

        {/* Feature Cards */}
        <Text style={styles.sectionTitle}>What You Get</Text>
        <View style={styles.featuresGrid}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
          <Text style={styles.footerText}>
            Weather-Based Crop Advisory System for Farmers
          </Text>
          <Text style={styles.footerSub}>
            Tamil Nadu Agriculture Department • Final Year Project
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: Colors.whiteAlpha20,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  badgeText: {
    fontSize: Typography.xs,
    color: Colors.white,
    fontWeight: Typography.medium,
  },
  heroImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headline: {
    fontSize: Typography.xl + 2,
    fontWeight: Typography.extraBold,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing.md,
  },
  subtext: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: Typography.extraBold,
    color: '#a5d6a7',
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  buttonGroup: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  btnPrimary: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    ...Shadows.button,
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  btnSecondary: {
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.whiteAlpha60,
    backgroundColor: Colors.whiteAlpha10,
  },
  btnSecondaryText: {
    fontSize: Typography.md,
    fontWeight: Typography.semiBold,
    color: Colors.white,
  },
  demoBox: {
    backgroundColor: 'rgba(255,235,59,0.12)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.3)',
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: '#fff176',
    marginBottom: 6,
  },
  demoText: {
    fontSize: Typography.xs,
    color: '#fff9c4',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  featureCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  featureEmoji: {
    fontSize: 30,
    marginBottom: Spacing.sm,
  },
  featureTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.whiteAlpha20,
  },
  footerText: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerSub: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
