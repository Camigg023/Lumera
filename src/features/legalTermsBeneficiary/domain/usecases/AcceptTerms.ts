import { TermsRepository } from '../repositories/TermsRepository';
import { UserAgreement } from '../entities/TermSection';

export class AcceptTermsUseCase {
  constructor(private readonly termsRepository: TermsRepository) {}

  async execute(userId: string): Promise<UserAgreement> {
    return this.termsRepository.acceptTerms(userId);
  }
}
