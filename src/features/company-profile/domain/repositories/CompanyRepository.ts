import { Company } from '../entities/Company';

export interface CompanyRepository {
  getCompany(userId: string): Promise<Company>;
  updateCompany(userId: string, updates: Partial<Company>): Promise<Company>;
  verifyCompany(userId: string, status: 'verified' | 'rejected'): Promise<Company>;
  listCompanies(): Promise<Company[]>; // para administradores
}