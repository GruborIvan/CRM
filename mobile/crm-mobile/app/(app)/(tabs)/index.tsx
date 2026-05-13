import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/modules/auth/store/auth.store';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Typography } from '@/constants/typography';

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

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const NAV_ITEMS: Array<{
  label: string;
  subtitle: string;
  icon: IoniconName;
  route: string | null;
}> = [
  { label: 'Ljudi',   subtitle: 'Manage people',    icon: 'people-outline',           route: null },
  { label: 'Firme',   subtitle: 'Manage companies',  icon: 'business-outline',         route: '/(app)/(tabs)/companies' },
  { label: 'Taskovi', subtitle: 'Track tasks',       icon: 'checkmark-circle-outline', route: null },
  { label: 'Grupe',   subtitle: 'Manage groups',     icon: 'grid-outline',             route: null },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const nameParts = (user?.name ?? '').trim().split(/\s+/);
  const initials = ((nameParts[0]?.[0] ?? '') + (nameParts[1]?.[0] ?? '')).toUpperCase() || '?';
  const avatarColor = AVATAR_COLORS[hashName(user?.name ?? '')];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day,</Text>
          <Text style={styles.userName}>{user?.name ?? 'Welcome'}</Text>
        </View>
        <Pressable
          style={styles.avatarBtn}
          onPress={() => router.push('/(app)/(tabs)/profile')}>
          <Text style={[styles.avatarInitials, { color: avatarColor.text }]}>{initials}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Quick Access</Text>
        <View style={styles.grid}>
          {NAV_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={item.route ? () => router.push(item.route as string) : undefined}>
              <View style={styles.iconWrapper}>
                <Ionicons name={item.icon} size={24} color={Colors.orange} />
              </View>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: 14,
  },
  greeting: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: Layout.radiusCircle,
    backgroundColor: Colors.surface,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: 4,
  },
  sectionLabel: {
    ...Typography.sectionLabel,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.gap,
  },
  card: {
    width: '47.5%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    padding: Layout.cardPaddingH,
  },
  cardPressed: {
    opacity: 0.75,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Layout.radiusMd,
    backgroundColor: Colors.orangeSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    ...Typography.cardTitle,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.cardSubtitle,
  },
});
