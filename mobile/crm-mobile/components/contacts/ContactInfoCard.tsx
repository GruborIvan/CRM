import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Contact } from '@/src/modules/contacts/types/contact.types';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Row {
  icon: IoniconName;
  label: string;
  value: string;
  valueColor: string;
  onPress?: () => void;
}

interface Props {
  contact: Contact;
  onCompanyPress?: () => void;
}

export function ContactInfoCard({ contact, onCompanyPress }: Props) {
  const rows: Row[] = [
    {
      icon: 'mail-outline',
      label: 'Email',
      value: contact.email || '—',
      valueColor: contact.email ? '#4a9eff' : Colors.textHint,
      onPress: contact.email ? () => Linking.openURL(`mailto:${contact.email}`) : undefined,
    },
    {
      icon: 'call-outline',
      label: 'Phone',
      value: contact.phone || '—',
      valueColor: contact.phone ? '#dddddd' : Colors.textHint,
    },
    {
      icon: 'business-outline',
      label: 'Company',
      value: contact.companyName || '—',
      valueColor: contact.companyName ? '#dddddd' : Colors.textHint,
      onPress: contact.companyName ? onCompanyPress : undefined,
    },
  ];

  return (
    <View style={styles.card}>
      {rows.map((row, index) => {
        const inner = (
          <View style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
            <Ionicons name={row.icon} size={15} color={Colors.orange} style={styles.icon} />
            <View style={styles.content}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={[styles.value, { color: row.valueColor }]}>{row.value}</Text>
            </View>
          </View>
        );

        return row.onPress ? (
          <Pressable key={row.label} onPress={row.onPress} style={({ pressed }) => pressed && styles.rowPressed}>
            {inner}
          </Pressable>
        ) : (
          <View key={row.label}>{inner}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    gap: 10,
  },
  rowBorder: {
    borderBottomWidth: Layout.borderWidth,
    borderBottomColor: '#1f1f1f',
  },
  rowPressed: {
    opacity: 0.7,
  },
  icon: {
    width: 17,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
  },
});
