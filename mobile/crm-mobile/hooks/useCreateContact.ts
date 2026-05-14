import { useState } from 'react';
import { createContact, CreateContactPayload } from '@/src/modules/contacts/api/contacts.api';

export function useCreateContact() {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const create = async (payload: CreateContactPayload): Promise<boolean> => {
    setSubmitting(true);
    setApiError(null);
    try {
      await createContact(payload);
      return true;
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Failed to create contact';
      setApiError(msg);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { create, submitting, apiError, clearApiError: () => setApiError(null) };
}
