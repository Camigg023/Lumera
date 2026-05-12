import { useState, useEffect, useCallback } from 'react';
import { TermsDocument, UserAgreement } from '../../domain/entities/TermSection';
import { GetTermsUseCase } from '../../domain/usecases/GetTerms';
import { AcceptTermsUseCase } from '../../domain/usecases/AcceptTerms';
import { TermsRepositoryImpl } from '../../data/repositories/TermsRepositoryImpl';

const repository = new TermsRepositoryImpl();
const getTermsUseCase = new GetTermsUseCase(repository);
const acceptTermsUseCase = new AcceptTermsUseCase(repository);

const MOCK_USER_ID = 'user-001';

interface UseTermsReturn {
  terms: TermsDocument | null;
  agreement: UserAgreement | null;
  isLoading: boolean;
  isAccepting: boolean;
  error: string | null;
  acceptTerms: () => Promise<void>;
  downloadPdf: () => void;
}

export function useTerms(): UseTermsReturn {
  const [terms, setTerms] = useState<TermsDocument | null>(null);
  const [agreement, setAgreement] = useState<UserAgreement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [termsData, userAgreement] = await Promise.all([
          getTermsUseCase.execute(),
          repository.getUserAgreement(MOCK_USER_ID),
        ]);
        setTerms(termsData);
        setAgreement(userAgreement);
      } catch (err) {
        setError('Failed to load terms. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const acceptTerms = useCallback(async () => {
    try {
      setIsAccepting(true);
      const result = await acceptTermsUseCase.execute(MOCK_USER_ID);
      setAgreement(result);
    } catch (err) {
      setError('Failed to accept terms. Please try again.');
      console.error(err);
    } finally {
      setIsAccepting(false);
    }
  }, []);

  const downloadPdf = useCallback(() => {
    const blob = new Blob(
      [
        `Lumera Community Agreement v${terms?.version ?? '2.4'}\nUpdated: ${terms?.updatedAt ?? 'Sept 2023'}\n\nThank you for being part of the Lumera community.`,
      ],
      { type: 'application/pdf' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumera-terms.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }, [terms]);

  return { terms, agreement, isLoading, isAccepting, error, acceptTerms, downloadPdf };
}
