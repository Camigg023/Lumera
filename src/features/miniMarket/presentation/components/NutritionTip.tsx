import styles from "./NutritionTip.module.css";

interface NutritionTipProps {
  tip: string;
}

export function NutritionTip({ tip }: NutritionTipProps) {
  return (
    <p className={styles.tip}>
      <strong className={styles.label}>Nutritional Tip:</strong> {tip}
    </p>
  );
}
