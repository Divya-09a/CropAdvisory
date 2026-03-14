// Farmer Login Page
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginFarmer } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';

export default function LoginPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const user = await loginFarmer(email.trim(), password);
      setUser(user);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (which: 1 | 2) => {
    if (which === 1) {
      setEmail('ravi@farmer.com');
      setPassword('123456');
    } else {
      setEmail('meena@farmer.com');
      setPassword('123456');
    }
    setError('');
  };

  return (
    <LinearGradient
      colors={['#1a4a1e', '#2e7d32', '#2a9d8f', '#1e5fa8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🌾</Text>
            <Text style={styles.headerTitle}>Farmer Login</Text>
            <Text style={styles.headerSub}>Sign in to access your crop advisory dashboard</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Demo Buttons */}
            <View style={styles.demoSection}>
              <Text style={styles.demoLabel}>Quick Fill Demo Account:</Text>
              <View style={styles.demoRow}>
                <Pressable style={styles.demoBtn} onPress={() => fillDemo(1)}>
                  <Text style={styles.demoBtnText}>Ravi (Rice Farmer)</Text>
                </Pressable>
                <Pressable style={styles.demoBtn} onPress={() => fillDemo(2)}>
                  <Text style={styles.demoBtnText}>Meena (Sugarcane)</Text>
                </Pressable>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📧 Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔒 Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#4caf50', '#2e7d32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtnGradient}
              >
                <Text style={styles.loginBtnText}>
                  {isLoading ? 'Signing In...' : '🌱 Sign In to Dashboard'}
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.registerRow}>
              <Text style={styles.registerText}>New farmer? </Text>
              <Pressable onPress={() => router.push('/register')}>
                <Text style={styles.registerLink}>Create Account</Text>
              </Pressable>
            </View>
          </View>

          {/* System Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Weather-Based Crop Advisory System</Text>
            <Text style={styles.infoText}>
              Rule-Based Logic • Real-Time Weather • Tamil Nadu Districts
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerEmoji: { fontSize: 60, marginBottom: Spacing.sm },
  headerTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extraBold,
    color: Colors.white,
    marginBottom: 6,
  },
  headerSub: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  demoSection: {
    backgroundColor: 'rgba(255,235,59,0.1)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.25)',
  },
  demoLabel: {
    fontSize: Typography.xs,
    color: '#fff176',
    fontWeight: Typography.semiBold,
    marginBottom: Spacing.sm,
  },
  demoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,235,59,0.15)',
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.3)',
  },
  demoBtnText: {
    fontSize: Typography.xs,
    color: '#fff9c4',
    fontWeight: Typography.medium,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.4)',
  },
  errorText: {
    color: '#ff8a80',
    fontSize: Typography.sm,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.white,
    fontSize: Typography.base,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  eyeBtn: {
    padding: Spacing.sm,
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  eyeIcon: { fontSize: 18 },
  loginBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.button,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginBtnText: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: Colors.textMuted,
    fontSize: Typography.sm,
  },
  registerLink: {
    color: '#81d4fa',
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
  },
  infoBox: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semiBold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  infoText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
