// Reusable Agriculture-Themed Gradient Background
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'main' | 'card' | 'header';
}

export default function GradientBackground({ children, style, variant = 'main' }: Props) {
  const gradients = {
    main: ['#2e7d32', '#2a9d8f', '#1e5fa8'] as const,
    card: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)'] as const,
    header: ['#2e7d32', '#2a9d8f'] as const,
  };

  return (
    <LinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
