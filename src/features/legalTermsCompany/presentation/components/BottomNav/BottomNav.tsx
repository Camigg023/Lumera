import styles from "./BottomNav.module.css";

export function BottomNav() {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <a href="#" className={styles.item}>
          <span className="material-symbols-outlined">explore</span>
          <span className={styles.label}>Explore</span>
        </a>
        <a href="#" className={styles.item}>
          <span className="material-symbols-outlined">volunteer_activism</span>
          <span className={styles.label}>Donate</span>
        </a>
        <a href="#" className={styles.item}>
          <span className="material-symbols-outlined">analytics</span>
          <span className={styles.label}>Impact</span>
        </a>
        <a href="#" className={styles.itemActive}>
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            person
          </span>
          <span className={styles.label}>Profile</span>
        </a>
      </nav>
    </div>
  );
}
