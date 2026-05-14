import type { PointStatus } from "../../domain/entities";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  status: PointStatus;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  if (status === "active") {
    return (
      <div className={styles.active}>
        <span className={styles.activeDot} />
        <span className={styles.activeText}>{label}</span>
      </div>
    );
  }
  if (status === "high_demand") {
    return <span className={styles.highDemand}>{label}</span>;
  }
  return <span className={styles.highDemand}>{label}</span>;
}
