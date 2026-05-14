import type { EligibilityCycle } from "../../domain/entities";
import styles from "./CycleProgress.module.css";

interface CycleProgressProps {
  cycle: EligibilityCycle;
}

export function CycleProgress({ cycle }: CycleProgressProps) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = cycle.completedDays / cycle.totalDays;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={styles.card}>
      <div className={styles.ringWrapper}>
        <svg width="128" height="128" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="#e2e7ff"
            strokeWidth="8"
          />
          <circle
            className={styles.progressRingCircle}
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="#4f46e5"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className={styles.ringInner}>
          <span className={styles.ringNumber}>{cycle.completedDays}</span>
          <span className={styles.ringLabel}>Days</span>
        </div>
      </div>
      <h3 className={styles.cardTitle}>Cycle Progress</h3>
      <p className={styles.cardSubtitle}>
        {cycle.completedDays} of {cycle.totalDays} days completed
      </p>
      <div className={styles.eligibleBadge}>
        Eligible in {cycle.remainingDays} days
      </div>
    </div>
  );
}
