import type { PickupInfo } from "../../domain/entities";
import styles from "./PickupPanel.module.css";

interface PickupPanelProps {
  pickup: PickupInfo;
}

export function PickupPanel({ pickup }: PickupPanelProps) {
  return (
    <div className={styles.panel}>
      <h4 className={styles.title}>
        <span className={`material-symbols-outlined ${styles.titleIcon}`}>
          location_on
        </span>
        Pickup Information
      </h4>

      <div className={styles.info}>
        <div>
          <p className={styles.infoLabel}>Primary Hub</p>
          <p className={styles.hubName}>{pickup.hubName}</p>
          <p className={styles.hubDistance}>{pickup.distance}</p>
        </div>
        <div>
          <p className={styles.infoLabel}>Available From</p>
          <p className={styles.availableFrom}>{pickup.availableFrom}</p>
        </div>
      </div>

      <button className={styles.btn}>
        <span className="material-symbols-outlined">map</span>
        View Pickup Info
      </button>
    </div>
  );
}
