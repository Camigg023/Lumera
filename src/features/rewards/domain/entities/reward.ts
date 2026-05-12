export type RewardCategory = 'all' | 'vouchers' | 'impact';

export type RewardImageType = 'url' | 'icon';

export interface Reward {
  id: string;
  title: string;
  description: string;
  costInLumens: number;
  category: RewardCategory;
  icon: string;
  imageType: RewardImageType;
  imageUrl?: string;
  gradientFrom?: string;
  gradientTo?: string;
  iconOverlay?: string;
}
