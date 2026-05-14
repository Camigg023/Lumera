import type { Schedule } from "../../domain/entities";
import styles from "./ScheduleInfo.module.css";

interface ScheduleInfoProps {
  schedule: Schedule;
}

export function ScheduleInfo({ schedule }: ScheduleInfoProps) {
  return (
    <div className={styles.box}>
      <p className={styles.label}>NEXT PICKUP WINDOW</p>
      <div className={styles.row}>
        <span className={`material-symbols-outlined ${styles.icon}`}>event</span>
        <p className={styles.time}>{schedule.label}</p>
      </div>
    </div>
  );
}
