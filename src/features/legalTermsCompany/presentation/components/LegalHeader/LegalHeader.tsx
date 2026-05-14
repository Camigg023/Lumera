import styles from "./LegalHeader.module.css";

export function LegalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.badge}>
        <span className="material-symbols-outlined text-[16px]">verified_user</span>
        Corporate Compliance
      </div>
      <h1 className={styles.title}>Terms of Service for Companies</h1>
      <p className={styles.subtitle}>
        Please review our redistribution agreement and operational protocols. By
        using Lumera's enterprise platform, you agree to uphold our impact
        standards.
      </p>
    </header>
  );
}
