import { crmClient } from '@/src/api/crm-client';
import type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types/profile.types';

export const profileApi = {
  getProfile: () =>
    crmClient.get<UserProfile>('/profile/me').then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    crmClient.put<UserProfile>('/profile/me', data).then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    crmClient.post<void>('/profile/change-password', data).then((r) => r.data),
};
