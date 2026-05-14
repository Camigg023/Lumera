
import type { RewardHistory } from '../../domain/entities/rewardHistory';
import { IRewardsRepository } from '../../domain/repositories';

export const getHistoryUseCase = (repository: IRewardsRepository) => {
  return async (): Promise<RewardHistory[]> => {
    return repository.getHistory();
  };
};
