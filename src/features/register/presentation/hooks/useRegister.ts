import { useMemo, useState } from 'react';
import { AuthRegisterDataSource } from '../../data/datasources/AuthRegisterDataSource';
import { AuthRegisterRepositoryImpl } from '../../data/repositories/AuthRegisterRepositoryImpl';
import { SignUpWithEmailPassword } from '../../domain/usecases/SignUpWithEmailPassword';
import { RegisterData } from '../../domain/entities/RegisterData';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCase = useMemo(() => {
    const ds = new AuthRegisterDataSource();
    const repo = new AuthRegisterRepositoryImpl(ds);
    return new SignUpWithEmailPassword(repo);
  }, []);

  const signUp = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      await useCase.execute(data);
    } catch (e: any) {
      setError(e?.message ?? 'Registration error');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading, error };
};
