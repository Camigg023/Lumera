import { useMemo, useState, useEffect } from 'react';
import { CompanyDataSource } from '../../data/datasources/CompanyDataSource';
import { CompanyRepositoryImpl } from '../../data/repositories/CompanyRepositoryImpl';
import { GetCompany } from '../../domain/usecases/GetCompany';
import { UpdateCompany } from '../../domain/usecases/UpdateCompany';
import { VerifyCompany } from '../../domain/usecases/VerifyCompany';
import { Company } from '../../domain/entities/Company';

export const useCompany = (userId: string) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getCompanyUseCase, updateCompanyUseCase, verifyCompanyUseCase } = useMemo(() => {
    const ds = new CompanyDataSource();
    const repo = new CompanyRepositoryImpl(ds);
    return {
      getCompanyUseCase: new GetCompany(repo),
      updateCompanyUseCase: new UpdateCompany(repo),
      verifyCompanyUseCase: new VerifyCompany(repo),
    };
  }, []);

  const loadCompany = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCompanyUseCase.execute(userId);
      setCompany(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load company profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompany = async (updates: Partial<Company>): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await updateCompanyUseCase.execute(userId, updates);
      setCompany(updated);
      return updated;
    } catch (e: any) {
      setError(e?.message ?? 'Failed to update company');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCompany = async (status: 'verified' | 'rejected'): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      const verified = await verifyCompanyUseCase.execute(userId, status);
      setCompany(verified);
      return verified;
    } catch (e: any) {
      setError(e?.message ?? 'Failed to verify company');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadCompany();
    }
  }, [userId]);

  return { company, isLoading, error, updateCompany, verifyCompany, reloadCompany: loadCompany };
};