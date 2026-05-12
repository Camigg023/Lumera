import styles from "./EmptyState.module.css";

export function EmptyState() {
  return (
    <div className={styles.wrapper}>
      <span className={`material-symbols-outlined ${styles.icon}`}>
        location_off
      </span>
      <h3 className={styles.title}>No points found</h3>
      <p className={styles.subtitle}>
        Try adjusting your search or filters to find nearby collection points.
      </p>
    </div>
  );
}
