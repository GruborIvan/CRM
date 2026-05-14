export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  notes?: string;
  companyId?: string;
  companyName?: string;
  createdAt?: string;
  updatedAt?: string | null;
}
