import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import {
  ContactFormFields,
  ContactFormValues,
  ContactFormErrors,
} from '@/components/contacts/ContactFormFields';
import { CompanyPickerSheet } from '@/components/contacts/CompanyPickerSheet';
import { useCreateContact } from '@/hooks/useCreateContact';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export function AddContactScreen({ onBack, onSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const { create, submitting, apiError } = useCreateContact();

  const [values, setValues] = useState<ContactFormValues>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    notes: '',
    selectedCompany: null,
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [focused, setFocused] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const canSave = values.firstName.trim() !== '' && values.lastName.trim() !== '';

  function onChange<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === 'firstName' || key === 'lastName') {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSave() {
    const newErrors: ContactFormErrors = {};
    if (!values.firstName.trim()) newErrors.firstName = 'This field is required';
    if (!values.lastName.trim()) newErrors.lastName = 'This field is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await create({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      role: values.jobTitle.trim() || undefined,
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      notes: values.notes.trim() || undefined,
      companyId: values.selectedCompany?.id,
    });

    if (success) onSuccess();
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.navbar}>
        <Pressable style={styles.closeBtn} onPress={onBack}>
          <Ionicons name="close" size={16} color="#bbbbbb" />
        </Pressable>
        <Text style={styles.navTitle}>New contact</Text>
        <Pressable
          style={[styles.savePill, !canSave && styles.savePillDisabled]}
          onPress={handleSave}
          disabled={!canSave || submitting}>
          {submitting
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Text style={styles.savePillText}>Save</Text>}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {apiError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={15} color="#ff4d4d" />
              <Text style={styles.errorBannerText}>{apiError}</Text>
            </View>
          ) : null}

          <ContactFormFields
            values={values}
            errors={errors}
            focused={focused}
            onFocus={setFocused}
            onBlur={() => setFocused('')}
            onChange={onChange}
            onCompanyPickerOpen={() => setPickerVisible(true)}
          />

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
            onPress={handleSave}
            disabled={submitting}>
            <Ionicons name="person-add-outline" size={16} color="#ffffff" />
            <Text style={styles.submitBtnText}>Add contact</Text>
          </Pressable>

          <Text style={styles.hint}>
            <Text style={styles.asterisk}>*</Text>
            {' Required fields'}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <CompanyPickerSheet
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelect={(company) => onChange('selectedCompany', company)}
        selectedId={values.selectedCompany?.id}
      />
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
  closeBtn: {
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
  savePill: {
    backgroundColor: Colors.orange,
    borderRadius: 9,
    paddingVertical: 5,
    paddingHorizontal: 13,
    minWidth: 52,
    alignItems: 'center',
  },
  savePillDisabled: {
    opacity: 0.4,
  },
  savePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: 12,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 77, 77, 0.12)',
    borderWidth: Layout.borderWidth,
    borderColor: '#ff4d4d',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#ff4d4d',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.orange,
    borderRadius: 13,
    paddingVertical: 13,
    marginTop: 4,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  hint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#2e2e2e',
    marginTop: 10,
  },
  asterisk: {
    color: Colors.orange,
  },
});
