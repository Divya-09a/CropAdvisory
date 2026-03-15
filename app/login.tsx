// Farmer Login Page — Professional UI with Supabase Auth
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
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
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0d2b10', '#1a4a1e', '#2e7d32', '#2a9d8f', '#1e5fa8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.2, y: 1 }}
      style={styles.container}
    >
      {/* Top safe area with back button */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="rgba(255,255,255,0.85)" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Brand */}
          <View style={styles.brandSection}>
            <View style={styles.logoRing}>
              <Text style={styles.logoEmoji}>🌾</Text>
            </View>
            <Text style={styles.appName}>CropAdvisory</Text>
            <Text style={styles.appTagline}>Tamil Nadu Farmer Portal</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSub}>
              Sign in to access your personalized crop advisory dashboard
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Error Banner */}
            {error ? (
              <View style={styles.errorBanner}>
                <MaterialIcons name="error-outline" size={18} color="#ff8a80" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(''); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color="rgba(255,255,255,0.5)" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(''); }}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <MaterialIcons
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={20}
                    color="rgba(255,255,255,0.5)"
                  />
                </Pressable>
              </View>
            </View>

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [styles.loginBtnWrapper, pressed && { transform: [{ scale: 0.98 }] }, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#56ab2f', '#2e7d32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtnGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name="login" size={20} color="#fff" />
                    <Text style={styles.loginBtnText}>Sign In to Dashboard</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Link */}
            <Pressable
              style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.8 }]}
              onPress={() => router.push('/register')}
            >
              <MaterialIcons name="person-add" size={18} color="rgba(255,255,255,0.8)" />
              <Text style={styles.registerBtnText}>Create New Farmer Account</Text>
            </Pressable>
          </View>

          {/* Demo Credentials */}
          <View style={styles.demoSection}>
            <View style={styles.demoHeader}>
              <MaterialIcons name="info-outline" size={16} color="#fff176" />
              <Text style={styles.demoTitle}>Demo Credentials for Testing</Text>
            </View>
            <View style={styles.demoCards}>
              <Pressable
                style={({ pressed }) => [styles.demoCard, pressed && { opacity: 0.75 }]}
                onPress={() => { setEmail('ravi@farmer.com'); setPassword('123456'); setError(''); }}
              >
                <Text style={styles.demoCardEmoji}>👨‍🌾</Text>
                <View>
                  <Text style={styles.demoCardName}>Ravi Kumar</Text>
                  <Text style={styles.demoCardCrop}>🌾 Rice • Thanjavur</Text>
                  <Text style={styles.demoCardCred}>ravi@farmer.com</Text>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.demoCard, pressed && { opacity: 0.75 }]}
                onPress={() => { setEmail('meena@farmer.com'); setPassword('123456'); setError(''); }}
              >
                <Text style={styles.demoCardEmoji}>👩‍🌾</Text>
                <View>
                  <Text style={styles.demoCardName}>Meena Devi</Text>
                  <Text style={styles.demoCardCrop}>🎋 Sugarcane • Coimbatore</Text>
                  <Text style={styles.demoCardCred}>meena@farmer.com</Text>
                </View>
              </Pressable>
            </View>
            <Text style={styles.demoPassword}>Password for both: <Text style={styles.demoPasswordValue}>123456</Text></Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Weather-Based Crop Advisory System
            </Text>
            <Text style={styles.footerSub}>
              Rule-Based Logic • Tamil Nadu Agriculture • Final Year Project
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: Typography.base,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: 8,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(76,175,80,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#4caf50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  logoEmoji: { fontSize: 42 },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  welcomeSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.35)',
  },
  errorText: { color: '#ff8a80', fontSize: Typography.sm, flex: 1, lineHeight: 18 },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    minHeight: 52,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: Typography.base,
    paddingVertical: 14,
  },
  eyeBtn: { padding: 4 },
  loginBtnWrapper: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    shadowColor: '#2e7d32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  loginBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  loginBtnText: {
    fontSize: Typography.md,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dividerText: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '600',
    letterSpacing: 1,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  registerBtnText: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  demoSection: {
    backgroundColor: 'rgba(255,235,59,0.08)',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.2)',
    marginBottom: Spacing.lg,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  demoTitle: {
    fontSize: Typography.sm,
    color: '#fff176',
    fontWeight: '700',
  },
  demoCards: { gap: Spacing.sm },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,235,59,0.2)',
  },
  demoCardEmoji: { fontSize: 30 },
  demoCardName: {
    fontSize: Typography.base,
    color: Colors.white,
    fontWeight: '600',
  },
  demoCardCrop: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 1,
  },
  demoCardCred: {
    fontSize: Typography.xs,
    color: 'rgba(255,235,59,0.8)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  demoPassword: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  demoPasswordValue: {
    color: '#fff176',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  footerText: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontWeight: '500',
  },
  footerSub: {
    fontSize: Typography.xs,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
    marginTop: 4,
  },
});
