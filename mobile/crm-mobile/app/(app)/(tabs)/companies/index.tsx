import { useRouter } from 'expo-router';
import { CompaniesListScreen } from '@/screens/Companies/CompaniesListScreen';
import { Company } from '@/src/modules/companies/types/company.types';

export default function CompaniesPage() {
  const router = useRouter();

  const handleSelectCompany = (company: Company) => {
    router.push({
      pathname: '/(app)/(tabs)/companies/[id]',
      params: { id: company.id },
    });
  };

  const handleAddCompany = () => {
    router.push('/(app)/(tabs)/companies/add');
  };

  return (
    <CompaniesListScreen
      onSelectCompany={handleSelectCompany}
      onAddCompany={handleAddCompany}
    />
  );
}
