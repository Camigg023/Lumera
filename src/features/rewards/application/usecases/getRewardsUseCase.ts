
import type { Reward } from '../../domain/entities/reward';
import { IRewardsRepository } from '../../domain/repositories';

export const getRewardsUseCase = (repository: IRewardsRepository) => {
  return async (): Promise<Reward[]> => {
    return repository.getRewards();
  };
};
