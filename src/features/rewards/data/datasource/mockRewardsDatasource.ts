import { Reward, RewardHistory, UserPoints } from "../../domain/entities";
import { IRewardsRepository } from "../../domain/repositories";


const mockRewards: Reward[] = [
  {
    id: 'reward-1',
    title: 'Artisan Coffee',
    description: 'Redeem for any medium beverage at partner cafes.',
    costInLumens: 500,
    category: 'vouchers',
    icon: 'coffee',
    imageType: 'url',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAm1_DDC8JS2N4YJtbAlBV_H15FZ3kj_DypeiWgf1j0unY_g2VZsyEwRFMRPtjgmNYCVXZIXdKEezNqmvzuCp0BjafcOM0zprBMXFg8rrvuN85lztjzhPGGxKC5Hy_94N0o3fmPhpYbAP45zJjkV9psCwb9xY5ODm4p5LdFyk8F1cE5snnt88kGYyVKCr8bhtSmSE-x1MA6iCZoBfutYmHiqyJ2MshyelZPp1i5AuTerLIrzLnXuhUvBShIF9kN1_Ps81o0o99gZXyM',
  },
  {
    id: 'reward-2',
    title: '$10 Grocery Credit',
    description: 'Use this voucher for your next purchase at FreshCo.',
    costInLumens: 1200,
    category: 'vouchers',
    icon: 'shopping_basket',
    imageType: 'url',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKNTUvSXM2MrYedDFZ7bb-DAnUI1pwC9thbxRRgJOZY6v-UCzdfizEwHHbYk6_-rHsL87GiNPZmmA0NM0LCYj9fYMEWBNbrJ32N4DmtqFHCQRusBxqnVWo7KyPsLAYMAfEDD4wU40tOdLT8Iczka7UdrIyKrwR7p6QUYtPuBSs0PlT9JxyPXv6y9wd8jcuHu3tE8lobVtWKgsxGQCWtrvpHyIdS9lOEBHtGxRzBTuErslkhgmQWHJ5h3gEqkovgnJL8oBTfkH17Jex',
  },
  {
    id: 'reward-3',
    title: 'Hero Impact Badge',
    description: 'Display this exclusive verified badge on your public profile.',
    costInLumens: 2000,
    category: 'impact',
    icon: 'military_tech',
    imageType: 'icon',
    iconOverlay: 'workspace_premium',
    gradientFrom: '#6366f1',
    gradientTo: '#9333ea',
  },
];

const mockHistory: RewardHistory[] = [
  {
    id: 'history-1',
    title: 'Cinema Ticket Voucher',
    date: 'Oct 12, 2023',
    points: 800,
    type: 'debit',
    status: 'COMPLETED',
    icon: 'confirmation_number',
  },
  {
    id: 'history-2',
    title: 'Meal Donation Pack',
    date: 'Sep 28, 2023',
    points: 1500,
    type: 'debit',
    status: 'COMPLETED',
    icon: 'restaurant',
  },
  {
    id: 'history-3',
    title: 'Welcome Bonus',
    date: 'Sep 01, 2023',
    points: 1000,
    type: 'credit',
    status: 'SYSTEM',
    icon: 'redeem',
  },
];

const mockUserPoints: UserPoints = {
  balance: 2450,
  tier: {
    current: 'Silver',
    next: 'Gold',
    pointsToNext: 550,
    progressPercent: 78,
  },
  dailyStreakDays: 12,
  canClaimDailyBonus: true,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockRewardsDatasource implements IRewardsRepository {
  async getRewards(): Promise<Reward[]> {
    await delay(400);
    return mockRewards;
  }

  async getHistory(): Promise<RewardHistory[]> {
    await delay(300);
    return mockHistory;
  }

  async getUserPoints(): Promise<UserPoints> {
    await delay(200);
    return mockUserPoints;
  }
}
