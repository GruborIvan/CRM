import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

interface Props {
  phone?: string;
  email?: string;
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Action {
  icon: IoniconName;
  label: string;
  onPress: () => void;
}

export function ContactQuickActions({ phone, email }: Props) {
  const actions: Action[] = [
    {
      icon: 'call-outline',
      label: 'Call',
      onPress: () => { if (phone) Linking.openURL(`tel:${phone}`); },
    },
    {
      icon: 'mail-outline',
      label: 'Email',
      onPress: () => { if (email) Linking.openURL(`mailto:${email}`); },
    },
    {
      icon: 'logo-whatsapp',
      label: 'WhatsApp',
      onPress: () => { if (phone) Linking.openURL(`https://wa.me/${phone.replace(/\D/g, '')}`); },
    },
    {
      icon: 'chatbubble-outline',
      label: 'SMS',
      onPress: () => { if (phone) Linking.openURL(`sms:${phone}`); },
    },
  ];

  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={action.onPress}>
          <Ionicons name={action.icon} size={18} color={Colors.orange} />
          <Text style={styles.label}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 8,
  },
  btn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  btnPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
