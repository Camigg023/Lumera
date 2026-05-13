import { useMemo, useState } from 'react';
import { FirebaseAuthDataSource } from '../../data/datasources/FirebaseAuthDataSource';
import { FirebaseAuthRepository } from '../../data/repositories/FirebaseAuthRepository';
import { SignInWithEmailPassword } from '../../domain/usecases/SignInWithEmailPassword';
import type { User } from '../../domain/entities/User';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const useCase = useMemo(() => {
    const ds = new FirebaseAuthDataSource();
    const repo = new FirebaseAuthRepository(ds);
    return new SignInWithEmailPassword(repo);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await useCase.execute(email, password);
      setUser(u);
      return u;
    } catch (e: any) {
      setError(e?.message ?? 'Login error');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoading, error, user };
};
