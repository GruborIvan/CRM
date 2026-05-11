import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Contact } from '@/src/modules/contacts/types/contact.types';
import { ContactAvatar } from '@/components/contacts/ContactAvatar';
import { ContactQuickActions } from '@/components/contacts/ContactQuickActions';
import { ContactInfoCard } from '@/components/contacts/ContactInfoCard';

interface Props {
  contact: Contact;
  onBack: () => void;
  onEdit: () => void;
  onCompanyPress?: () => void;
}

export function ContactDetailScreen({ contact, onBack, onEdit, onCompanyPress }: Props) {
  const insets = useSafeAreaInsets();
  const meta = [contact.role, contact.companyName].filter(Boolean).join(' · ');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.circleBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={16} color="#bbbbbb" />
        </Pressable>
        <Text style={styles.headerTitle}>Contact detail</Text>
        <Pressable style={styles.circleBtn} onPress={onEdit}>
          <Ionicons name="create-outline" size={15} color={Colors.orange} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>

        {/* Hero */}
        <View style={styles.hero}>
          <ContactAvatar firstName={contact.firstName} lastName={contact.lastName} size={68} />
          <Text style={styles.heroName}>{contact.firstName} {contact.lastName}</Text>
          {meta ? <Text style={styles.heroMeta}>{meta}</Text> : null}
          {contact.role ? (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{contact.role}</Text>
            </View>
          ) : null}
        </View>

        {/* Quick actions */}
        <View style={styles.actionsWrapper}>
          <ContactQuickActions phone={contact.phone} email={contact.email} />
        </View>

        {/* Info card */}
        <View style={styles.infoWrapper}>
          <ContactInfoCard contact={contact} onCompanyPress={onCompanyPress} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: 12,
  },
  circleBtn: {
    width: 32,
    height: 32,
    borderRadius: Layout.radiusCircle,
    backgroundColor: Colors.surface,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  scroll: { paddingTop: 8 },
  hero: {
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: 18,
    gap: 10,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  heroMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
  },
  roleBadge: {
    backgroundColor: Colors.orangeSubtle,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.orange,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.orange,
  },
  actionsWrapper: { marginBottom: 16 },
  infoWrapper: {},
});
