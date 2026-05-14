import { TermsDocument, UserAgreement } from '../entities/TermSection';

export interface TermsRepository {
  getTerms(): Promise<TermsDocument>;
  acceptTerms(userId: string): Promise<UserAgreement>;
  getUserAgreement(userId: string): Promise<UserAgreement | null>;
}
