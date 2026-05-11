import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLogin } from '@/src/modules/auth/hooks/use-auth';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login, isLoading, error } = useLogin();

  const handleLogin = async () => {
    const result = await login({ username, password });
    if (result.success) {
      router.replace('/(app)/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <View style={styles.brand}>
          <Text style={styles.logo}>CRM</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Username</Text>
            <TextInput
              style={[styles.input, focusedField === 'username' && styles.inputFocused]}
              placeholder="Enter username"
              placeholderTextColor={Colors.textHint}
              value={username}
              onChangeText={setUsername}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
              autoComplete="username"
              editable={!isLoading}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <TextInput
              style={[styles.input, focusedField === 'password' && styles.inputFocused]}
              placeholder="Enter password"
              placeholderTextColor={Colors.textHint}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry
              autoComplete="current-password"
              editable={!isLoading}
              onSubmitEditing={handleLogin}
              returnKeyType="go"
            />
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.75}>
            {isLoading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.75}>
            <Text style={styles.linkText}>
              Don't have an account?{' '}
              <Text style={styles.linkAction}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingH,
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  form: {
    gap: Layout.gap,
  },
  errorBanner: {
    fontSize: 12,
    color: '#ff4d4d',
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderRadius: Layout.radiusMd,
    padding: 12,
    textAlign: 'center',
    borderWidth: Layout.borderWidth,
    borderColor: 'rgba(255, 77, 77, 0.3)',
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusMd,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.orange,
  },
  primaryBtn: {
    backgroundColor: Colors.orange,
    borderRadius: Layout.radiusMd,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  linkAction: {
    color: Colors.orange,
    fontWeight: '600',
  },
});
