import { useState, useEffect, useCallback } from 'react';
import { MockRewardsDatasource } from '../../data/datasource';
import { getRewardsUseCase } from '../../application/usecases';
import { Reward, RewardCategory } from '../../domain/entities';


const repository = new MockRewardsDatasource();
const executeGetRewards = getRewardsUseCase(repository);

interface UseRewardsReturn {
  rewards: Reward[];
  filteredRewards: Reward[];
  activeCategory: RewardCategory;
  setActiveCategory: (category: RewardCategory) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useRewards = (): UseRewardsReturn => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeCategory, setActiveCategory] = useState<RewardCategory>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await executeGetRewards();
      setRewards(data);
    } catch (err) {
      setError('Failed to load rewards.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const filteredRewards =
    activeCategory === 'all'
      ? rewards
      : rewards.filter((r) => r.category === activeCategory);

  return {
    rewards,
    filteredRewards,
    activeCategory,
    setActiveCategory,
    isLoading,
    error,
    refetch: fetchRewards,
  };
};
