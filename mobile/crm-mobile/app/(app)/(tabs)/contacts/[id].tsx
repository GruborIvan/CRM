import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { ContactDetailScreen } from '@/screens/Contacts/ContactDetailScreen';
import { Contact } from '@/src/modules/contacts/types/contact.types';

export default function ContactDetailPage() {
  const router = useRouter();
  const { id, contactJson } = useLocalSearchParams<{ id: string; contactJson: string }>();
  const [contact, setContact] = useState<Contact>(JSON.parse(contactJson));

  useEffect(() => {
    try { setContact(JSON.parse(contactJson)); } catch {}
  }, [contactJson]);

  const handleCompanyPress = () => {
    if (contact.companyId) {
      router.push({
        pathname: '/(app)/(tabs)/companies/[id]',
        params: { id: contact.companyId },
      });
    }
  };

  return (
    <ContactDetailScreen
      contact={contact}
      onBack={() => router.navigate('/(app)/(tabs)/contacts')}
      onEdit={() => router.push({
        pathname: '/(app)/(tabs)/contacts/edit',
        params: { contactJson: JSON.stringify(contact) },
      })}
      onCompanyPress={contact.companyId ? handleCompanyPress : undefined}
    />
  );
}
