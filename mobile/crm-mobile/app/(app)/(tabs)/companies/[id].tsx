import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCompanyById } from '@/hooks/useCompanyById';
import { CompanyDetailScreen } from '@/screens/Companies/CompanyDetailScreen';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

function SkeletonBlock({ width, height, style }: { width: number | string; height: number; style?: object }) {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.7, { duration: 800 }), -1, true);
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[{ width: width as number, height, borderRadius: Layout.radiusMd, backgroundColor: Colors.border }, anim, style]}
    />
  );
}

function DetailSkeleton({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={16} color={Colors.textSecondary} />
        </Pressable>
        <SkeletonBlock width={120} height={14} />
        <View style={styles.headerSpacer} />
      </View>

      {/* Hero */}
      <View style={styles.skeletonHero}>
        <SkeletonBlock width={60} height={60} style={{ borderRadius: Layout.radiusLg }} />
        <View style={styles.skeletonHeroInfo}>
          <SkeletonBlock width="70%" height={18} />
          <SkeletonBlock width="45%" height={12} />
        </View>
        <SkeletonBlock width={64} height={24} style={{ borderRadius: 8 }} />
      </View>

      {/* Action buttons */}
      <View style={styles.skeletonActions}>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} width="22%" height={64} style={{ borderRadius: Layout.radiusMd }} />
        ))}
      </View>

      {/* Info card */}
      <View style={styles.skeletonCard}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.skeletonRow, i < 4 && styles.skeletonRowBorder]}>
            <SkeletonBlock width={18} height={16} style={{ borderRadius: 4 }} />
            <View style={styles.skeletonRowContent}>
              <SkeletonBlock width="35%" height={10} />
              <SkeletonBlock width="60%" height={12} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ErrorState({ onBack, message }: { onBack: () => void; message: string | null }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={16} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Company detail</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.errorState}>
        <Ionicons name="alert-circle-outline" size={52} color={Colors.textMuted} />
        <Text style={styles.errorTitle}>Failed to load</Text>
        <Text style={styles.errorSubtitle}>{message ?? 'Something went wrong'}</Text>
      </View>
    </View>
  );
}

export default function CompanyDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const companyId = Array.isArray(id) ? id[0] : id;
  const { company, loading, error } = useCompanyById(companyId);

  const handleBack = () => router.back();

  const handleContactPress = (contact: { id: string; firstName: string; lastName: string; email?: string; phone?: string; companyId?: string }) => {
    router.push({
      pathname: '/(app)/(tabs)/contacts/[id]',
      params: {
        id: contact.id,
        contactJson: JSON.stringify({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          companyId: contact.companyId,
          companyName: company?.name,
        }),
      },
    });
  };

  if (loading) return <DetailSkeleton onBack={handleBack} />;
  if (error || !company) return <ErrorState onBack={handleBack} message={error} />;

  return <CompanyDetailScreen company={company} onBack={handleBack} onContactPress={handleContactPress} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: Layout.radiusCircle,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  skeletonHero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: Layout.screenPaddingH,
    gap: 14,
  },
  skeletonHeroInfo: {
    flex: 1,
    gap: 8,
  },
  skeletonActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  skeletonCard: {
    marginHorizontal: Layout.screenPaddingH,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Layout.cardPaddingH,
    gap: Layout.gap,
  },
  skeletonRowBorder: {
    borderBottomWidth: Layout.borderWidth,
    borderBottomColor: Colors.borderSubtle,
  },
  skeletonRowContent: {
    flex: 1,
    gap: 6,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.gap,
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  errorSubtitle: {
    fontSize: 13,
    color: Colors.textHint,
    textAlign: 'center',
  },
});
