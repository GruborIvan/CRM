import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { Company, CompanyContact } from '@/src/modules/companies/types/company.types';
import { CompanyAvatar } from '@/components/companies/CompanyAvatar';
import { StatusBadge } from '@/components/companies/StatusBadge';
import { InfoRow } from '@/components/companies/InfoRow';
import { ActionButton } from '@/components/companies/ActionButton';

interface Props {
  company: Company;
  onBack: () => void;
  onContactPress?: (contact: CompanyContact) => void;
}

export function CompanyDetailScreen({ company, onBack, onContactPress }: Props) {
  const insets = useSafeAreaInsets();

  const infoFields: Array<{
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    value: string;
  }> = [
    { icon: 'location-outline', label: 'Address', value: company.address || '—' },
    { icon: 'globe-outline', label: 'Website', value: company.website || '—' },
    { icon: 'call-outline', label: 'Phone', value: company.phone || '—' },
    { icon: 'calendar-outline', label: 'Last order date', value: company.lastOrderDate || '—' },
    {
      icon: 'receipt-outline',
      label: 'Total orders',
      value: company.totalOrders?.toString() || '—',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={16} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Company detail</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <CompanyAvatar name={company.name} size={60} borderRadius={18} />
          <View style={styles.heroInfo}>
            <Text style={styles.companyName}>{company.name}</Text>
            {(company.industry || company.city) && (
              <Text style={styles.companyMeta}>
                {[company.industry, company.city].filter(Boolean).join(' · ')}
              </Text>
            )}
          </View>
          <StatusBadge status={company.status} large />
        </View>

        <View style={styles.actionsRow}>
          <ActionButton icon="call-outline" label="Call" />
          <ActionButton icon="mail-outline" label="Email" />
          <ActionButton icon="location-outline" label="Map" />
          <ActionButton icon="create-outline" label="Edit" />
        </View>

        <View style={styles.infoCard}>
          {infoFields.map((field, index) => (
            <InfoRow
              key={field.label}
              icon={field.icon}
              label={field.label}
              value={field.value}
              isLast={index === infoFields.length - 1}
            />
          ))}
        </View>

        {company.contacts && company.contacts.length > 0 && (
          <View style={styles.contactsSection}>
            <Text style={styles.sectionLabel}>Contacts</Text>
            <View style={styles.contactsCard}>
              {company.contacts.map((contact, index) => (
                <Pressable
                  key={contact.id}
                  style={({ pressed }) => [
                    styles.contactRow,
                    index < (company.contacts?.length ?? 0) - 1 && styles.contactRowBorder,
                    pressed && styles.contactRowPressed,
                  ]}
                  onPress={() => onContactPress?.(contact)}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactInitials}>
                      {(contact.firstName[0] + contact.lastName[0]).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.firstName} {contact.lastName}</Text>
                    {contact.email && <Text style={styles.contactRole}>{contact.email}</Text>}
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#333333" />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: Layout.radiusCircle,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: Layout.screenPaddingH,
    gap: 14,
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  companyName: {
    ...Typography.detailName,
  },
  companyMeta: {
    ...Typography.cardSubtitle,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  infoCard: {
    marginHorizontal: Layout.screenPaddingH,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  contactsSection: {
    marginHorizontal: Layout.screenPaddingH,
    marginBottom: 24,
  },
  sectionLabel: {
    ...Typography.sectionLabel,
    marginBottom: 10,
  },
  contactsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Layout.cardPaddingH,
    gap: Layout.gap,
  },
  contactRowBorder: {
    borderBottomWidth: Layout.borderWidth,
    borderBottomColor: Colors.borderSubtle,
  },
  contactRowPressed: {
    backgroundColor: Colors.surfaceAlt,
  },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.blueSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.blue,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#cccccc',
  },
  contactRole: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
