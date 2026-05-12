import type { Reward } from '../entities/reward';
import type { RewardHistory } from '../entities/rewardHistory';
import type { UserPoints } from '../entities/userPoints';


export interface IRewardsRepository {
  getRewards(): Promise<Reward[]>;
  getHistory(): Promise<RewardHistory[]>;
  getUserPoints(): Promise<UserPoints>;
}