import styles from "./HelpCard.module.css";

export function HelpCard() {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className="material-symbols-outlined">help_center</span>
      </div>
      <h3 className={styles.title}>Legal Questions?</h3>
      <p className={styles.body}>
        Need clarification on specific clauses? Our legal team is here to assist
        your compliance department.
      </p>
      <a href="#" className={styles.link}>
        Contact Compliance{" "}
        <span className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </a>
    </div>
  );
}
