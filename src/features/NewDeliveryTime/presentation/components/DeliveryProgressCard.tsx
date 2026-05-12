import type { Delivery } from "../../domain/entities";
import { ProgressBar } from "./ProgressBar";
import styles from "./DeliveryProgressCard.module.css";

interface DeliveryProgressCardProps {
  delivery: Delivery;
}

export function DeliveryProgressCard({ delivery }: DeliveryProgressCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.decorIcon}>
        <span className="material-symbols-outlined">local_shipping</span>
      </div>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <div>
            <span className={styles.trackingLabel}>Active Delivery</span>
            <h2 className={styles.trackingNumber}>{delivery.trackingNumber}</h2>
          </div>
          <div className="text-right">
            <p className={styles.arrivalLabel}>Est. Arrival</p>
            <p className={styles.arrivalTime}>{delivery.estimatedArrival}</p>
          </div>
        </div>

        <ProgressBar label="In Transit" percent={delivery.progressPercent} />

        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <p className={styles.metaCardLabel}>Contents</p>
            <p className={styles.metaCardValue}>
              {delivery.packageInfo.contents}
            </p>
          </div>
          <div className={styles.metaCard}>
            <p className={styles.metaCardLabel}>Courier</p>
            <div className={styles.courierRow}>
              <div className={styles.courierDot} />
              <p className={styles.metaCardValue}>{delivery.courier.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
