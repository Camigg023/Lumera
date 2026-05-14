import { TermSection } from '../../domain/entities/TermSection';
import styles from './FoodIntegritySection.module.css';

interface FoodIntegritySectionProps {
  section: TermSection;
}

export function FoodIntegritySection({ section }: FoodIntegritySectionProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <span className="material-symbols-outlined text-2xl">{section.icon}</span>
        </div>
        <h3 className={styles.title}>
          {section.number}. {section.title}
        </h3>
      </div>
      <p className={styles.description}>{section.description}</p>
      {section.rules && (
        <ul className={styles.rulesList}>
          {section.rules.map((rule) => (
            <li key={rule.id} className={styles.ruleItem}>
              <strong className={styles.ruleTitle}>{rule.title}</strong>
              <span className={styles.ruleDesc}>{rule.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
