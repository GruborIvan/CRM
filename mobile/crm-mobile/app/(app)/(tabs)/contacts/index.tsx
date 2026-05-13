import { useRouter } from 'expo-router';

import { ContactsListScreen } from '@/screens/Contacts/ContactsListScreen';
import { Contact } from '@/src/modules/contacts/types/contact.types';

export default function ContactsPage() {
  const router = useRouter();

  const handleSelectContact = (contact: Contact) => {
    router.push({
      pathname: '/(app)/(tabs)/contacts/[id]',
      params: { id: contact.id, contactJson: JSON.stringify(contact) },
    });
  };

  return (
    <ContactsListScreen
      onSelectContact={handleSelectContact}
      onAddContact={() => {}}
    />
  );
}
