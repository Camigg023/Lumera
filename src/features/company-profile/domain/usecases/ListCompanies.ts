import { CompanyRepository } from '../repositories/CompanyRepository';
import { Company } from '../entities/Company';

export class ListCompanies {
  constructor(private repository: CompanyRepository) {}

  async execute(): Promise<Company[]> {
    return this.repository.listCompanies();
  }
}