import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useCompanies } from '@/hooks/useCompanies';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

const SHEET_HEIGHT = Dimensions.get('window').height * 0.6;

const AVATAR_COLORS = [
  { bg: '#FF6B00', text: '#ffffff' },
  { bg: '#1a3a5c', text: '#4a9eff' },
  { bg: '#1a3a2a', text: '#4ade80' },
  { bg: '#2a1a4a', text: '#c084fc' },
  { bg: '#0d3028', text: '#2dd4bf' },
] as const;

function hashName(name: string): number {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return sum % AVATAR_COLORS.length;
}

export interface PickerCompany {
  id: string;
  name: string;
  city?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (company: PickerCompany) => void;
  selectedId?: string;
}

export function CompanyPickerSheet({ visible, onClose, onSelect, selectedId }: Props) {
  const { companies } = useCompanies();
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  useEffect(() => {
    if (visible) {
      setQuery('');
      setMounted(true);
      translateY.value = withSpring(0, { damping: 22, stiffness: 200 });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 220 }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
      backdropOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [visible]);

  const filtered = useMemo(() => {
    if (!query.trim()) return companies;
    const q = query.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.city ?? '').toLowerCase().includes(q)
    );
  }, [companies, query]);

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select company</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>

          <View style={styles.searchWrapper}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={13} color="#444444" />
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Search companies..."
                placeholderTextColor="#2e2e2e"
                autoCapitalize="none"
                returnKeyType="search"
              />
            </View>
          </View>

          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="business-outline" size={32} color="#2a2a2a" />
              <Text style={styles.emptyText}>No companies found</Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const { bg, text } = AVATAR_COLORS[hashName(item.name)];
                const isSelected = item.id === selectedId;
                return (
                  <Pressable
                    style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                    onPress={() => {
                      onSelect({ id: item.id, name: item.name, city: item.city });
                      onClose();
                    }}>
                    <View style={[styles.avatar, { backgroundColor: bg }]}>
                      <Text style={[styles.avatarText, { color: text }]}>
                        {(item.name[0] ?? '').toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                      {item.city ? <Text style={styles.rowCity}>{item.city}</Text> : null}
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color={Colors.orange} />
                    )}
                  </Pressable>
                );
              }}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: Layout.radiusXl,
    borderTopRightRadius: Layout.radiusXl,
    borderTopWidth: Layout.borderWidth,
    borderTopColor: '#2a2a2a',
    overflow: 'hidden',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.orange,
  },
  searchWrapper: {
    marginHorizontal: 12,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#111111',
    borderRadius: 11,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: Layout.borderWidth,
    borderColor: '#2a2a2a',
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    padding: 0,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: Layout.borderWidth,
    borderBottomColor: '#1f1f1f',
  },
  rowPressed: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
  },
  rowName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#dddddd',
  },
  rowCity: {
    fontSize: 11,
    color: '#444444',
    marginTop: 1,
  },
});
