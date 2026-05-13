import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

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
  profilePictureUrl?: string | null;
  size?: number;
  editable?: boolean;
  onEditPress?: () => void;
}

export function ProfileAvatar({
  firstName,
  lastName,
  profilePictureUrl,
  size = 76,
  editable = false,
  onEditPress,
}: Props) {
  const { bg, text } = AVATAR_COLORS[hashName(firstName + lastName)];
  const initials = ((firstName[0] ?? '') + (lastName[0] ?? '')).toUpperCase();
  const fontSize = Math.round(size * 0.29);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {profilePictureUrl ? (
        <Image
          source={{ uri: profilePictureUrl }}
          style={[styles.image, { width: size, height: size }]}
        />
      ) : (
        <View
          style={[
            styles.circle,
            { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
          ]}>
          <Text style={[styles.initials, { fontSize, color: text }]}>{initials}</Text>
        </View>
      )}

      {editable ? (
        <Pressable style={styles.badge} onPress={onEditPress}>
          <Ionicons name="camera-outline" size={11} color={Colors.orange} />
        </Pressable>
      ) : (
        <View style={styles.badge}>
          <Ionicons name="camera-outline" size={11} color={Colors.orange} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  image: {
    borderRadius: Layout.radiusCircle,
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: Layout.radiusCircle,
    backgroundColor: Colors.surface,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
