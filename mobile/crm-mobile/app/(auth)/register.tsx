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
import { useRegister } from '@/src/modules/auth/hooks/use-auth';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register, isLoading, error } = useRegister();

  const clearError = (field: string) =>
    setFieldErrors((e) => ({ ...e, [field]: '' }));

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = 'Username is required.';
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) errors.password = 'Password is required.';
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    return errors;
  };

  const handleRegister = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    const result = await register({ username, email, password });
    if (result.success) {
      router.replace('/(auth)/login');
    }
  };

  const fields: Array<{
    key: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    secure?: boolean;
    keyboardType?: 'default' | 'email-address';
    autoComplete?: 'username-new' | 'email' | 'new-password';
  }> = [
    {
      key: 'username',
      label: 'Username',
      placeholder: 'Enter username',
      value: username,
      onChange: (v) => { setUsername(v); clearError('username'); },
      autoComplete: 'username-new',
    },
    {
      key: 'email',
      label: 'Email',
      placeholder: 'Enter email',
      value: email,
      onChange: (v) => { setEmail(v); clearError('email'); },
      keyboardType: 'email-address',
      autoComplete: 'email',
    },
    {
      key: 'password',
      label: 'Password',
      placeholder: 'Enter password',
      value: password,
      onChange: (v) => { setPassword(v); clearError('password'); },
      secure: true,
      autoComplete: 'new-password',
    },
    {
      key: 'confirmPassword',
      label: 'Confirm password',
      placeholder: 'Re-enter password',
      value: confirmPassword,
      onChange: (v) => { setConfirmPassword(v); clearError('confirmPassword'); },
      secure: true,
      autoComplete: 'new-password',
    },
  ];

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
          <Text style={styles.subtitle}>Create an account</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

          {fields.map((f) => (
            <View key={f.key} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === f.key && styles.inputFocused,
                  fieldErrors[f.key] ? styles.inputError : undefined,
                ]}
                placeholder={f.placeholder}
                placeholderTextColor={Colors.textHint}
                value={f.value}
                onChangeText={f.onChange}
                onFocus={() => setFocusedField(f.key)}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={f.secure}
                keyboardType={f.keyboardType ?? 'default'}
                autoComplete={f.autoComplete}
                autoCapitalize="none"
                editable={!isLoading}
                onSubmitEditing={f.key === 'confirmPassword' ? handleRegister : undefined}
                returnKeyType={f.key === 'confirmPassword' ? 'go' : 'next'}
              />
              {fieldErrors[f.key] ? (
                <Text style={styles.fieldError}>{fieldErrors[f.key]}</Text>
              ) : null}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.primaryBtn, isLoading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.75}>
            {isLoading ? (
              <ActivityIndicator color={Colors.textPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.75}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkAction}>Sign In</Text>
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
    marginBottom: 36,
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
  inputError: {
    borderColor: '#ff4d4d',
  },
  fieldError: {
    fontSize: 12,
    color: '#ff4d4d',
    marginLeft: 2,
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
