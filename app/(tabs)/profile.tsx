// Farmer Profile Tab
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  const cropInfo = CROP_DATABASE.find(c => c.name === user?.crop);
  const districtInfo = TAMIL_NADU_DISTRICTS.find(d => d.name === user?.location);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  if (!user) return null;

  const registeredDate = new Date(user.registeredAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

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
        {/* Avatar & Name */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👨‍🌾</Text>
          </View>
          <Text style={styles.farmerName}>{user.name}</Text>
          <Text style={styles.farmerEmail}>{user.email}</Text>
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>🌱 Registered Farmer</Text>
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoCard}>
            <InfoRow emoji="👤" label="Full Name" value={user.name} />
            <InfoRow emoji="📧" label="Email" value={user.email} />
            <InfoRow emoji="🎂" label="Age" value={`${user.age} years`} />
            <InfoRow emoji="📅" label="Registered On" value={registeredDate} />
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Location</Text>
          <View style={styles.infoCard}>
            <InfoRow emoji="📍" label="District" value={user.location} />
            <InfoRow emoji="🗺️" label="State" value="Tamil Nadu, India" />
            {districtInfo && (
              <>
                <InfoRow emoji="🌱" label="Agro-Zone" value={districtInfo.region} />
                <InfoRow emoji="🌐" label="Coordinates" value={`${districtInfo.lat.toFixed(4)}°N, ${districtInfo.lon.toFixed(4)}°E`} />
              </>
            )}
          </View>
        </View>

        {/* Crop Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crop Details</Text>
          <View style={styles.infoCard}>
            {cropInfo && (
              <>
                <InfoRow emoji={cropInfo.emoji} label="Crop" value={cropInfo.name} />
                <InfoRow emoji="📅" label="Season" value={cropInfo.season} />
                <InfoRow emoji="🌡️" label="Ideal Temp" value={`${cropInfo.tempMin}°C – ${cropInfo.tempMax}°C`} />
                <InfoRow emoji="💧" label="Ideal Humidity" value={`${cropInfo.humidityMin}% – ${cropInfo.humidityMax}%`} />
                <InfoRow emoji="🌧️" label="Rainfall Need" value={`${cropInfo.rainfallMin}–${cropInfo.rainfallMax} mm/mo`} />
              </>
            )}
          </View>
        </View>

        {/* System Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Information</Text>
          <View style={styles.systemCard}>
            <Text style={styles.systemTitle}>Weather-Based Crop Advisory System</Text>
            <Text style={styles.systemItem}>📱 Platform: Mobile App (React Native)</Text>
            <Text style={styles.systemItem}>🔬 Advisory Method: Rule-Based Logic</Text>
            <Text style={styles.systemItem}>🌤️ Weather: OpenWeatherMap API</Text>
            <Text style={styles.systemItem}>💾 Storage: Local (AsyncStorage)</Text>
            <Text style={styles.systemItem}>📍 Coverage: Tamil Nadu, India</Text>
            <Text style={styles.systemItem}>🌾 Crops: 7 Major Varieties</Text>
            <Text style={styles.systemItem}>📊 Districts: 20 Tamil Nadu Districts</Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </Pressable>

        <View style={{ height: insets.bottom + Spacing.xxl }} />
      </ScrollView>
    </LinearGradient>
  );
}

function InfoRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.emoji}>{emoji}</Text>
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
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlpha10,
    gap: Spacing.sm,
  },
  emoji: { fontSize: 18, width: 28 },
  content: { flex: 1 },
  label: { fontSize: Typography.xs, color: Colors.textMuted },
  value: { fontSize: Typography.sm, color: Colors.white, fontWeight: Typography.medium },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlpha20,
  },
  avatar: {
    width: 90, height: 90,
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4caf50',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  avatarEmoji: { fontSize: 42 },
  farmerName: { fontSize: Typography.xl, fontWeight: Typography.extraBold, color: Colors.white, marginBottom: 4 },
  farmerEmail: { fontSize: Typography.sm, color: Colors.textSecondary, marginBottom: Spacing.sm },
  memberBadge: {
    backgroundColor: 'rgba(76,175,80,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.4)',
  },
  memberBadgeText: { fontSize: Typography.xs, color: '#a5d6a7', fontWeight: Typography.semiBold },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: Typography.base, fontWeight: Typography.bold, color: Colors.white, marginBottom: Spacing.sm },
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  systemCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    gap: 8,
  },
  systemTitle: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.white, marginBottom: 6 },
  systemItem: { fontSize: Typography.xs, color: Colors.textSecondary },
  logoutBtn: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: Radius.full,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.4)',
    marginBottom: Spacing.md,
  },
  logoutText: { fontSize: Typography.base, fontWeight: Typography.semiBold, color: '#ff8a80' },
});
