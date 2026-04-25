import type { RegionStats } from '../../../../../domain';
import styles from './StatsPanel.module.css';

interface StatsPanelProps {
  stats: RegionStats;
  courierAvatars?: string[];
}

export function StatsPanel({ stats, courierAvatars = [] }: StatsPanelProps) {
  return (
    <section className={styles.grid} aria-label="Impact statistics">
      {/* Impact Radius */}
      <div className={styles.cardImpact}>
        <div className={styles.impactContent}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, opacity: 0.8 }}>analytics</span>
          <h4 className={styles.impactTitle}>Impact Radius</h4>
          <p className={styles.impactSubtitle}>Redistribution efficiency within 10 miles.</p>
          <div className={styles.impactValue} aria-label={`${stats.impactRadiusPercent}%`}>
            {stats.impactRadiusPercent}%
          </div>
        </div>
        <div className={styles.impactBlob} aria-hidden="true" />
      </div>

      {/* Active Couriers */}
      <div className={styles.cardCouriers}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#3525cd', marginBottom: '1rem' }}>group</span>
        <h4 className={styles.cardTitle}>Active Couriers</h4>
        <p className={styles.cardSubtitle}>Volunteers currently in transit.</p>
        <div className={styles.couriersRow}>
          <div className={styles.avatarStack}>
            {courierAvatars.slice(0, 3).map((src, i) => (
              <img key={i} src={src} alt={`Courier ${i + 1}`} className={styles.avatar} />
            ))}
          </div>
          <span className={styles.courierCount}>+{stats.activeCouriers} active</span>
        </div>
      </div>

      {/* Peak Hours */}
      <div className={styles.cardPeak}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#712ae2', marginBottom: '1rem' }}>schedule</span>
        <h4 className={styles.cardTitle}>Peak Hours</h4>
        <p className={styles.cardSubtitle}>Highest donation activity observed.</p>
        <div className={styles.progressTrack} role="progressbar" aria-valuenow={stats.peakCapacityPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${stats.peakCapacityPercent}%` }} />
        </div>
        <div className={styles.progressLabels}>
          <span>{stats.peakHoursLabel}</span>
          <span className={styles.capacityValue}>{stats.peakCapacityPercent}% Capacity</span>
        </div>
      </div>
    </section>
  );
}
