import type { CollectionPointFilter } from '../../../../../domain';
import styles from './FilterChips.module.css';

interface FilterChip {
  value: CollectionPointFilter['type'];
  label: string;
  icon: string;
}

const CHIPS: FilterChip[] = [
  { value: 'nearby', label: 'Nearby', icon: 'near_me' },
  { value: 'high_demand', label: 'High Demand', icon: 'trending_up' },
  { value: 'recently_added', label: 'Recently Added', icon: 'new_releases' },
];

interface FilterChipsProps {
  active: CollectionPointFilter['type'];
  onChange: (filter: CollectionPointFilter['type']) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className={styles.container}>
      {CHIPS.map(({ value, label, icon }) => (
        <button
          key={value}
          className={value === active ? styles.chipActive : styles.chip}
          onClick={() => onChange(value)}
          aria-pressed={value === active}
        >
          <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
