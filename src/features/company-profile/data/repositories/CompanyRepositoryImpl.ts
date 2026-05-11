import { CompanyRepository } from '../../domain/repositories/CompanyRepository';
import { CompanyDataSource } from '../datasources/CompanyDataSource';
import { Company } from '../../domain/entities/Company';

export class CompanyRepositoryImpl implements CompanyRepository {
  private dataSource: CompanyDataSource;

  constructor(dataSource: CompanyDataSource) {
    this.dataSource = dataSource;
  }

  getCompany(userId: string): Promise<Company> {
    return this.dataSource.getCompany(userId);
  }

  updateCompany(userId: string, updates: Partial<Company>): Promise<Company> {
    return this.dataSource.updateCompany(userId, updates);
  }

  verifyCompany(userId: string, status: 'verified' | 'rejected'): Promise<Company> {
    return this.dataSource.verifyCompany(userId, status);
  }

  listCompanies(): Promise<Company[]> {
    return this.dataSource.listCompanies();
  }
}