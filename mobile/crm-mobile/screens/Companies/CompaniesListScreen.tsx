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
  cancelAnimation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/typography';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/src/modules/companies/types/company.types';

const FILTERS = ['All', 'Customers', 'Leads', 'Partners'] as const;
type Filter = (typeof FILTERS)[number];

function filterCompanies(companies: Company[], filter: Filter, query: string): Company[] {
  let result = companies;
  if (filter === 'Customers') result = result.filter((c) => c.status === 'Customer');
  else if (filter === 'Leads') result = result.filter((c) => c.status === 'Lead');
  else if (filter === 'Partners') result = result.filter((c) => c.status === 'Partner');
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q)
    );
  }
  return result;
}

function SkeletonCard() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[skeletonStyles.card, animStyle]}>
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
    marginHorizontal: Layout.screenPaddingH,
    marginBottom: 10,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    paddingVertical: Layout.cardPaddingV,
    paddingHorizontal: Layout.cardPaddingH,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.gap,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: Colors.border,
  },
  lines: {
    flex: 1,
    gap: 8,
  },
  lineWide: {
    height: 14,
    width: '60%',
    borderRadius: 7,
    backgroundColor: Colors.border,
  },
  lineNarrow: {
    height: 10,
    width: '40%',
    borderRadius: 5,
    backgroundColor: Colors.border,
  },
});

interface Props {
  onSelectCompany: (company: Company) => void;
  onAddCompany: () => void;
}

export function CompaniesListScreen({ onSelectCompany, onAddCompany }: Props) {
  const insets = useSafeAreaInsets();
  const { companies, loading, refetch } = useCompanies();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fabScale = useSharedValue(0.8);
  const refreshRotation = useSharedValue(0);

  useEffect(() => {
    fabScale.value = withSpring(1, { damping: 12, stiffness: 180 });
  }, []);

  useEffect(() => {
    if (refreshing) {
      refreshRotation.value = withRepeat(withTiming(360, { duration: 700 }), -1, false);
    } else {
      cancelAnimation(refreshRotation);
      refreshRotation.value = 0;
    }
  }, [refreshing]);

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const refreshIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${refreshRotation.value}deg` }],
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filtered = useMemo(
    () => filterCompanies(companies, activeFilter, searchQuery),
    [companies, activeFilter, searchQuery]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Companies</Text>
        <View style={styles.navActions}>
          <Pressable style={styles.iconBtn} onPress={handleRefresh} disabled={refreshing}>
            <Animated.View style={refreshIconStyle}>
              <Ionicons name="refresh-outline" size={18} color={Colors.textPrimary} />
            </Animated.View>
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="options-outline" size={18} color={Colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search-outline" size={18} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color="#555555" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search companies..."
            placeholderTextColor={Colors.textHint}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filtersRow}>
        {FILTERS.map((filter) => (
          <Pressable
            key={filter}
            style={[styles.chip, activeFilter === filter && styles.chipActive]}
            onPress={() => setActiveFilter(filter)}>
            <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>
              {filter}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>Recent</Text>
      </View>

      {loading ? (
        <View>
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="information-circle-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No companies</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery || activeFilter !== 'All'
              ? 'Try adjusting your search or filter'
              : 'Companies you add will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <CompanyCard company={item} onPress={onSelectCompany} />}
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

      <Animated.View style={[styles.fab, { bottom: 56 + insets.bottom + 12 }, fabStyle]}>
        <Pressable style={styles.fabInner} onPress={onAddCompany}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: 12,
  },
  navTitle: {
    ...Typography.screenTitle,
  },
  navActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    paddingHorizontal: Layout.screenPaddingH,
    marginBottom: Layout.gap,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Layout.radiusMd,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPaddingH,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    paddingVertical: 4,
    borderRadius: Layout.radiusCircle,
    backgroundColor: 'transparent',
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  sectionRow: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: 8,
  },
  sectionLabel: {
    ...Typography.sectionLabel,
  },
  listContent: {
    paddingBottom: 100,
  },
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
    right: 20,
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
