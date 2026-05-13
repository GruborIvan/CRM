import { crmClient } from '@/src/api/crm-client';
import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from '../types/auth.types';

export const authApi = {
  login: (data: LoginRequest) =>
    crmClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  refreshToken: (data: RefreshTokenRequest) =>
    crmClient.post<RefreshTokenResponse>('/auth/refresh', data).then((r) => r.data),

  logout: (data: LogoutRequest) =>
    crmClient.post<void>('/auth/logout', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    crmClient.post<void>('/auth/register', data).then((r) => r.data),
};
