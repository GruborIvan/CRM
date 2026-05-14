import { crmClient } from '@/src/api/crm-client';
import { Contact } from '../types/contact.types';

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  notes?: string;
  companyId?: string;
}

export interface UpdateContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  notes?: string;
  companyId?: string | null;
}

export const fetchContacts = async (): Promise<Contact[]> => {
  const { data } = await crmClient.get<Contact[]>('/contacts');
  return data;
};

export const fetchContactById = async (id: string): Promise<Contact> => {
  const { data } = await crmClient.get<Contact>(`/contacts/${id}`);
  return data;
};

export const createContact = async (payload: CreateContactPayload): Promise<Contact> => {
  const { data } = await crmClient.post<Contact>('/contacts', payload);
  return data;
};

export const updateContact = async (id: string, payload: UpdateContactPayload): Promise<Contact> => {
  const { data } = await crmClient.patch<Contact>(`/contacts/${id}`, payload);
  return data;
};

export const deleteContact = async (id: string): Promise<void> => {
  await crmClient.delete(`/contacts/${id}`);
};
