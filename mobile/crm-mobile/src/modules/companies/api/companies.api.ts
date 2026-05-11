import { crmClient } from '@/src/api/crm-client';
import { Company, CompanyStatus, CreateCompanyPayload } from '../types/company.types';

const STATUS_MAP: Record<number, CompanyStatus> = {
  0: 'Lead',
  1: 'Prospect',
  2: 'Active',
  3: 'Inactive',
  4: 'Churned',
};

function normalizeStatus(raw: unknown): CompanyStatus {
  if (typeof raw === 'number') return STATUS_MAP[raw] ?? 'Lead';
  if (typeof raw === 'string' && raw in STATUS_MAP) return raw as CompanyStatus;
  return 'Lead';
}

function normalizeCompany(raw: Company & { status: unknown }): Company {
  return { ...raw, status: normalizeStatus(raw.status) };
}

export const fetchCompanies = async (): Promise<Company[]> => {
  const { data } = await crmClient.get<Company[]>('/companies');
  return data.map((c) => normalizeCompany(c as Company & { status: unknown }));
};

export const fetchCompanyById = async (id: string): Promise<Company> => {
  const { data } = await crmClient.get<Company>(`/companies/${id}`);
  return normalizeCompany(data as Company & { status: unknown });
};

export const createCompany = async (payload: CreateCompanyPayload): Promise<Company> => {
  const { data } = await crmClient.post<Company>('/companies', payload);
  return normalizeCompany(data as Company & { status: unknown });
};
