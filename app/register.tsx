// Farmer Registration Page
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ScrollView, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerFarmer } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { TAMIL_NADU_DISTRICTS } from '../constants/locations';
import { CROP_DATABASE } from '../constants/crops';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';

export default function RegisterPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [crop, setCrop] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showCropPicker, setShowCropPicker] = useState(false);

  const validate = (): string | null => {
    if (!name.trim())    return 'Please enter your name.';
    if (!email.trim())   return 'Please enter your email.';
    if (!email.includes('@')) return 'Please enter a valid email address.';
    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) return 'Please enter a valid age (18–100).';
    if (!location)       return 'Please select your district.';
    if (!crop)           return 'Please select your crop.';
    return null;
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setIsLoading(true);
    try {
      const user = await registerFarmer({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        age: parseInt(age, 10),
        location,
        crop,
      });
      setUser(user);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
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
          {/* Back */}
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerEmoji}>🌱</Text>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSub}>Register as a Tamil Nadu Farmer</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <FormInput label="👤 Farmer Name" placeholder="Enter your full name"
              value={name} onChangeText={setName} />

            <FormInput label="📧 Email Address" placeholder="Enter your email"
              value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none" />

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🔒 Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                  <Text>{showPassword ? '🙈' : '👁️'}</Text>
                </Pressable>
              </View>
            </View>

            <FormInput label="🎂 Age" placeholder="Your age (18–100)"
              value={age} onChangeText={setAge} keyboardType="numeric" />

            {/* Location Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📍 Tamil Nadu District</Text>
              <Pressable
                style={[styles.selector, !location && styles.selectorPlaceholder]}
                onPress={() => setShowLocationPicker(true)}
              >
                <Text style={location ? styles.selectorText : styles.selectorPlaceholderText}>
                  {location || 'Select your district'}
                </Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </Pressable>
            </View>

            {/* Crop Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>🌾 Your Crop</Text>
              <Pressable
                style={[styles.selector, !crop && styles.selectorPlaceholder]}
                onPress={() => setShowCropPicker(true)}
              >
                <Text style={crop ? styles.selectorText : styles.selectorPlaceholderText}>
                  {crop ? `${CROP_DATABASE.find(c => c.name === crop)?.emoji || ''} ${crop}` : 'Select your crop'}
                </Text>
                <Text style={styles.selectorArrow}>▼</Text>
              </Pressable>
            </View>

            {/* Register Button */}
            <Pressable
              style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.85 }, isLoading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#4caf50', '#2e7d32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.registerBtnGradient}
              >
                <Text style={styles.registerBtnText}>
                  {isLoading ? 'Creating Account...' : '🌱 Create My Account'}
                </Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Location Picker Modal */}
      <PickerModal
        visible={showLocationPicker}
        title="Select Your District"
        items={TAMIL_NADU_DISTRICTS.map(d => ({ label: `📍 ${d.name}`, value: d.name, sub: d.region }))}
        selected={location}
        onSelect={(v) => { setLocation(v); setShowLocationPicker(false); }}
        onClose={() => setShowLocationPicker(false)}
      />

      {/* Crop Picker Modal */}
      <PickerModal
        visible={showCropPicker}
        title="Select Your Crop"
        items={CROP_DATABASE.map(c => ({ label: `${c.emoji} ${c.name}`, value: c.name, sub: c.season }))}
        selected={crop}
        onSelect={(v) => { setCrop(v); setShowCropPicker(false); }}
        onClose={() => setShowCropPicker(false)}
      />
    </LinearGradient>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences';
}

function FormInput({ label, placeholder, value, onChangeText, keyboardType = 'default', autoCapitalize = 'sentences' }: FormInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

interface PickerItem { label: string; value: string; sub: string; }
interface PickerModalProps {
  visible: boolean;
  title: string;
  items: PickerItem[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}

function PickerModal({ visible, title, items, selected, onSelect, onClose }: PickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.handle} />
          <Text style={pickerStyles.title}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <Pressable
                key={item.value}
                style={[pickerStyles.item, selected === item.value && pickerStyles.itemSelected]}
                onPress={() => onSelect(item.value)}
              >
                <View style={pickerStyles.itemContent}>
                  <Text style={[pickerStyles.itemLabel, selected === item.value && pickerStyles.itemLabelSelected]}>
                    {item.label}
                  </Text>
                  <Text style={pickerStyles.itemSub}>{item.sub}</Text>
                </View>
                {selected === item.value && <Text style={pickerStyles.check}>✓</Text>}
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={pickerStyles.closeBtn} onPress={onClose}>
            <Text style={pickerStyles.closeBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
  backBtn: { alignSelf: 'flex-start', paddingVertical: Spacing.sm, marginBottom: Spacing.md },
  backText: { color: Colors.textSecondary, fontSize: Typography.base },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  headerEmoji: { fontSize: 60, marginBottom: Spacing.sm },
  headerTitle: { fontSize: Typography.xxl, fontWeight: Typography.extraBold, color: Colors.white, marginBottom: 6 },
  headerSub: { fontSize: Typography.sm, color: Colors.textSecondary },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
    ...Shadows.card,
  },
  errorBox: {
    backgroundColor: 'rgba(244,67,54,0.15)',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(244,67,54,0.4)',
  },
  errorText: { color: '#ff8a80', fontSize: Typography.sm },
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: Typography.medium, marginBottom: 6 },
  input: {
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.white,
    fontSize: Typography.base,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  eyeBtn: {
    padding: Spacing.md,
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  selectorPlaceholder: { borderColor: Colors.whiteAlpha20 },
  selectorText: { color: Colors.white, fontSize: Typography.base },
  selectorPlaceholderText: { color: Colors.textMuted, fontSize: Typography.base },
  selectorArrow: { color: Colors.textMuted, fontSize: Typography.xs },
  registerBtn: { borderRadius: Radius.full, overflow: 'hidden', marginTop: Spacing.md, marginBottom: Spacing.md, ...Shadows.button },
  registerBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  registerBtnText: { fontSize: Typography.md, fontWeight: Typography.bold, color: Colors.white },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: Colors.textMuted, fontSize: Typography.sm },
  loginLink: { color: '#81d4fa', fontSize: Typography.sm, fontWeight: Typography.semiBold },
});

const pickerStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#1a3a2a',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    maxHeight: '75%',
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: Colors.whiteAlpha20,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  title: { fontSize: Typography.lg, fontWeight: Typography.bold, color: Colors.white, marginBottom: Spacing.md },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: 4,
  },
  itemSelected: { backgroundColor: Colors.whiteAlpha10 },
  itemContent: { flex: 1 },
  itemLabel: { fontSize: Typography.base, color: Colors.textSecondary },
  itemLabelSelected: { color: Colors.white, fontWeight: Typography.semiBold },
  itemSub: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  check: { fontSize: Typography.base, color: '#4caf50', fontWeight: Typography.bold },
  closeBtn: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.whiteAlpha10,
    borderRadius: Radius.full,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.whiteAlpha20,
  },
  closeBtnText: { color: Colors.textSecondary, fontSize: Typography.base, fontWeight: Typography.medium },
});
