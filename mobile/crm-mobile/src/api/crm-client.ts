import axios from 'axios';
import { CRM_API_URL } from '@/src/constants/config';
import { tokenStorage } from '@/src/lib/token-storage';

export const crmClient = axios.create({
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
