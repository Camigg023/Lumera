import type { CollectionPoint } from '../../../../../domain';
import styles from './MapView.module.css';

interface MapViewProps {
  points: CollectionPoint[];
  selectedRegion?: string;
  onUpdateResults?: () => void;
}

const MARKER_CONFIG = {
  active:      { icon: 'location_on',       colorClass: 'markerPrimary'   },
  high_demand: { icon: 'volunteer_activism', colorClass: 'markerSecondary' },
  inactive:    { icon: 'warehouse',          colorClass: 'markerMuted'     },
} as const;

export function MapView({ points, selectedRegion = 'Metropolitan Area', onUpdateResults }: MapViewProps) {
  return (
    <section className={styles.container} aria-label="Collection points map">
      {/* Grid background */}
      <div className={styles.grid} aria-hidden="true" />

      {/* Decorative SVG paths */}
      <svg className={styles.svgOverlay} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M0 400 Q 250 350 500 500 T 1000 450" fill="none" stroke="#4f46e5" strokeDasharray="10 10" strokeWidth="4" opacity="0.2" />
        <path d="M300 0 Q 400 300 200 600 T 400 1000" fill="none" stroke="#4f46e5" strokeDasharray="10 10" strokeWidth="3" opacity="0.2" />
      </svg>

      {/* Map markers */}
      {points.map((point) => {
        if (!point.mapPosition) return null;
        const { icon, colorClass } = MARKER_CONFIG[point.status];
        const isPrimary = point.status === 'active';

        return (
          <div
            key={point.id}
            className={styles.markerWrapper}
            style={{ top: point.mapPosition.top, left: point.mapPosition.left }}
            role="button"
            tabIndex={0}
            aria-label={point.name}
          >
            {isPrimary && <span className={styles.ping} aria-hidden="true" />}
            <div className={`${styles.marker} ${styles[colorClass]}`}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
            </div>
            <div className={styles.tooltip} role="tooltip">
              {point.name}
            </div>
          </div>
        );
      })}

      {/* Zoom controls */}
      <div className={styles.controls} aria-label="Map controls">
        {[
          { icon: 'add',         label: 'Zoom in'         },
          { icon: 'remove',      label: 'Zoom out'        },
          { icon: 'my_location', label: 'My location'     },
        ].map(({ icon, label }) => (
          <button key={icon} className={styles.controlBtn} aria-label={label}>
            <span className="material-symbols-outlined">{icon}</span>
          </button>
        ))}
      </div>

      {/* Region footer */}
      <div className={styles.regionBar}>
        <div className={styles.regionInfo}>
          <div className={styles.regionIcon}>
            <span className="material-symbols-outlined" style={{ color: '#ffffff' }}>map</span>
          </div>
          <div>
            <p className={styles.regionLabel}>Selected Region</p>
            <p className={styles.regionName}>{selectedRegion}</p>
          </div>
        </div>
        <button className={styles.updateBtn} onClick={onUpdateResults}>
          Update Results
        </button>
      </div>
    </section>
  );
}
