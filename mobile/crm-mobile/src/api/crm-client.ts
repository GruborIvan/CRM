import axios from 'axios';
import { CRM_API_URL } from '@/src/constants/config';
import { tokenStorage } from '@/src/lib/token-storage';

export const crmClient = axios.create({
  baseURL: CRM_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Separate instance used only for token refresh — avoids interceptor infinite loop
const refreshClient = axios.create({
  baseURL: CRM_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

crmClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

crmClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        await tokenStorage.clearAll();
        return Promise.reject(error);
      }

      try {
        const { data } = await refreshClient.post<{ accessToken: string; refreshToken: string }>(
          '/auth/refresh',
          { refreshToken }
        );
        await tokenStorage.setAccessToken(data.accessToken);
        await tokenStorage.setRefreshToken(data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return crmClient(original);
      } catch {
        await tokenStorage.clearAll();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
