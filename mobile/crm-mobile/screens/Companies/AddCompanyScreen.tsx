import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { FormSection } from '@/components/companies/FormSection';
import { FormRow } from '@/components/companies/FormRow';
import { StatusPicker } from '@/components/companies/StatusPicker';
import { useCreateCompany } from '@/hooks/useCreateCompany';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export function AddCompanyScreen({ onBack, onSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const { submit, submitting, apiError } = useCreateCompany();

  const [name, setName] = useState('');
  const [status, setStatus] = useState(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [notes, setNotes] = useState('');

  const [nameError, setNameError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError('Company name is required');
      return;
    }
    setNameError('');

    const success = await submit({ name: name.trim(), status, email, phone, website, city, industry, notes });
    if (success) onSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-back" size={16} color="#bbbbbb" />
        </Pressable>
        <Text style={styles.headerTitle}>New company</Text>
        <Pressable style={[styles.saveBtn, submitting && styles.saveBtnDisabled]} onPress={handleSave} disabled={submitting}>
          {submitting
            ? <ActivityIndicator size="small" color="#ffffff" />
            : <Text style={styles.saveBtnText}>Save</Text>}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled">

        {apiError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color="#ff4d4d" />
            <Text style={styles.errorBannerText}>{apiError}</Text>
          </View>
        ) : null}

        {/* Section 1 — Required */}
        <FormSection label="Required">
          <FormRow
            icon="business-outline"
            placeholder="Company name"
            value={name}
            onChangeText={(v) => { setName(v); if (v.trim()) setNameError(''); }}
            error={nameError}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <View style={styles.statusRow}>
            <Ionicons name="pricetag-outline" size={16} color={Colors.orange} style={styles.statusIcon} />
            <StatusPicker selected={status} onChange={setStatus} />
          </View>
        </FormSection>

        {/* Section 2 — Contact info */}
        <FormSection label="Contact info">
          <FormRow
            icon="mail-outline"
            placeholder="email@company.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />
          <FormRow
            icon="call-outline"
            placeholder="+381..."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="next"
          />
          <FormRow
            icon="globe-outline"
            placeholder="www.example.com"
            value={website}
            onChangeText={setWebsite}
            autoCapitalize="none"
            returnKeyType="next"
            isLast
          />
        </FormSection>

        {/* Section 3 — Details */}
        <FormSection label="Details">
          <FormRow
            icon="location-outline"
            placeholder="City"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
            returnKeyType="next"
          />
          <FormRow
            icon="briefcase-outline"
            placeholder="e.g. Consulting"
            value={industry}
            onChangeText={setIndustry}
            autoCapitalize="words"
            returnKeyType="next"
            isLast
            rightElement={<Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />}
          />
        </FormSection>

        {/* Section 4 — Notes */}
        <FormSection label="Notes">
          <FormRow
            icon="document-text-outline"
            placeholder="Add any notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            style={styles.notesInput}
            isLast
          />
        </FormSection>

        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
          onPress={handleSave}
          disabled={submitting}>
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text style={styles.submitBtnText}>Add company</Text>
        </Pressable>

        <Text style={styles.requiredHint}>
          <Text style={styles.asterisk}>*</Text>
          {' Required fields'}
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
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
    backgroundColor: '#1e1e1e',
    borderWidth: 0.5,
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
  saveBtn: {
    backgroundColor: Colors.orange,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollContent: {
    paddingTop: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 77, 77, 0.12)',
    borderWidth: 0.5,
    borderColor: '#ff4d4d',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: Layout.screenPaddingH,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#ff4d4d',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: Layout.borderWidth,
    borderTopColor: Colors.borderSubtle,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: Layout.gap,
  },
  statusIcon: {
    width: 18,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.orange,
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: Layout.screenPaddingH,
    marginBottom: 12,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  requiredHint: {
    textAlign: 'center',
    fontSize: 11,
    color: '#333333',
    marginBottom: 8,
  },
  asterisk: {
    color: Colors.orange,
  },
});
