import { useState } from 'react';
import { createCompany } from '@/src/modules/companies/api/companies.api';

export interface CreateCompanyForm {
  name: string;
  status: number;
  email: string;
  phone: string;
  website: string;
  city: string;
  industry: string;
  notes: string;
}

export function useCreateCompany() {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const submit = async (form: CreateCompanyForm): Promise<boolean> => {
    setSubmitting(true);
    setApiError(null);
    try {
      await createCompany({
        name: form.name,
        status: form.status,
        email: form.email || undefined,
        phone: form.phone || undefined,
        website: form.website || undefined,
        city: form.city || undefined,
        industry: form.industry || undefined,
        notes: form.notes || undefined,
      });
      return true;
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Failed to create company';
      setApiError(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const clearApiError = () => setApiError(null);

  return { submit, submitting, apiError, clearApiError };
}
