import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { Contact } from '@/src/modules/contacts/types/contact.types';
import { ContactAvatar } from './ContactAvatar';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

const BADGE_COLORS = [
  { bg: 'rgba(255,107,0,0.15)', text: '#FF6B00' },
  { bg: 'rgba(74,158,255,0.12)', text: '#4a9eff' },
] as const;

interface Props {
  contact: Contact;
  index: number;
  onPress: (contact: Contact) => void;
}

export function ContactCard({ contact, index, onPress }: Props) {
  const badge = BADGE_COLORS[index % 2];
  const meta = [contact.role, contact.companyName].filter(Boolean).join(' · ');

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(contact);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}>
      <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} size={42} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {contact.firstName} {contact.lastName}
        </Text>
        {meta ? <Text style={styles.meta} numberOfLines={1}>{meta}</Text> : null}
      </View>
      {contact.role ? (
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{contact.role}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={13} color="#2a2a2a" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceAlt,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 7,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
