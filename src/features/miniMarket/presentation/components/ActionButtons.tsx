import styles from "./ActionButtons.module.css";

export function ActionButtons() {
  return (
    <div className={styles.wrapper}>
      <button className={styles.btnPrimary}>
        <span className="material-symbols-outlined">task_alt</span>
        Confirm Package
      </button>
      <button className={styles.btnSecondary}>
        <span className="material-symbols-outlined">edit_note</span>
        Request Adjustment
      </button>
    </div>
  );
}
