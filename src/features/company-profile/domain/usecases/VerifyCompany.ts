import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company } from '../entities/Company';

export class VerifyCompany {
  constructor(private repository: CompanyRepository) {}

  async execute(userId: string, status: 'verified' | 'rejected'): Promise<Company> {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.repository.verifyCompany(userId, status);
  }
}