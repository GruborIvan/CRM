import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Company } from '@/src/modules/companies/types/company.types';
import { CompanyAvatar } from './CompanyAvatar';
import { StatusBadge } from './StatusBadge';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/typography';

interface Props {
  company: Company;
  onPress: (company: Company) => void;
}

export function CompanyCard({ company, onPress }: Props) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(company);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={handlePress}>
      <CompanyAvatar name={company.name} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{company.name}</Text>
          <StatusBadge status={company.status} />
        </View>
        {(company.industry || company.city) && (
          <Text style={styles.meta} numberOfLines={1}>
            {[company.industry, company.city].filter(Boolean).join(' · ')}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Layout.screenPaddingH,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    paddingVertical: 16,
    paddingHorizontal: Layout.cardPaddingH,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.gap,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceAlt,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    ...Typography.cardTitle,
    letterSpacing: -0.1,
  },
  meta: {
    ...Typography.cardSubtitle,
  },
});
