import { useRouter } from 'expo-router';
import { AddCompanyScreen } from '@/screens/Companies/AddCompanyScreen';

export default function AddCompanyPage() {
  const router = useRouter();
  return (
    <AddCompanyScreen
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}
