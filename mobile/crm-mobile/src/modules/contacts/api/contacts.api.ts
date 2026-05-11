import { crmClient } from '@/src/api/crm-client';
import { Contact } from '../types/contact.types';

export const fetchContacts = async (): Promise<Contact[]> => {
  const { data } = await crmClient.get<Contact[]>('/contacts');
  return data;
};
