export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role?: string;
  companyId?: string;
  companyName?: string;
  createdAt?: string;
  updatedAt?: string | null;
}
