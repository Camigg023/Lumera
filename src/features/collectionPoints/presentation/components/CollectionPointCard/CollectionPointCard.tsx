import { CollectionPoint } from "../../../domain/entities/colecctionPoints";
import styles from './CollectionPointCard.module.css';

interface CollectionPointCardProps {
  point: CollectionPoint;
  onDirections: (point: CollectionPoint) => void;
  onDetails: (point: CollectionPoint) => void;
}

const STATUS_CONFIG = {
  active: {
    label: 'ACTIVO',
    containerClass: 'badgeActive',
    dotClass: 'dotActive',
  },
  high_demand: {
    label: 'ALTA DEMANDA',
    containerClass: 'badgeHighDemand',
    dotClass: 'dotHighDemand',
  },
  inactive: {
    label: 'INACTIVO',
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
          <span className={styles.distanceLabel}>Distancia</span>
          <span className={styles.distanceValue}>{point.distanceMiles} millas</span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => onDirections(point)}
            disabled={isDisabled}
            aria-label={`Obtener indicaciones para ${point.name}`}
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
            {isDisabled ? 'Cerrado' : 'Detalles'}
          </button>
        </div>
      </div>
    </article>
  );
}
