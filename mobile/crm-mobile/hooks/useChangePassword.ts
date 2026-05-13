import { useState } from 'react';
import { profileApi } from '@/src/modules/profile/api/profile.api';
import type { ChangePasswordRequest } from '@/src/modules/profile/types/profile.types';

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = async (data: ChangePasswordRequest): Promise<{ success: boolean }> => {
    setLoading(true);
    setError(null);
    try {
      await profileApi.changePassword(data);
      return { success: true };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Password change failed. Please try again.';
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error };
}
