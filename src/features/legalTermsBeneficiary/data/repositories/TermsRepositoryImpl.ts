import { TermsRepository } from '../../domain/repositories/TermsRepository';
import { TermsDocument, UserAgreement } from '../../domain/entities/TermSection';
import { TermsDatasource } from '../datasources/TermsDatasource';

export class TermsRepositoryImpl implements TermsRepository {
  async getTerms(): Promise<TermsDocument> {
    return TermsDatasource.fetchTerms();
  }

  async acceptTerms(userId: string): Promise<UserAgreement> {
    return TermsDatasource.saveAcceptance(userId);
  }

  async getUserAgreement(userId: string): Promise<UserAgreement | null> {
    return TermsDatasource.fetchUserAgreement(userId);
  }
}
