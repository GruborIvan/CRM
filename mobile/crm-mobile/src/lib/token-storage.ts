import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'crm_access_token',
  REFRESH_TOKEN: 'crm_refresh_token',
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

const get = (key: Key): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return Promise.resolve(localStorage.getItem(key));
  }
  return SecureStore.getItemAsync(key);
};

const set = (key: Key, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }
  return SecureStore.setItemAsync(key, value);
};

const remove = (key: Key): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
  return SecureStore.deleteItemAsync(key);
};

export const tokenStorage = {
  getAccessToken: () => get(KEYS.ACCESS_TOKEN),
  setAccessToken: (token: string) => set(KEYS.ACCESS_TOKEN, token),
  getRefreshToken: () => get(KEYS.REFRESH_TOKEN),
  setRefreshToken: (token: string) => set(KEYS.REFRESH_TOKEN, token),
  clearAll: () => Promise.all([remove(KEYS.ACCESS_TOKEN), remove(KEYS.REFRESH_TOKEN)]),
};
