import styles from "./SmartAllocationPanel.module.css";

export function SmartAllocationPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.headerRow}>
        <div className={styles.iconWrap}>
          <span className="material-symbols-outlined">psychology</span>
        </div>
        <h4 className={styles.panelTitle}>Smart Allocation</h4>
      </div>

      <p className={styles.description}>
        This package was <strong>AI-generated</strong> by the Lumera Core
        system. It analyzes available local supply and cross-references it with
        your household's specific dietary profile to ensure a fair and
        nutritionally complete distribution.
      </p>

      <div className={styles.footer}>
        <div className={styles.avatarGroup}>
          {[
            { initials: "SM", bg: "#e0e7ff" },
            { initials: "LK", bg: "#f3e8ff" },
            { initials: "RT", bg: "#dbeafe" },
          ].map((a) => (
            <div
              key={a.initials}
              className={styles.avatarBubble}
              style={{ backgroundColor: a.bg }}
            >
              {a.initials}
            </div>
          ))}
        </div>
        <span className={styles.verifiedText}>Verified by 3 nutritionists</span>
      </div>
    </div>
  );
}
