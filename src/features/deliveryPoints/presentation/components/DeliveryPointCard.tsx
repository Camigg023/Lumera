import type { DeliveryPoint } from "../../domain/entities";
import { StatusBadge } from "./StatusBadge";
import { DistanceLabel } from "./DistanceLabel";
import { ScheduleInfo } from "./ScheduleInfo";
import { CapacityIndicator } from "./CapacityIndicator";
import { SelectButton } from "./SelectButton";
import styles from "./DeliveryPointCard.module.css";

interface DeliveryPointCardProps {
  point: DeliveryPoint;
  onSelect: (id: string) => void;
}

export function DeliveryPointCard({ point, onSelect }: DeliveryPointCardProps) {
  return (
    <div
      className={`${styles.card} ${
        point.isPrimary ? styles.cardPrimary : styles.cardSecondary
      }`}
    >
      <div className={styles.body}>
        {/* Top row: info + icon */}
        <div className={styles.topRow}>
          <div className={styles.titleGroup}>
            <div className={styles.badgeRow}>
              <StatusBadge status={point.status} label={point.statusLabel} />
            </div>
            <h3 className={styles.name}>{point.name}</h3>
            <DistanceLabel
              address={point.location.address}
              distanceLabel={point.location.distanceLabel}
            />
          </div>
          <div
            className={`${styles.iconWrap} ${point.iconBgClass} ${point.iconColorClass}`}
          >
            <span className="material-symbols-outlined">{point.icon}</span>
          </div>
        </div>

        {/* Schedule or capacity */}
        {point.schedule && <ScheduleInfo schedule={point.schedule} />}
        {point.capacity && <CapacityIndicator capacity={point.capacity} />}

        {/* CTA */}
        <SelectButton status={point.status} onClick={() => onSelect(point.id)} />
      </div>
    </div>
  );
}
