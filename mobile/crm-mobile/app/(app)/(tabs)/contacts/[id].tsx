import { useLocalSearchParams, useRouter } from 'expo-router';

import { ContactDetailScreen } from '@/screens/Contacts/ContactDetailScreen';
import { Contact } from '@/src/modules/contacts/types/contact.types';

export default function ContactDetailPage() {
  const router = useRouter();
  const { contactJson } = useLocalSearchParams<{ id: string; contactJson: string }>();

  const contact: Contact = JSON.parse(contactJson);

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
      onBack={() => router.back()}
      onEdit={() => {}}
      onCompanyPress={contact.companyId ? handleCompanyPress : undefined}
    />
  );
}
