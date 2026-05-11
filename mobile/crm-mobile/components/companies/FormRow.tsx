import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props extends TextInputProps {
  icon: IoniconName;
  isLast?: boolean;
  error?: string;
  rightElement?: React.ReactNode;
}

export function FormRow({ icon, isLast = false, error, rightElement, style, ...inputProps }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <View style={[styles.row, !isLast && styles.rowBorder, focused && styles.rowFocused]}>
        <Ionicons name={icon} size={16} color={Colors.orange} style={styles.icon} />
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#333333"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />
        {rightElement}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: Layout.gap,
  },
  rowBorder: {
    borderBottomWidth: Layout.borderWidth,
    borderBottomColor: Colors.borderSubtle,
  },
  rowFocused: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.orange,
  },
  icon: {
    width: 18,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    padding: 0,
  },
  error: {
    fontSize: 12,
    color: '#ff4d4d',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
