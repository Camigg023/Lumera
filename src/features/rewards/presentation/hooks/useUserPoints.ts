import { useState, useEffect, useCallback } from 'react';
import { UserPoints } from '../../domain/entities';
import { getUserPointsUseCase } from '../../application/usecases';
import { MockRewardsDatasource } from '../../data/datasource';


const repository = new MockRewardsDatasource();
const executeGetUserPoints = getUserPointsUseCase(repository);

interface UseUserPointsReturn {
  userPoints: UserPoints | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserPoints = (): UseUserPointsReturn => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPoints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await executeGetUserPoints();
      setUserPoints(data);
    } catch (err) {
      setError('Failed to load user points.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserPoints();
  }, [fetchUserPoints]);

  return { userPoints, isLoading, error, refetch: fetchUserPoints };
};
