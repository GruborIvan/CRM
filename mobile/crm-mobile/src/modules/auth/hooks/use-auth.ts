import { useState } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginRequest, RegisterRequest } from '../types/auth.types';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      await setSession(response.accessToken, response.refreshToken, response.user);
      return { success: true as const };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Invalid email or password';
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(data);
      return { success: true as const };
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Registration failed. Please try again.';
      setError(message);
      return { success: false as const, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}

export function useLogout() {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearSession = useAuthStore((s) => s.clearSession);

  const logout = async () => {
    if (refreshToken) {
      try {
        await authApi.logout({ refreshToken });
      } catch {
        // Clear session locally even if the server call fails
      }
    }
    await clearSession();
  };

  return { logout };
}
