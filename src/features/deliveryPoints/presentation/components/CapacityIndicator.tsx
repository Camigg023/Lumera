import type { Capacity } from "../../domain/entities";
import styles from "./CapacityIndicator.module.css";

interface CapacityIndicatorProps {
  capacity: Capacity;
}

export function CapacityIndicator({ capacity }: CapacityIndicatorProps) {
  return (
    <div className={styles.box}>
      <div>
        <p className={styles.label}>AVAILABLE SLOTS</p>
        <p className={styles.slots}>{capacity.remainingSlots} Remaining</p>
      </div>
      <div className={styles.avatarGroup}>
        <div className={`${styles.avatar} ${styles.avatarPlain}`} />
        <div className={`${styles.avatar} ${styles.avatarMd}`} />
        <div className={`${styles.avatar} ${styles.avatarCount}`}>
          +{capacity.avatarCount}
        </div>
      </div>
    </div>
  );
}
