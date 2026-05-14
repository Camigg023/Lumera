import { TermSection } from '../../domain/entities/TermSection';
import styles from './FairUsageCard.module.css';

interface FairUsageCardProps {
  section: TermSection;
}

export function FairUsageCard({ section }: FairUsageCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.decorCircle} />
      <div className={styles.inner}>
        <div className={styles.iconWrapper}>
          <span className="material-symbols-outlined text-2xl text-white">{section.icon}</span>
        </div>
        <h3 className={styles.title}>
          {section.number}. {section.title}
        </h3>
        <p className={styles.description}>{section.description}</p>
        {section.rules && (
          <div className={styles.badges}>
            {section.rules.map((rule) => (
              <div key={rule.id} className={styles.badge}>
                <span className="material-symbols-outlined text-[18px]">
                  {rule.id === 'fu-1' ? 'emergency' : 'diversity_1'}
                </span>
                <span>{rule.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
