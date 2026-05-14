import styles from "./PrivacyCard.module.css";

export function PrivacyCard() {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className="material-symbols-outlined">shield</span>
      </div>
      <h3 className={styles.title}>Privacy Shield</h3>
      <p className={styles.body}>
        Learn how we encrypt and protect your company's operational data and
        employee information.
      </p>
      <a href="#" className={styles.link}>
        Privacy Policy{" "}
        <span className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </a>
    </div>
  );
}
