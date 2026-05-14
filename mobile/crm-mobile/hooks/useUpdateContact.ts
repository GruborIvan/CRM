import { useState } from 'react';
import { updateContact, UpdateContactPayload } from '@/src/modules/contacts/api/contacts.api';
import { Contact } from '@/src/modules/contacts/types/contact.types';

export function useUpdateContact() {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const update = async (id: string, payload: UpdateContactPayload): Promise<Contact | null> => {
    setSubmitting(true);
    setApiError(null);
    try {
      return await updateContact(id, payload);
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Failed to update contact';
      setApiError(msg);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return { update, submitting, apiError, clearApiError: () => setApiError(null) };
}
