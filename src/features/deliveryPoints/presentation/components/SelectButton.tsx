import type { PointStatus } from "../../domain/entities";
import styles from "./SelectButton.module.css";

interface SelectButtonProps {
  status: PointStatus;
  onClick: () => void;
}

export function SelectButton({ status, onClick }: SelectButtonProps) {
  if (status === "active") {
    return (
      <button className={styles.btnPrimary} onClick={onClick}>
        <span className="material-symbols-outlined">directions</span>
        Get Directions
      </button>
    );
  }
  return (
    <button className={styles.btnSecondary} onClick={onClick}>
      <span className="material-symbols-outlined">bookmark_add</span>
      Reserve Slot
    </button>
  );
}
