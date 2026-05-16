import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { ProfileRow } from '@/components/profile/ProfileRow';
import { useProfile } from '@/hooks/useProfile';
import { useLogout } from '@/src/modules/auth/hooks/use-auth';

function formatLastLogin(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  if (d.toDateString() === now.toDateString()) return `Today, ${hh}:${mm}`;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${hh}:${mm}`;
}

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, loading, refetch } = useProfile();
  const { logout } = useLogout();

  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) { isFirstFocus.current = false; return; }
      refetch();
    }, [refetch]),
  );

  function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Nav bar ── */}
      <View style={styles.navbar}>
        {router.canGoBack() ? (
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={14} color="#bbbbbb" />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text style={styles.navTitle}>Profile</Text>
        <Pressable
          style={styles.pill}
          onPress={() => router.push('/(app)/edit-profile')}>
          <Text style={styles.pillText}>Edit</Text>
        </Pressable>
      </View>

      {loading || !profile ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.orange} />
        </View>
      ) : (
        <>
          {/* ── Hero ── */}
          <View style={styles.hero}>
            <ProfileAvatar
              firstName={profile.firstName}
              lastName={profile.lastName}
              profilePictureUrl={profile.profilePictureUrl}
              size={76}
            />
            <Text style={styles.fullName}>{profile.firstName} {profile.lastName}</Text>
            <Text style={styles.username}>@{profile.username}</Text>
            <Text style={styles.email}>{profile.email}</Text>
          </View>

          {/* ── Body ── */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 72 }]}
            showsVerticalScrollIndicator={false}>

            <ProfileSection title="Account">
              <ProfileRow icon="person-outline"     label="First name" value={profile.firstName} />
              <ProfileRow icon="person-outline"     label="Last name"  value={profile.lastName} />
              <ProfileRow icon="at-circle-outline"  label="Username"   value={`@${profile.username}`} />
              <ProfileRow icon="mail-outline"       label="Email"      value={profile.email} last />
            </ProfileSection>

            <ProfileSection title="Security">
              <ProfileRow
                icon="lock-closed-outline"
                value="Change password"
                rightChevron
                onPress={() => router.push('/(app)/edit-profile?focusPassword=true')}
              />
              <ProfileRow
                icon="log-in-outline"
                label="Last login"
                value={formatLastLogin(profile.lastLoginAt)}
                last
              />
            </ProfileSection>

            <ProfileSection title="Danger zone">
              <ProfileRow
                icon="log-out-outline"
                value="Log out"
                valueColor="#ff4d4d"
                onPress={handleLogout}
                last
              />
            </ProfileSection>

          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: 10,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: Layout.radiusCircle,
    backgroundColor: Colors.surface,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  pill: {
    backgroundColor: 'rgba(255,107,0,0.15)',
    borderWidth: Layout.borderWidth,
    borderColor: Colors.orange,
    borderRadius: 9,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.orange,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 8,
  },
  fullName: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  username: {
    fontSize: 12,
    color: '#555555',
  },
  email: {
    fontSize: 11,
    color: '#444444',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
});
