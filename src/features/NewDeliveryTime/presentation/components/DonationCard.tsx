import styles from "./DonationCard.module.css";

export function DonationCard() {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <span className={`material-symbols-outlined ${styles.icon}`}>
          volunteer_activism
        </span>
        <h3 className={styles.title}>Donate Your Slot</h3>
        <p className={styles.description}>
          Not in need this cycle? You can pass your eligibility to a neighboring
          family in our "Abundance Bridge" program.
        </p>
        <button className={styles.button}>Pass My Turn</button>
      </div>
      <div className={styles.decor} />
    </div>
  );
}
