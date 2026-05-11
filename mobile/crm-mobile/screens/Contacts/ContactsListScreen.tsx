import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { ContactCard } from '@/components/contacts/ContactCard';
import { useContacts } from '@/hooks/useContacts';
import { Contact } from '@/src/modules/contacts/types/contact.types';

const ALPHABET_FILTERS = ['All', 'A–F', 'G–M', 'N–S', 'T–Z'] as const;
type AlphabetFilter = (typeof ALPHABET_FILTERS)[number];

const FILTER_RANGES: Record<AlphabetFilter, [string, string] | null> = {
  'All': null,
  'A–F': ['A', 'F'],
  'G–M': ['G', 'M'],
  'N–S': ['N', 'S'],
  'T–Z': ['T', 'Z'],
};

function applyFilters(contacts: Contact[], alpha: AlphabetFilter, query: string): Contact[] {
  let result = contacts;
  const range = FILTER_RANGES[alpha];
  if (range) {
    const [start, end] = range;
    result = result.filter((c) => {
      const letter = (c.lastName[0] ?? '').toUpperCase();
      return letter >= start && letter <= end;
    });
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.role?.toLowerCase().includes(q) ||
        c.companyName?.toLowerCase().includes(q)
    );
  }
  return result;
}

function SkeletonCard() {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View style={[skeletonStyles.card, anim]}>
      <View style={skeletonStyles.avatar} />
      <View style={skeletonStyles.lines}>
        <View style={skeletonStyles.lineWide} />
        <View style={skeletonStyles.lineNarrow} />
      </View>
    </Animated.View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.border },
  lines: { flex: 1, gap: 8 },
  lineWide: { height: 13, width: '55%', borderRadius: 7, backgroundColor: Colors.border },
  lineNarrow: { height: 10, width: '38%', borderRadius: 5, backgroundColor: Colors.border },
});

interface Props {
  onSelectContact: (contact: Contact) => void;
  onAddContact: () => void;
}

export function ContactsListScreen({ onSelectContact, onAddContact }: Props) {
  const insets = useSafeAreaInsets();
  const { contacts, loading, refetch } = useContacts();
  const [activeFilter, setActiveFilter] = useState<AlphabetFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fabScale = useSharedValue(0.8);
  useEffect(() => {
    fabScale.value = withSpring(1, { damping: 12, stiffness: 180 });
  }, []);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filtered = useMemo(
    () => applyFilters(contacts, activeFilter, searchQuery),
    [contacts, activeFilter, searchQuery]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Contacts</Text>
        <View style={styles.navActions}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="options-outline" size={16} color="#bbbbbb" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search-outline" size={16} color="#bbbbbb" />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={15} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Alphabet filter */}
      <View style={styles.filterRow}>
        {ALPHABET_FILTERS.map((f) => (
          <Pressable
            key={f}
            style={[styles.chip, activeFilter === f && styles.chipActive]}
            onPress={() => setActiveFilter(f)}>
            <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>Recent</Text>

      {/* List */}
      {loading ? (
        <View>{[0, 1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}</View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={52} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No contacts</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || activeFilter !== 'All'
              ? 'Try adjusting your search or filter'
              : 'Contacts you add will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ContactCard contact={item} index={index} onPress={onSelectContact} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.orange}
            />
          }
        />
      )}

      {/* FAB */}
      <Animated.View style={[styles.fab, { bottom: 90 + insets.bottom }, fabStyle]}>
        <Pressable style={styles.fabInner} onPress={onAddContact}>
          <Ionicons name="add" size={22} color="#ffffff" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  navTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: Colors.textPrimary,
  },
  navActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.surface,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 6,
    marginBottom: 2,
  },
  chip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: Layout.radiusCircle,
    backgroundColor: Colors.surface,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: Colors.orangeSubtle,
    borderColor: Colors.orange,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: { color: Colors.orange },
  sectionLabel: {
    ...Typography.sectionLabel,
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 7,
  },
  listContent: { paddingBottom: 160 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: Layout.gap,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textHint,
    textAlign: 'center',
    lineHeight: 18,
  },
  fab: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
  },
  fabInner: {
    width: 56,
    height: 56,
    backgroundColor: Colors.orange,
    borderRadius: Layout.radiusLg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
