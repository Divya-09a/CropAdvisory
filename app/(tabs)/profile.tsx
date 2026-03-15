// Farmer Profile Tab — with working logout
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Modal, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { CROP_DATABASE } from '../../constants/crops';
import { TAMIL_NADU_DISTRICTS } from '../../constants/locations';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/theme';

export default function ProfileTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const cropInfo = CROP_DATABASE.find(c => c.name === user?.crop);
  const districtInfo = TAMIL_NADU_DISTRICTS.find(d => d.name === user?.location);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      router.replace('/');
    } catch {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  if (!user) return null;

  const registeredDate = user.registeredAt
    ? new Date(user.registeredAt).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

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
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Profile</Text>
        </View>

        {/* Avatar & Name Hero */}
        <LinearGradient
          colors={['rgba(76,175,80,0.25)', 'rgba(42,157,143,0.15)']}
          style={styles.profileHero}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👨‍🌾</Text>
          </View>
          <Text style={styles.farmerName}>{user.name}</Text>
          <Text style={styles.farmerEmail}>{user.email}</Text>
          <View style={styles.memberBadge}>
            <MaterialIcons name="verified" size={14} color="#81c784" />
            <Text style={styles.memberBadgeText}>Registered Farmer</Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatChip emoji="🎂" value={`${user.age} yrs`} label="Age" />
          <StatChip emoji="📍" value={user.location} label="District" />
          <StatChip emoji={cropInfo?.emoji || '🌿'} value={user.crop} label="Crop" />
        </View>

        {/* Personal Info */}
        <SectionCard title="Personal Information" icon="person">
          <InfoRow icon="person" label="Full Name" value={user.name} />
          <InfoRow icon="email" label="Email Address" value={user.email} />
          <InfoRow icon="cake" label="Age" value={`${user.age} years old`} />
          <InfoRow icon="calendar-today" label="Registered On" value={registeredDate} last />
        </SectionCard>

        {/* Farm Location */}
        <SectionCard title="Farm Location" icon="location-on">
          <InfoRow icon="location-city" label="District" value={user.location} />
          <InfoRow icon="map" label="State" value="Tamil Nadu, India" />
          {districtInfo && (
            <>
              <InfoRow icon="eco" label="Agro-Zone" value={districtInfo.region} />
              <InfoRow icon="explore" label="Coordinates"
                value={`${districtInfo.lat.toFixed(3)}°N, ${districtInfo.lon.toFixed(3)}°E`} last />
            </>
          )}
        </SectionCard>

        {/* Crop Details */}
        <SectionCard title="Crop Details" icon="grass">
          {cropInfo && (
            <>
              <InfoRow icon="local-florist" label="Crop Name" value={`${cropInfo.emoji} ${cropInfo.name}`} />
              <InfoRow icon="wb-sunny" label="Season" value={cropInfo.season} />
              <InfoRow icon="thermostat" label="Ideal Temperature" value={`${cropInfo.tempMin}°C – ${cropInfo.tempMax}°C`} />
              <InfoRow icon="water-drop" label="Ideal Humidity" value={`${cropInfo.humidityMin}% – ${cropInfo.humidityMax}%`} />
              <InfoRow icon="umbrella" label="Rainfall Needed" value={`${cropInfo.rainfallMin}–${cropInfo.rainfallMax} mm/mo`} last />
            </>
          )}
        </SectionCard>

        {/* System Info */}
        <SectionCard title="System Information" icon="info">
          <InfoRow icon="phone-android" label="Platform" value="Mobile App (React Native)" />
          <InfoRow icon="psychology" label="Advisory Engine" value="Rule-Based Logic" />
          <InfoRow icon="cloud" label="Weather Source" value="OpenWeatherMap API" />
          <InfoRow icon="storage" label="Database" value="Supabase (PostgreSQL)" />
          <InfoRow icon="school" label="Academic Year" value="Final Year Project 2026" />
          <InfoRow icon="place" label="Coverage" value="Tamil Nadu, India" />
          <InfoRow icon="grass" label="Crops Covered" value="7 Major Varieties" />
          <InfoRow icon="location-on" label="Districts" value="20 Tamil Nadu Districts" last />
        </SectionCard>

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
          onPress={() => setShowLogoutModal(true)}
        >
          <MaterialIcons name="logout" size={20} color="#ff8a80" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: insets.bottom + Spacing.xxl }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.dialog}>
            <View style={modalStyles.iconCircle}>
              <MaterialIcons name="logout" size={32} color="#ff8a80" />
            </View>
            <Text style={modalStyles.title}>Sign Out?</Text>
            <Text style={modalStyles.message}>
              You will be redirected to the login screen. Your data is safely stored in the database.
            </Text>
            <View style={modalStyles.actions}>
              <Pressable
                style={[modalStyles.btn, modalStyles.cancelBtn]}
                onPress={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
              >
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[modalStyles.btn, modalStyles.logoutConfirmBtn, isLoggingOut && { opacity: 0.7 }]}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                <Text style={modalStyles.logoutConfirmText}>
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name={icon} size={16} color="rgba(255,255,255,0.6)" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.infoCard}>{children}</View>
    </View>
  );
}

function StatChip({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  return (
    <View style={[infoStyles.row, last && { borderBottomWidth: 0 }]}>
      <MaterialIcons name={icon} size={16} color="rgba(255,255,255,0.4)" style={infoStyles.icon} />
      <View style={infoStyles.content}>
        <Text style={infoStyles.label}>{label}</Text>
        <Text style={infoStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  icon: { width: 20 },
  content: { flex: 1 },
  label: { fontSize: Typography.xs, color: Colors.textMuted, marginBottom: 2 },
  value: { fontSize: Typography.sm, color: Colors.white, fontWeight: '500' },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  dialog: {
    backgroundColor: '#1a3a2a',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  iconCircle: {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  btn: {
    flex: 1,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelText: { color: Colors.textSecondary, fontWeight: '600', fontSize: Typography.base },
  logoutConfirmBtn: {
    backgroundColor: 'rgba(244,67,54,0.8)',
  },
  logoutConfirmText: { color: Colors.white, fontWeight: '700', fontSize: Typography.base },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md },
  pageHeader: {
    marginBottom: Spacing.md,
  },
  pageTitle: {
    fontSize: Typography.xl,
    fontWeight: '800',
    color: Colors.white,
  },
  profileHero: {
    alignItems: 'center',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.25)',
  },
  avatar: {
    width: 88, height: 88,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#4caf50',
    marginBottom: Spacing.md,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarEmoji: { fontSize: 40 },
  farmerName: { fontSize: Typography.xl, fontWeight: '800', color: Colors.white, marginBottom: 4 },
  farmerEmail: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.55)', marginBottom: Spacing.sm },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(76,175,80,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.35)',
  },
  memberBadgeText: { fontSize: Typography.xs, color: '#a5d6a7', fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statChip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: {
    fontSize: Typography.xs,
    color: Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  section: { marginBottom: Spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingLeft: 2,
  },
  sectionTitle: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(244,67,54,0.12)',
    borderRadius: Radius.full,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(244,67,54,0.35)',
  },
  logoutText: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: '#ff8a80',
    letterSpacing: 0.3,
  },
});
