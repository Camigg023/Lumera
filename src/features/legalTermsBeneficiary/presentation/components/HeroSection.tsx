import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.badge}>
        <span className="material-symbols-outlined text-[18px]">verified_user</span>
        <span className="font-label-sm text-label-sm">COMMUNITY AGREEMENT</span>
      </div>
      <h2 className={styles.title}>Our Commitment to Each Other</h2>
      <p className={styles.subtitle}>
        Lumera is built on trust, abundance, and dignity. These terms aren't just legal
        rules—they're the values that keep our community thriving.
      </p>
    </section>
  );
}
