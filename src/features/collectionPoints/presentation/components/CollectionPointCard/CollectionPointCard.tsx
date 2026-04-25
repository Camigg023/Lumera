
// Desde data/repositories/CollectionPointRepository.ts
import type { CollectionPoint } from '../../../../../domain/entities/CollectionPoint';
//                            ↑ sube 2 niveles desde data/repositories/
import styles from './CollectionPointCard.module.css';


interface CollectionPointCardProps {
  point: CollectionPoint;
  onDirections: (point: CollectionPoint) => void;
  onDetails: (point: CollectionPoint) => void;
}

const STATUS_CONFIG = {
  active: {
    label: 'ACTIVE',
    containerClass: 'badgeActive',
    dotClass: 'dotActive',
  },
  high_demand: {
    label: 'HIGH DEMAND',
    containerClass: 'badgeHighDemand',
    dotClass: 'dotHighDemand',
  },
  inactive: {
    label: 'INACTIVE',
    containerClass: 'badgeInactive',
    dotClass: 'dotInactive',
  },
} as const;


export function CollectionPointCard({ point, onDirections, onDetails }: CollectionPointCardProps) {
  const statusKey = point.status as keyof typeof STATUS_CONFIG;
  const { label, containerClass, dotClass } = STATUS_CONFIG[statusKey];
  const isDisabled = point.status === 'inactive';

  return (
    <article
      className={`${styles.card} ${isDisabled ? styles.cardDisabled : ''}`}
      aria-label={`${point.name}, ${point.status}`}
    >
      <div className={styles.badgeWrapper}>
        <span className={styles[containerClass]}>
          <span className={`${styles.dot} ${styles[dotClass]}`} />
          {label}
        </span>
      </div>

      <h3 className={styles.title}>{point.name}</h3>
      <p className={styles.address}>
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_on</span>
        {point.address}, {point.district}
      </p>

      <div className={styles.footer}>
        <div className={styles.distance}>
          <span className={styles.distanceLabel}>Distance</span>
          <span className={styles.distanceValue}>{point.distanceMiles} miles</span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => onDirections(point)}
            disabled={isDisabled}
            aria-label={`Get directions to ${point.name}`}
            aria-disabled={isDisabled}
          >
            <span className="material-symbols-outlined">directions</span>
          </button>
          <button
            className={isDisabled ? styles.detailsBtnDisabled : styles.detailsBtn}
            onClick={() => onDetails(point)}
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            {isDisabled ? 'Closed' : 'Details'}
          </button>
        </div>
      </div>
    </article>
  );
}
