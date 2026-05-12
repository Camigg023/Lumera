import styles from "./MapPreview.module.css";

export function MapPreview() {
  return (
    <div className={styles.mapContainer}>
      {/* Base map image */}
      <img
        className={styles.mapImg}
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhmdyB4XVJF9f6gbnedgGMmKKMLD3t2_nAl6aWVFg7UwHwv8KPZZwn2IUp7EPQ5nfiH8bJzN1Ihk-pBzgRDROuMbA_D1B-va6_GP9YZBHj9nl6fzlUi2OkrVSVAnvRy-4gLlyaqpIRRFYExRQLzI48Ocymhkc47KBzn71PABsJK14v4OGNhuJBJnrqA5NIcRn-N-ueB3XFn-q5wu8I09J174tmTUoD8J5tiiKFwa3_rWU8eclDXTb6_gn56lvkgMeYkZmRlZg3nXkx"
        alt="Map"
      />

      {/* Active pin */}
      <div className={styles.pinOverlay}>
        <div className={styles.pin}>
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
        </div>
        <div className={styles.pinLabel}>
          <span className={styles.pinLabelText}>0.8 mi</span>
        </div>
      </div>

      {/* Zoom controls */}
      <div className={styles.controls}>
        <button className={styles.controlBtn} aria-label="Zoom in">
          <span className="material-symbols-outlined">add</span>
        </button>
        <button className={styles.controlBtn} aria-label="Zoom out">
          <span className="material-symbols-outlined">remove</span>
        </button>
      </div>
    </div>
  );
}
