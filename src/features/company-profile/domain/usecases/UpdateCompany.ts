import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company } from '../entities/Company';

export class UpdateCompany {
  constructor(private repository: CompanyRepository) {}

  async execute(userId: string, updates: Partial<Company>): Promise<Company> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.repository.updateCompany(userId, updates);
  }
}