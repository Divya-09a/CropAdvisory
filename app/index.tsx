// Landing Page — Weather-Based Crop Advisory System
import React, { useEffect, useState } from 'react';
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

export default function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => sub?.remove();
  }, []);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  // Responsive column count
  const isTablet = screenWidth >= 600;
  const isDesktop = screenWidth >= 1024;
  const horizontalPad = Spacing.md;
  const numCols = isDesktop ? 4 : isTablet ? 2 : 2;
  const cardGap = Spacing.sm;
  const totalGap = cardGap * (numCols - 1);
  const cardWidth = Math.max(1, (screenWidth - horizontalPad * 2 - totalGap) / numCols);

  const features = [
    { emoji: '🌤️', title: 'Real-Time Weather', desc: 'Live weather data for your Tamil Nadu district' },
    { emoji: '🌾', title: 'Rule-Based Advisory', desc: 'Crop guidance using proven agricultural rules' },
    { emoji: '⚠️', title: 'Risk Alerts', desc: 'Early warnings for temperature, humidity & rainfall' },
    { emoji: '📊', title: 'Crop Database', desc: '7 major crops with ideal growing parameters' },
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
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.md,
            paddingHorizontal: horizontalPad,
            paddingBottom: insets.bottom + Spacing.xxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🎓 Academic Project 2026</Text>
          </View>
        </View>

        {/* Hero Image */}
        <View style={[styles.heroImageContainer, { height: isTablet ? 320 : 220 }]}>
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
          <Text style={[styles.headline, isTablet && { fontSize: 28 }]}>
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
        <View style={[styles.buttonGroup, isTablet && { flexDirection: 'row', gap: Spacing.md }]}>
          <Pressable
            style={({ pressed }) => [
              styles.btnPrimary,
              isTablet && { flex: 1 },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
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
            style={({ pressed }) => [
              styles.btnSecondary,
              isTablet && { flex: 1 },
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
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

        {/* Feature Cards — "What You Get" */}
        <Text style={styles.sectionTitle}>What You Get</Text>
        <View
          style={[
            styles.featuresGrid,
            {
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: cardGap,
            },
          ]}
        >
          {features.map((f, i) => (
            <View
              key={i}
              style={[
                styles.featureCard,
                { width: cardWidth },
              ]}
            >
              <View style={styles.featureIconBox}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Project Info Section */}
        <View style={styles.projectInfoSection}>
          <Text style={styles.projectInfoTitle}>About This Project</Text>
          <View style={styles.projectInfoGrid}>
            <ProjectBadge icon="🏫" label="Type" value="Final Year Project 2026" />
            <ProjectBadge icon="💡" label="Engine" value="Rule-Based Logic" />
            <ProjectBadge icon="🗺️" label="Region" value="Tamil Nadu, India" />
            <ProjectBadge icon="⚡" label="Tech" value="React Native + Supabase" />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Weather-Based Crop Advisory System for Farmers
          </Text>
          <Text style={styles.footerSub}>
            Tamil Nadu Agriculture Department • Final Year Project 2026
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function ProjectBadge({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={projStyles.badge}>
      <Text style={projStyles.icon}>{icon}</Text>
      <Text style={projStyles.label}>{label}</Text>
      <Text style={projStyles.value}>{value}</Text>
    </View>
  );
}

const projStyles = StyleSheet.create({
  badge: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: Spacing.sm,
    alignItems: 'flex-start',
  },
  icon: { fontSize: 20, marginBottom: 4 },
  label: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  value: {
    fontSize: Typography.sm,
    color: Colors.white,
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    // paddingHorizontal and paddingTop applied inline for dynamic sizing
  },
  badgeRow: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(76,175,80,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.4)',
  },
  badgeText: {
    fontSize: Typography.xs,
    color: '#a5d6a7',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroImageContainer: {
    width: '100%',
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
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing.md,
    letterSpacing: -0.3,
  },
  subtext: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: '#a5d6a7',
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 2,
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
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  btnSecondary: {
    borderRadius: Radius.full,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  btnSecondaryText: {
    fontSize: Typography.md,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  demoBox: {
    backgroundColor: 'rgba(255,235,59,0.10)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.3)',
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: Typography.sm,
    fontWeight: '700',
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
    fontWeight: '800',
    color: Colors.white,
    marginBottom: Spacing.md,
    letterSpacing: -0.2,
  },
  featuresGrid: {
    marginBottom: Spacing.xl,
    alignItems: 'stretch',
  },
  featureCard: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    // No fixed height — equal visual weight via padding
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(76,175,80,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureTitle: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
    lineHeight: 18,
  },
  featureDesc: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 16,
  },
  projectInfoSection: {
    marginBottom: Spacing.xl,
  },
  projectInfoTitle: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  projectInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  footerText: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  footerSub: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
    textAlign: 'center',
  },
});
