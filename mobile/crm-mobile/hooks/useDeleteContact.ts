import { useState } from 'react';
import { deleteContact } from '@/src/modules/contacts/api/contacts.api';

export function useDeleteContact() {
  const [deleting, setDeleting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const remove = async (id: string): Promise<boolean> => {
    setDeleting(true);
    setApiError(null);
    try {
      await deleteContact(id);
      return true;
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Failed to delete contact';
      setApiError(msg);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { remove, deleting, apiError };
}
