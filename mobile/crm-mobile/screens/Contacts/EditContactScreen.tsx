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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Contact } from '@/src/modules/contacts/types/contact.types';
import {
  ContactFormFields,
  ContactFormValues,
  ContactFormErrors,
} from '@/components/contacts/ContactFormFields';
import { CompanyPickerSheet } from '@/components/contacts/CompanyPickerSheet';
import { useUpdateContact } from '@/hooks/useUpdateContact';
import { useDeleteContact } from '@/hooks/useDeleteContact';

interface Props {
  contact: Contact;
  onBack: () => void;
  onSuccess: (updated: Contact) => void;
  onDeleted: () => void;
}

export function EditContactScreen({ contact, onBack, onSuccess, onDeleted }: Props) {
  const insets = useSafeAreaInsets();
  const { update, submitting, apiError: updateError } = useUpdateContact();
  const { remove, deleting, apiError: deleteError } = useDeleteContact();

  const [values, setValues] = useState<ContactFormValues>({
    firstName: contact.firstName,
    lastName: contact.lastName,
    jobTitle: contact.role ?? '',
    email: contact.email ?? '',
    phone: contact.phone ?? '',
    notes: contact.notes ?? '',
    selectedCompany: contact.companyId && contact.companyName
      ? { id: contact.companyId, name: contact.companyName }
      : null,
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [focused, setFocused] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);

  const isDirty =
    values.firstName !== contact.firstName ||
    values.lastName !== contact.lastName ||
    values.jobTitle !== (contact.role ?? '') ||
    values.email !== (contact.email ?? '') ||
    values.phone !== (contact.phone ?? '') ||
    values.notes !== (contact.notes ?? '') ||
    values.selectedCompany?.id !== contact.companyId;

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

    const payload: Parameters<typeof update>[1] = {};
    if (values.firstName !== contact.firstName) payload.firstName = values.firstName.trim();
    if (values.lastName !== contact.lastName) payload.lastName = values.lastName.trim();
    if (values.jobTitle !== (contact.role ?? '')) payload.role = values.jobTitle.trim() || undefined;
    if (values.email !== (contact.email ?? '')) payload.email = values.email.trim() || undefined;
    if (values.phone !== (contact.phone ?? '')) payload.phone = values.phone.trim() || undefined;
    if (values.notes !== (contact.notes ?? '')) payload.notes = values.notes.trim() || undefined;
    if (values.selectedCompany?.id !== contact.companyId) {
      payload.companyId = values.selectedCompany?.id ?? null;
    }

    const updated = await update(contact.id, payload);
    if (updated) onSuccess(updated);
  }

  function handleDeletePress() {
    Alert.alert(
      'Delete contact',
      'Are you sure you want to delete this contact? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await remove(contact.id);
            if (success) onDeleted();
            else if (deleteError) Alert.alert('Error', deleteError);
          },
        },
      ]
    );
  }

  const apiError = updateError;
  const busy = submitting || deleting;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.navbar}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={16} color="#bbbbbb" />
        </Pressable>
        <Text style={styles.navTitle}>Edit contact</Text>
        <Pressable
          style={[styles.savePill, (!isDirty || busy) && styles.savePillDisabled]}
          onPress={handleSave}
          disabled={!isDirty || busy}>
          {submitting
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Text style={styles.savePillText}>Save changes</Text>}
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
            disabled={busy}>
            <Ionicons name="checkmark" size={16} color="#ffffff" />
            <Text style={styles.submitBtnText}>Save changes</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
            onPress={handleDeletePress}
            disabled={busy}>
            {deleting
              ? <ActivityIndicator size="small" color="#ff4d4d" />
              : (
                <>
                  <Ionicons name="trash-outline" size={16} color="#ff4d4d" />
                  <Text style={styles.deleteBtnText}>Delete contact</Text>
                </>
              )}
          </Pressable>
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
  savePill: {
    backgroundColor: Colors.orange,
    borderRadius: 9,
    paddingVertical: 5,
    paddingHorizontal: 13,
    minWidth: 90,
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
    marginBottom: 12,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 77, 77, 0.08)',
    borderWidth: Layout.borderWidth,
    borderColor: 'rgba(255, 77, 77, 0.3)',
    borderRadius: 13,
    paddingVertical: 13,
  },
  deleteBtnPressed: {
    opacity: 0.75,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4d4d',
  },
});
