import styles from "./EligibilityInfo.module.css";

export function EligibilityInfo() {
  return (
    <div className={styles.card}>
      <div>
        <h3 className={styles.title}>Why the 15-day cycle?</h3>
        <p className={styles.description}>
          To ensure equitable distribution across our community networks,
          households are eligible for one large-scale redistribution box every
          15 days.
        </p>
      </div>
      <div className={styles.footer}>
        <button className={styles.button}>Request Exception</button>
        <span className={styles.note}>Subject to hub availability</span>
      </div>
    </div>
  );
}
