import { UserPoints } from "../../domain/entities";
import { IRewardsRepository } from "../../domain/repositories";


export const getUserPointsUseCase = (repository: IRewardsRepository) => {
  return async (): Promise<UserPoints> => {
    return repository.getUserPoints();
  };
};
