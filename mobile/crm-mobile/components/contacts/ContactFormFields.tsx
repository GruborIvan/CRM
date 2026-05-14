import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─── FormSection ─────────────────────────────────────────────────────────────

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrapper}>
      <Text style={sectionStyles.label}>{label}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#444444',
    marginBottom: 6,
    paddingHorizontal: Layout.screenPaddingH,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: Layout.borderWidth,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});

// ─── InputRow ────────────────────────────────────────────────────────────────

interface InputRowProps {
  icon: IoniconName;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  multiline?: boolean;
  last?: boolean;
  hasError?: boolean;
  errorText?: string;
  inputStyle?: object;
}

function InputRow({
  icon,
  label,
  value,
  onChange,
  placeholder = '',
  focused,
  onFocus,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  last = false,
  hasError = false,
  errorText,
  inputStyle,
}: InputRowProps) {
  const accentColor = hasError ? '#ff4d4d' : focused ? Colors.orange : 'transparent';

  return (
    <View>
      <View
        style={[
          rowStyles.row,
          { borderLeftColor: accentColor },
          multiline && rowStyles.rowMultiline,
          !last && rowStyles.divider,
        ]}>
        <View style={[rowStyles.iconWrap, multiline && rowStyles.iconTop]}>
          <Ionicons name={icon} size={14} color={Colors.orange} />
        </View>
        <View style={rowStyles.content}>
          <Text style={rowStyles.label}>{label}</Text>
          <TextInput
            style={[rowStyles.input, inputStyle]}
            value={value}
            onChangeText={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="#2e2e2e"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
          />
        </View>
      </View>
      {hasError && errorText ? (
        <Text style={rowStyles.errorText}>{errorText}</Text>
      ) : null}
    </View>
  );
}

// ─── CompanyRow ───────────────────────────────────────────────────────────────

interface CompanyRowProps {
  selectedCompany: { id: string; name: string } | null;
  focused: boolean;
  onPress: () => void;
  last?: boolean;
}

function CompanyRow({ selectedCompany, focused, onPress, last = false }: CompanyRowProps) {
  const accentColor = focused ? Colors.orange : 'transparent';

  return (
    <Pressable
      style={[rowStyles.row, { borderLeftColor: accentColor }, !last && rowStyles.divider]}
      onPress={onPress}>
      <View style={rowStyles.iconWrap}>
        <Ionicons name="business-outline" size={14} color={Colors.orange} />
      </View>
      <View style={rowStyles.content}>
        <Text style={rowStyles.label}>Company</Text>
        <Text style={[rowStyles.input, !selectedCompany && rowStyles.placeholder]}>
          {selectedCompany ? selectedCompany.name : 'Select company...'}
        </Text>
      </View>
      {selectedCompany ? (
        <Ionicons name="checkmark" size={15} color={Colors.orange} />
      ) : (
        <Ionicons name="chevron-forward" size={13} color="#2a2a2a" />
      )}
    </Pressable>
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
  rowMultiline: {
    alignItems: 'flex-start',
    paddingTop: 11,
  },
  divider: {
    borderBottomWidth: Layout.borderWidth,
    borderBottomColor: '#1f1f1f',
  },
  iconWrap: {
    width: 16,
    alignItems: 'center',
  },
  iconTop: {
    marginTop: 2,
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
  placeholder: {
    color: '#2e2e2e',
  },
  errorText: {
    fontSize: 11,
    color: '#ff4d4d',
    paddingHorizontal: 13,
    paddingBottom: 6,
    backgroundColor: Colors.surface,
  },
});

// ─── ContactFormFields ────────────────────────────────────────────────────────

export interface ContactFormValues {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  notes: string;
  selectedCompany: { id: string; name: string } | null;
}

export interface ContactFormErrors {
  firstName?: string;
  lastName?: string;
}

interface Props {
  values: ContactFormValues;
  errors: ContactFormErrors;
  focused: string;
  onFocus: (key: string) => void;
  onBlur: () => void;
  onChange: <K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) => void;
  onCompanyPickerOpen: () => void;
}

export function ContactFormFields({
  values,
  errors,
  focused,
  onFocus,
  onBlur,
  onChange,
  onCompanyPickerOpen,
}: Props) {
  return (
    <>
      <FormSection label="Required">
        <InputRow
          icon="person-outline"
          label="First name *"
          value={values.firstName}
          onChange={(v) => onChange('firstName', v)}
          placeholder="First name"
          focused={focused === 'firstName'}
          onFocus={() => onFocus('firstName')}
          onBlur={onBlur}
          autoCapitalize="words"
          hasError={!!errors.firstName}
          errorText={errors.firstName}
        />
        <InputRow
          icon="person-outline"
          label="Last name *"
          value={values.lastName}
          onChange={(v) => onChange('lastName', v)}
          placeholder="Last name"
          focused={focused === 'lastName'}
          onFocus={() => onFocus('lastName')}
          onBlur={onBlur}
          autoCapitalize="words"
          hasError={!!errors.lastName}
          errorText={errors.lastName}
          last
        />
      </FormSection>

      <FormSection label="Role & Company">
        <InputRow
          icon="briefcase-outline"
          label="Job title"
          value={values.jobTitle}
          onChange={(v) => onChange('jobTitle', v)}
          placeholder="e.g. Owner, CEO, Sales"
          focused={focused === 'jobTitle'}
          onFocus={() => onFocus('jobTitle')}
          onBlur={onBlur}
          autoCapitalize="words"
        />
        <CompanyRow
          selectedCompany={values.selectedCompany}
          focused={focused === 'company'}
          onPress={onCompanyPickerOpen}
          last
        />
      </FormSection>

      <FormSection label="Contact info">
        <InputRow
          icon="mail-outline"
          label="Email"
          value={values.email}
          onChange={(v) => onChange('email', v)}
          placeholder="email@company.com"
          focused={focused === 'email'}
          onFocus={() => onFocus('email')}
          onBlur={onBlur}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <InputRow
          icon="call-outline"
          label="Phone"
          value={values.phone}
          onChange={(v) => onChange('phone', v)}
          placeholder="+381..."
          focused={focused === 'phone'}
          onFocus={() => onFocus('phone')}
          onBlur={onBlur}
          keyboardType="phone-pad"
          last
        />
      </FormSection>

      <FormSection label="Notes">
        <InputRow
          icon="document-text-outline"
          label="Notes"
          value={values.notes}
          onChange={(v) => onChange('notes', v)}
          placeholder="Add notes..."
          focused={focused === 'notes'}
          onFocus={() => onFocus('notes')}
          onBlur={onBlur}
          multiline
          inputStyle={formStyles.notesInput}
          last
        />
      </FormSection>
    </>
  );
}

const formStyles = StyleSheet.create({
  notesInput: {
    minHeight: 56,
    textAlignVertical: 'top',
  },
});
