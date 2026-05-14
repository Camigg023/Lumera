import styles from "./DeliveryHeader.module.css";

interface DeliveryHeaderProps {
  nextWindowDate: string;
}

export function DeliveryHeader({ nextWindowDate }: DeliveryHeaderProps) {
  return (
    <section className={styles.section}>
      <div>
        <h1 className={styles.title}>Delivery Status</h1>
        <p className={styles.subtitle}>
          Real-time logistics and eligibility tracking for your community
          redistribution box.
        </p>
      </div>
      <div className={styles.badge}>
        <span className={`material-symbols-outlined ${styles.badgeIcon}`}>
          schedule
        </span>
        <span className={styles.badgeText}>Next Window: {nextWindowDate}</span>
      </div>
    </section>
  );
}
