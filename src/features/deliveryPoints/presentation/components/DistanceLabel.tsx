import styles from "./DistanceLabel.module.css";

interface DistanceLabelProps {
  address: string;
  distanceLabel: string;
}

export function DistanceLabel({ address, distanceLabel }: DistanceLabelProps) {
  return (
    <p className={styles.label}>
      <span className={`material-symbols-outlined ${styles.icon}`}>location_on</span>
      {address}, {distanceLabel}
    </p>
  );
}
