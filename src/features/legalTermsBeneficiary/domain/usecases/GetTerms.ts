import { TermsRepository } from '../repositories/TermsRepository';
import { TermsDocument } from '../entities/TermSection';

export class GetTermsUseCase {
  constructor(private readonly termsRepository: TermsRepository) {}

  async execute(): Promise<TermsDocument> {
    return this.termsRepository.getTerms();
  }
}
