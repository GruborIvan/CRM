import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { useProfile } from '@/hooks/useProfile';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useChangePassword } from '@/hooks/useChangePassword';

// ─── Types ───────────────────────────────────────────────────────────────────

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface InputRowProps {
  icon: IoniconName;
  label: string;
  value: string;
  onChange: (v: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
  placeholder?: string;
  inputRef?: React.RefObject<TextInput | null>;
  last?: boolean;
}

// ─── InputRow ────────────────────────────────────────────────────────────────

function InputRow({
  icon,
  label,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  placeholder = '',
  inputRef,
  last = false,
}: InputRowProps) {
  return (
    <View style={[rowStyles.row, focused && rowStyles.focused, !last && rowStyles.divider]}>
      <View style={rowStyles.iconWrap}>
        <Ionicons name={icon} size={14} color={Colors.orange} />
      </View>
      <View style={rowStyles.content}>
        <Text style={rowStyles.label}>{label}</Text>
        <TextInput
          ref={inputRef ?? null}
          style={rowStyles.input}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          placeholderTextColor="#2e2e2e"
        />
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 13,
    gap: 10,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
  },
  focused: {
    borderLeftColor: Colors.orange,
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
    marginBottom: 3,
  },
  input: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textPrimary,
    padding: 0,
  },
});

// ─── Password strength ───────────────────────────────────────────────────────

function strengthOf(pw: string): number {
  if (!pw) return 0;
  const digit   = /\d/.test(pw);
  const special = /[^a-zA-Z0-9]/.test(pw);
  if (pw.length >= 10 && digit && special) return 4;
  if (pw.length >= 8  && digit)           return 3;
  if (pw.length >= 8)                     return 2;
  return 1;
}

const STRENGTH_COLOR: Record<number, string> = {
  1: '#ff4d4d',
  2: '#f59e0b',
  3: '#4ade80',
  4: '#4ade80',
};

// ─── Screen ──────────────────────────────────────────────────────────────────

