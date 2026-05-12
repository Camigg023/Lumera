import type { EligibilityCycle } from "../../domain/entities";
import styles from "./EligibilityCard.module.css";

interface EligibilityCardProps {
  cycle: EligibilityCycle;
}

export function EligibilityCard({ cycle }: EligibilityCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={styles.cycleLabel}>Cycle Status</span>
        <span className="material-symbols-outlined">verified_user</span>
      </div>
      <h3 className={styles.title}>
        Eligible to collect in {cycle.daysRemaining} days
      </h3>
      <p className={styles.description}>
        Your next food redistribution window opens on {cycle.nextDateFull}. We
        maintain a 15-day cycle to ensure fair distribution for all members.
      </p>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${cycle.progressPercent}%` }}
        />
      </div>
      <div className={styles.progressLabels}>
        <span>Day {cycle.currentDay} of {cycle.totalDays}</span>
        <span>Next: {cycle.nextDate}</span>
      </div>
    </div>
  );
}
