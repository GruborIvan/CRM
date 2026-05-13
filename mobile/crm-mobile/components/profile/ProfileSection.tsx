import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

interface Props {
  title: string;
  children: React.ReactNode;
}

export function ProfileSection({ title, children }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{title.toUpperCase()}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: Colors.textHint,
    marginTop: 14,
    marginBottom: 7,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});
