import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AVATAR_COLORS = [
  { bg: '#FF6B00', text: '#ffffff' },
  { bg: '#1a3a5c', text: '#4a9eff' },
  { bg: '#1a3a2a', text: '#4ade80' },
  { bg: '#2a1a4a', text: '#c084fc' },
] as const;

function hashName(name: string): number {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return sum % AVATAR_COLORS.length;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

interface Props {
  name: string;
  size?: number;
  borderRadius?: number;
}

export function CompanyAvatar({ name, size = 44, borderRadius = 13 }: Props) {
  const { bg, text } = AVATAR_COLORS[hashName(name)];
  const fontSize = Math.floor(size * 0.36);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius, backgroundColor: bg }]}>
      <Text style={[styles.text, { fontSize, color: text }]}>{getInitials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
