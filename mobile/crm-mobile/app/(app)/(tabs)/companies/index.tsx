import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { CompaniesListScreen } from '@/screens/Companies/CompaniesListScreen';
import { useCompanies } from '@/hooks/useCompanies';
import { Company } from '@/src/modules/companies/types/company.types';

export default function CompaniesPage() {
  const router = useRouter();
  const { companies, loading, refetch } = useCompanies();

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

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
      companies={companies}
      loading={loading}
      refetch={refetch}
      onSelectCompany={handleSelectCompany}
      onAddCompany={handleAddCompany}
    />
  );
}
