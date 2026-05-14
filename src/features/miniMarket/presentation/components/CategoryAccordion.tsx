import type { Category } from "../../domain/entities";
import { NutritionTip } from "./NutritionTip";
import styles from "./CategoryAccordion.module.css";

interface CategoryAccordionProps {
  category: Category;
}

export function CategoryAccordion({ category }: CategoryAccordionProps) {
  return (
    <details className={styles.details}>
      <summary className={styles.summary}>
        {/* Icon */}
        <div className={`${styles.iconWrap} ${category.iconBg} ${category.iconColor}`}>
          <span className={`material-symbols-outlined ${styles.iconSymbol}`}>
            {category.icon}
          </span>
        </div>

        {/* Body */}
        <div className={styles.summaryBody}>
          <div className={styles.titleGroup}>
            <h4 className={styles.categoryTitle}>{category.name}</h4>
            <p className={styles.categoryDesc}>{category.description}</p>
          </div>
          <div className={styles.quantityRow}>
            <span className={styles.quantity}>{category.totalQuantity}</span>
            <span className={`material-symbols-outlined ${styles.expandIcon}`}>
              expand_more
            </span>
          </div>
        </div>
      </summary>

      {/* Expanded content */}
      <div className={styles.detailsContent}>
        <div className={styles.itemsGrid}>
          {category.items.map((item) => (
            <div key={item.id} className={styles.foodItem}>
              <span className={styles.foodItemName}>{item.name}</span>
              <span className={styles.foodItemQty}>{item.quantity}</span>
            </div>
          ))}
        </div>
        {category.nutritionTip && (
          <div style={{ marginTop: "0.75rem" }}>
            <NutritionTip tip={category.nutritionTip.tip} />
          </div>
        )}
      </div>
    </details>
  );
}
