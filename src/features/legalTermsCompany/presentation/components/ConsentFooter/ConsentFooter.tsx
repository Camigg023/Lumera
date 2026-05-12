import styles from "./ConsentFooter.module.css";

interface ConsentFooterProps {
  accepted: boolean;
  onAcceptChange: (value: boolean) => void;
  onAccept: () => void;
}

export function ConsentFooter({
  accepted,
  onAcceptChange,
  onAccept,
}: ConsentFooterProps) {
  return (
    <div className={styles.footer}>
      <label className={styles.label}>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={accepted}
            onChange={(e) => onAcceptChange(e.target.checked)}
          />
          {accepted && (
            <span className={`material-symbols-outlined ${styles.checkIcon}`}>
              check
            </span>
          )}
        </div>
        <span className={styles.labelText}>
          I have read and agree to the{" "}
          <span className={styles.labelLink}>
            Redistribution Terms &amp; Conditions
          </span>
          .
        </span>
      </label>

      <div className={styles.actions}>
        <button className={styles.downloadBtn}>
          <span className="material-symbols-outlined text-[20px]">download</span>
          Download PDF
        </button>
        <button
          className={styles.acceptBtn}
          onClick={onAccept}
          disabled={!accepted}
        >
          Accept Terms
        </button>
      </div>
    </div>
  );
}
