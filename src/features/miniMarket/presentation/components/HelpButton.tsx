import styles from "./HelpButton.module.css";

export function HelpButton() {
  return (
    <button className={styles.btn}>
      <span className="material-symbols-outlined">help_center</span>
      <span className={styles.expandText}>How it works</span>
    </button>
  );
}
