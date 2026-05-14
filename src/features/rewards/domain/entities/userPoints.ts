export type TierLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Tier {
  current: TierLevel;
  next: TierLevel;
  pointsToNext: number;
  progressPercent: number;
}

export interface UserPoints {
  balance: number;
  tier: Tier;
  dailyStreakDays: number;
  canClaimDailyBonus: boolean;
}
