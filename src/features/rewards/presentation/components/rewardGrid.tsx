import { Reward } from '../../domain/entities';
import { RewardCard } from './rewardCard';
import styles from './rewardGrid.module.css';

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Vouchers', value: 'vouchers' },
  { label: 'Impact', value: 'impact' },
];

export const RewardGrid = ({
  rewards,
  activeCategory,
  isLoading,
  onCategoryChange,
  onRedeem,
}: any) => {
  return (
    <section className={styles.section}>

      {/* HEADER */}
      <div className={styles.header}>
        <h2 className={styles.title}>Available Rewards</h2>

        <div className={styles.filters}>
          {CATEGORIES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`${styles.filter} ${
                activeCategory === value ? styles.active : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      {isLoading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {rewards.map((reward: Reward) => (
            <RewardCard key={reward.id} reward={reward} onRedeem={onRedeem} />
          ))}
        </div>
      )}

    </section>
  );
};