import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AVATAR_COLORS = [
  { bg: '#FF6B00', text: '#ffffff' },
  { bg: '#1a3a5c', text: '#4a9eff' },
  { bg: '#1a3a2a', text: '#4ade80' },
  { bg: '#2a1a4a', text: '#c084fc' },
  { bg: '#0d3028', text: '#2dd4bf' },
] as const;

function hashName(name: string): number {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return sum % AVATAR_COLORS.length;
}

interface Props {
  firstName: string;
  lastName: string;
  size?: number;
}

export function ContactAvatar({ firstName, lastName, size = 42 }: Props) {
  const { bg, text } = AVATAR_COLORS[hashName(firstName + lastName)];
  const initials = ((firstName[0] ?? '') + (lastName[0] ?? '')).toUpperCase();
  const fontSize = Math.floor(size * 0.33);

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={[styles.initials, { fontSize, color: text }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
