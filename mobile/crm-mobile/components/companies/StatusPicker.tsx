import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export const STATUS_OPTIONS = [
  { label: 'Customer', value: 1 },
  { label: 'Lead', value: 2 },
  { label: 'Prospect', value: 3 },
  { label: 'Partner', value: 4 },
] as const;

interface Props {
  selected: number;
  onChange: (value: number) => void;
}

export function StatusPicker({ selected, onChange }: Props) {
  return (
    <View style={styles.chips}>
      {STATUS_OPTIONS.map((opt) => {
        const active = selected === opt.value;
        return (
          <Pressable
            key={opt.value}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(opt.value)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#1c1c1e',
    borderWidth: 0.5,
    borderColor: '#2a2a2a',
  },
  chipActive: {
    backgroundColor: Colors.orangeSubtle,
    borderColor: Colors.orange,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  chipTextActive: {
    color: Colors.orange,
  },
});
