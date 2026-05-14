import styles from "./SummaryCards.module.css";

export function SummaryCards() {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Allocated Items Breakdown</h3>
      <div className={styles.adjustLink}>
        <span className={`material-symbols-outlined ${styles.adjustIcon}`}>info</span>
        Adjustments Available
      </div>
    </div>
  );
}
