import type { DeliveryStep } from "../../domain/entities";
import styles from "./TimelineStep.module.css";

interface TimelineStepProps {
  step: DeliveryStep;
  isLast: boolean;
}

export function TimelineStep({ step, isLast }: TimelineStepProps) {
  const isCompleted = step.status === "completed";
  const isCurrent = step.status === "current";
  const isUpcoming = step.status === "upcoming";
  // last upcoming step gets more fading
  const isFaded = isUpcoming && isLast;

  function renderIcon() {
    if (isCompleted) {
      return (
        <div className={styles.iconCompleted}>
          <span className={`material-symbols-outlined ${styles.iconSymbol}`}>
            check
          </span>
        </div>
      );
    }
    if (isCurrent) {
      return (
        <div className={styles.iconCurrent}>
          <span
            className={`material-symbols-outlined ${styles.iconSymbolPulse}`}
          >
            {step.icon}
          </span>
        </div>
      );
    }
    return (
      <div className={styles.iconUpcoming}>
        <span className={`material-symbols-outlined ${styles.iconSymbol}`}>
          {step.icon}
        </span>
      </div>
    );
  }

  function getBodyClass() {
    if (isFaded) return styles.bodyFaded;
    if (isUpcoming) return styles.bodyUpcoming;
    return styles.body;
  }

  return (
    <div className={styles.step}>
      {!isLast && (
        <div
          className={`${styles.connector} ${isCompleted ? "" : styles.connectorDim}`}
        />
      )}
      {renderIcon()}
      <div className={getBodyClass()}>
        <div className={styles.titleRow}>
          <h4 className={isCurrent ? styles.stepTitleCurrent : styles.stepTitle}>
            {step.label}
          </h4>
          <span className={isCurrent ? styles.timeLabelCurrent : styles.timeLabel}>
            {step.time}
          </span>
        </div>
        <p className={styles.description}>{step.description}</p>
        
      </div>
    </div>
  );
}
