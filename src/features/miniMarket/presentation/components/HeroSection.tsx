import type { AllocationSummary } from "../../domain/entities";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  allocation: AllocationSummary;
}

export function HeroSection({ allocation }: HeroSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        {/* Decorative elements */}
        <div className={styles.decorBlob1} />
        <div className={styles.decorBlob2} />
        <div className={styles.decorIcon}>
          <span className={`material-symbols-outlined ${styles.decorIconSymbol}`}>
            inventory_2
          </span>
        </div>

        <div className={styles.content}>
          {/* Status badges */}
          <div className={styles.badges}>
            <span className={styles.badgeWhite}>Active Allocation</span>
            <div className={styles.badgeGreen}>
              <span className={`material-symbols-outlined ${styles.badgeGreenIcon}`}>
                verified
              </span>
              <span>Balanced Status</span>
            </div>
          </div>

          {/* Title */}
          <h2 className={styles.heroTitle}>
            Your Food Package{" "}
            <br className={styles.heroBreak} />
            is Ready
          </h2>

          {/* Subtitle */}
          <p className={styles.heroSubtitle}>{allocation.householdDescription}</p>

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Duration</p>
              <div className={styles.statValueRow}>
                <span className={styles.statNumber}>{allocation.durationDays}</span>
                <span className={styles.statUnit}>Days</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Household Size</p>
              <div className={styles.statValueRow}>
                <span className={styles.statNumber}>{allocation.householdSize}</span>
                <span className={styles.statUnit}>Members</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Status</p>
              <div className={styles.statVerifiedRow}>
                <span className={`material-symbols-outlined ${styles.statVerifiedIcon}`}>
                  verified
                </span>
                <span className={styles.statVerifiedText}>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
