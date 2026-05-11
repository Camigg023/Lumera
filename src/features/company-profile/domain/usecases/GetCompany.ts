import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company } from '../entities/Company';

export class GetCompany {
  constructor(private repository: CompanyRepository) {}

  async execute(userId: string): Promise<Company> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.repository.getCompany(userId);
  }
}