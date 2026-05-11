import { useState, useEffect } from 'react';
import { fetchCompanyById } from '@/src/modules/companies/api/companies.api';
import { Company } from '@/src/modules/companies/types/company.types';

export function useCompanyById(id: string) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCompanyById(id)
      .then((data) => { if (!cancelled) setCompany(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { company, loading, error };
}
