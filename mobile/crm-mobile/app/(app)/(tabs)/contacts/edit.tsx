import { useRouter, useLocalSearchParams } from 'expo-router';
import { EditContactScreen } from '@/screens/Contacts/EditContactScreen';
import { Contact } from '@/src/modules/contacts/types/contact.types';

export default function EditContactPage() {
  const router = useRouter();
  const { contactJson } = useLocalSearchParams<{ contactJson: string }>();
  const contact: Contact = JSON.parse(contactJson);

  return (
    <EditContactScreen
      contact={contact}
      onBack={() => router.back()}
      onSuccess={(updated) => router.navigate({
        pathname: '/(app)/(tabs)/contacts/[id]',
        params: { id: updated.id, contactJson: JSON.stringify(updated) },
      })}
      onDeleted={() => router.replace('/(app)/(tabs)/contacts')}
    />
  );
}