export function EditProfileScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{ focusPassword?: string }>();
  const shouldFocusPassword = params.focusPassword === 'true';

  const { profile, loading }                   = useProfile();
  const { update,          loading: saving }   = useUpdateProfile();
  const { changePassword,  loading: changingPw } = useChangePassword();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [firstName,       setFirstName]       = useState('');
  const [lastName,        setLastName]        = useState('');
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focused,         setFocused]         = useState('');
  const [ready,           setReady]           = useState(false);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const scrollRef         = useRef<ScrollView>(null);
  const pwInputRef        = useRef<TextInput>(null);
  const securitySectionY  = useRef(0);

  // ── Seed form once profile loads ────────────────────────────────────────────
  useEffect(() => {
    if (profile && !ready) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setUsername(profile.username);
      setEmail(profile.email);
      setReady(true);
    }
  }, [profile, ready]);

  // ── focusPassword param: scroll + focus on ready ────────────────────────────
  useEffect(() => {
    if (!shouldFocusPassword || !ready) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: securitySectionY.current, animated: true });
      pwInputRef.current?.focus();
    }, 350);
    return () => clearTimeout(t);
  }, [shouldFocusPassword, ready]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const profileDirty =
    firstName !== (profile?.firstName ?? '') ||
    lastName  !== (profile?.lastName  ?? '') ||
    username  !== (profile?.username  ?? '') ||
    email     !== (profile?.email     ?? '');

  const passwordFilled = currentPassword !== '' && newPassword !== '' && confirmPassword !== '';
  const hasChanges = profileDirty || passwordFilled;
  const busy       = saving || changingPw;

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (passwordFilled && newPassword !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match");
      return;
    }

    const jobs: Promise<void>[] = [];

    if (profileDirty) {
      jobs.push(
        update({ firstName, lastName, username, email }).then((r) => {
          if (!r.success) Alert.alert('Error', 'Profile update failed');
        }),
      );
    }

    if (passwordFilled) {
      jobs.push(
        changePassword({ currentPassword, newPassword }).then((r) => {
          if (!r.success) Alert.alert('Error', 'Password change failed');
          else {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
        }),
      );
    }

    await Promise.all(jobs);
    if (jobs.length > 0) router.back();
  }

  const strength = strengthOf(newPassword);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── Nav bar ── */}
      <View style={styles.navbar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={14} color="#bbbbbb" />
        </Pressable>
        <Text style={styles.navTitle}>Edit profile</Text>
        <Pressable
          style={[styles.pill, (!hasChanges || busy) && styles.pillDisabled]}
          onPress={handleSave}
          disabled={!hasChanges || busy}>
          {busy
            ? <ActivityIndicator size="small" color={Colors.orange} />
            : <Text style={styles.pillText}>Save</Text>}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

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
                  editable
                  onEditPress={() => Alert.alert('Avatar', 'Image upload coming soon.')}
                />
                <Text style={styles.fullName}>{profile.firstName} {profile.lastName}</Text>
                <Text style={styles.subText}>@{profile.username}</Text>
              </View>

              {/* ── Personal info ── */}
              <ProfileSection title="Personal info">
                <InputRow
                  icon="person-outline"
                  label="First name"
                  value={firstName}
                  onChange={setFirstName}
                  focused={focused === 'firstName'}
                  onFocus={() => setFocused('firstName')}
                  onBlur={() => setFocused('')}
                />
                <InputRow
                  icon="person-outline"
                  label="Last name"
                  value={lastName}
                  onChange={setLastName}
                  focused={focused === 'lastName'}
                  onFocus={() => setFocused('lastName')}
                  onBlur={() => setFocused('')}
                />
                <InputRow
                  icon="at-circle-outline"
                  label="Username"
                  value={username}
                  onChange={setUsername}
                  focused={focused === 'username'}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  autoCapitalize="none"
                />
                <InputRow
                  icon="mail-outline"
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  focused={focused === 'email'}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused('')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  last
                />
              </ProfileSection>

              {/* ── Security ── */}
              <View
                onLayout={(e) => { securitySectionY.current = e.nativeEvent.layout.y; }}>
                <ProfileSection title="Security">
                  <InputRow
                    icon="lock-closed-outline"
                    label="Current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    focused={focused === 'currentPw'}
                    onFocus={() => setFocused('currentPw')}
                    onBlur={() => setFocused('')}
                    secureTextEntry
                    placeholder="••••••••"
                    autoCapitalize="none"
                    inputRef={pwInputRef}
                  />

                  {/* New password + strength bar */}
                  <View>
                    <InputRow
                      icon="lock-closed-outline"
                      label="New password"
                      value={newPassword}
                      onChange={setNewPassword}
                      focused={focused === 'newPw'}
                      onFocus={() => setFocused('newPw')}
                      onBlur={() => setFocused('')}
                      secureTextEntry
                      placeholder="Enter new password"
                      autoCapitalize="none"
                    />
                    {newPassword.length > 0 && (
                      <View style={styles.strengthBar}>
                        {([1, 2, 3, 4] as const).map((seg) => (
                          <View
                            key={seg}
                            style={[
                              styles.strengthSeg,
                              { backgroundColor: seg <= strength ? STRENGTH_COLOR[strength] : '#222222' },
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Confirm password + inline error */}
                  <View>
                    <InputRow
                      icon="shield-checkmark-outline"
                      label="Confirm password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      focused={focused === 'confirmPw'}
                      onFocus={() => setFocused('confirmPw')}
                      onBlur={() => setFocused('')}
                      secureTextEntry
                      placeholder="Repeat new password"
                      autoCapitalize="none"
                      last
                    />
                    {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                      <Text style={styles.pwError}>Passwords don't match</Text>
                    )}
                  </View>
                </ProfileSection>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
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
    minWidth: 52,
    alignItems: 'center',
  },
  pillDisabled: {
    opacity: 0.4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.orange,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  centered: {
    paddingTop: 60,
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
  subText: {
    fontSize: 12,
    color: '#555555',
  },
  strengthBar: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 13,
    paddingTop: 4,
    paddingBottom: 10,
  },
  strengthSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  pwError: {
    fontSize: 11,
    color: '#ff4d4d',
    paddingHorizontal: 13,
    paddingBottom: 8,
  },
});
