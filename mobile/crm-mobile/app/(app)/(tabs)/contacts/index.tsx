import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ContactsListScreen } from '@/screens/Contacts/ContactsListScreen';
import { useContacts } from '@/hooks/useContacts';
import { Contact } from '@/src/modules/contacts/types/contact.types';

export default function ContactsPage() {
  const router = useRouter();
  const { contacts, loading, refetch } = useContacts();

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  const handleSelectContact = (contact: Contact) => {
    router.push({
      pathname: '/(app)/(tabs)/contacts/[id]',
      params: { id: contact.id, contactJson: JSON.stringify(contact) },
    });
  };

  return (
    <ContactsListScreen
      contacts={contacts}
      loading={loading}
      refetch={refetch}
      onSelectContact={handleSelectContact}
      onAddContact={() => router.push('/(app)/(tabs)/contacts/add')}
    />
  );
}
