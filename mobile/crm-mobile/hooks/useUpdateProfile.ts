import { useState } from 'react';
import { profileApi } from '@/src/modules/profile/api/profile.api';
import type { UpdateProfileRequest, UserProfile } from '@/src/modules/profile/types/profile.types';

type UpdateResult = { success: true; profile: UserProfile } | { success: false };

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (data: UpdateProfileRequest): Promise<UpdateResult> => {
    setLoading(true);
    setError(null);
    try {
      const profile = await profileApi.updateProfile(data);
      return { success: true, profile };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Update failed. Please try again.';
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
