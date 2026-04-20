import { useMemo, useState } from 'react';
import { PasswordRecoveryRepositoryImpl } from '../../data/repositories/PasswordRecoveryRepositoryImpl';
import { SendPasswordResetEmail } from '../../domain/usecases/SendPasswordResetEmail';

export const usePasswordRecovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const useCase = useMemo(() => {
    const repo = new PasswordRecoveryRepositoryImpl();
    return new SendPasswordResetEmail(repo);
  }, []);

  const sendResetEmail = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await useCase.execute(email);
      setSuccess(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to send password reset email');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendResetEmail, isLoading, error, success };
};