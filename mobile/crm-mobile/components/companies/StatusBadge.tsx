import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CompanyStatus } from '@/src/modules/companies/types/company.types';

interface StatusStyle {
  bg: string;
  text: string;
  border?: string;
}

const STATUS_STYLES: Record<CompanyStatus, StatusStyle> = {
  Lead:     { bg: '#1e1e1e', text: '#888888', border: '#2a2a2a' },
  Prospect: { bg: 'rgba(74, 158, 255, 0.12)', text: '#4a9eff' },
  Customer: { bg: 'rgba(74, 222, 128, 0.12)', text: '#4ade80' },
  Churned:  { bg: 'rgba(255, 75, 75, 0.12)', text: '#ff4b4b' },
};

const FALLBACK: StatusStyle = { bg: '#1e1e1e', text: '#555555', border: '#2a2a2a' };

interface Props {
  status: CompanyStatus;
  large?: boolean;
}

export function StatusBadge({ status, large = false }: Props) {
  const s = STATUS_STYLES[status] ?? FALLBACK;
  return (
    <View
      style={[
        styles.badge,
        large && styles.badgeLarge,
        { backgroundColor: s.bg },
        s.border ? { borderWidth: 0.5, borderColor: s.border } : undefined,
      ]}>
      <Text style={[styles.text, large && styles.textLarge, { color: s.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeLarge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
  textLarge: {
    fontSize: 13,
  },
});
