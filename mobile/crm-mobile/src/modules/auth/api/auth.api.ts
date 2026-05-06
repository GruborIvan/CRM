import { apiClient } from '@/src/api/client';
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
    apiClient.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<RefreshTokenResponse>('/auth/refresh', data).then((r) => r.data),

  logout: (data: LogoutRequest) =>
    apiClient.post<void>('/auth/logout', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<void>('/auth/register', data).then((r) => r.data),
};
