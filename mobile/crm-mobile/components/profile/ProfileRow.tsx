import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  icon: IoniconName;
  label?: string;
  value: string;
  valueColor?: string;
  last?: boolean;
  onPress?: () => void;
  rightChevron?: boolean;
}

export function ProfileRow({
  icon,
  label,
  value,
  valueColor = '#dddddd',
  last = false,
  onPress,
  rightChevron = false,
}: Props) {
  const inner = (
    <>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={14} color={Colors.orange} />
      </View>
      <View style={styles.content}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      </View>
      {rightChevron && (
        <Ionicons name="chevron-forward" size={12} color="#2a2a2a" />
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable style={[styles.row, !last && styles.divider]} onPress={onPress}>
        {inner}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, !last && styles.divider]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 13,
    gap: 10,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#1f1f1f',
  },
  iconWrap: {
    width: 16,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: '#555555',
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
  },
});
