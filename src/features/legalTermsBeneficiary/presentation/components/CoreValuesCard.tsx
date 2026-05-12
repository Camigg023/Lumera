import { TermSection } from '../../domain/entities/TermSection';
import styles from './CoreValuesCard.module.css';

interface CoreValuesCardProps {
  section: TermSection;
}

export function CoreValuesCard({ section }: CoreValuesCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <span className="material-symbols-outlined text-2xl">{section.icon}</span>
        </div>
        <div>
          <h3 className={styles.title}>
            {section.number}. {section.title}
          </h3>
          {section.subtitle && (
            <p className={styles.subtitle}>{section.subtitle}</p>
          )}
        </div>
      </div>
      <div className={styles.body}>
        <p>{section.description}</p>
        {section.rules && (
          <ul className={styles.rulesList}>
            {section.rules.map((rule) => (
              <li key={rule.id} className={styles.ruleItem}>
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                <span>{rule.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
