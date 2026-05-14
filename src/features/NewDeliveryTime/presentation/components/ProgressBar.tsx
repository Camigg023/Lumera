import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  label: string;
  percent: number;
}

export function ProgressBar({ label, percent }: ProgressBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.label}>{label}</span>
        <span className={styles.percent}>{percent}%</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
