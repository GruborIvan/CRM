import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/typography';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  icon: IoniconName;
  label: string;
  value: string;
  isLast?: boolean;
}

export function InfoRow({ icon, label, value, isLast = false }: Props) {
  const isEmpty = value === '—';
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Ionicons name={icon} size={16} color={Colors.orange} style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, isEmpty && styles.valueMuted]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Layout.cardPaddingV,
    paddingHorizontal: Layout.cardPaddingH,
    gap: Layout.gap,
  },
  rowBorder: {
    borderBottomWidth: Layout.borderWidth,
    borderBottomColor: Colors.borderSubtle,
  },
  icon: {
    width: 18,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  label: {
    ...Typography.label,
    marginBottom: 2,
  },
  value: {
    ...Typography.value,
  },
  valueMuted: {
    color: Colors.textHint,
    fontWeight: '400',
  },
});
