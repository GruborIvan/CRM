import { useRouter } from 'expo-router';
import { AddContactScreen } from '@/screens/Contacts/AddContactScreen';

export default function AddContactPage() {
  const router = useRouter();
  return (
    <AddContactScreen
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}
