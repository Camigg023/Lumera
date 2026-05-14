// src/features/rewards/index.ts
// Public API of the rewards feature — the ONLY file features.ts should import from

// ── Page ─────────────────────────────────────────────────────────────────────
export { RewardsPage } from './presentation/pages/rewardsPages';

// ── Components ────────────────────────────────────────────────────────────────
export {
  Navbar as RewardsNavbar,       // aliased to avoid collision with collectionPoints' Navbar/BottomNav // same reason — both features export BottomNav
  ProgressBar,
  RewardHeader,
  RewardCard,
  RewardGrid,
  RewardHistoryItem,
} from './presentation/components';

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useUserPoints } from './presentation/hooks/useUserPoints';
export { useRewards } from './presentation/hooks/useRewards';
export { useRewardHistory } from './presentation/hooks/useRewardHistory';

// ── Domain types (public surface) ─────────────────────────────────────────────
export type { Reward, RewardCategory, RewardImageType } from './domain/entities/reward';
export type { RewardHistory, HistoryEntryStatus, HistoryEntryType } from './domain/entities/rewardHistory';
export type { UserPoints, Tier, TierLevel } from './domain/entities/userPoints';