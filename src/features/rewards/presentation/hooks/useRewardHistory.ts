import { useState, useEffect, useCallback } from 'react';
import { MockRewardsDatasource } from '../../data/datasource';
import { getHistoryUseCase } from '../../application/usecases';
import { RewardHistory } from '../../domain/entities';


const repository = new MockRewardsDatasource();
const executeGetHistory = getHistoryUseCase(repository);

interface UseRewardHistoryReturn {
  history: RewardHistory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRewardHistory = (): UseRewardHistoryReturn => {
  const [history, setHistory] = useState<RewardHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await executeGetHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load history.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, isLoading, error, refetch: fetchHistory };
};
