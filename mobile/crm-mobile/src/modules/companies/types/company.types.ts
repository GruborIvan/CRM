export interface CompanyContact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  city?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  status: CompanyStatus;
  lastOrderDate?: string;
  totalOrders?: number;
  contacts?: CompanyContact[];
}

export type CompanyStatus = 'Lead' | 'Prospect' | 'Active' | 'Inactive' | 'Churned';

export interface CreateCompanyPayload {
  name: string;
  status: number;
  email?: string;
  phone?: string;
  website?: string;
  city?: string;
  industry?: string;
  notes?: string;
}
