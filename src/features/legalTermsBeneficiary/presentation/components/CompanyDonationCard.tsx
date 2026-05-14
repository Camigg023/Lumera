import { TermSection } from '../../domain/entities/TermSection';
import styles from './CompanyDonationCard.module.css';

interface CompanyDonationCardProps {
  section: TermSection;
}

const RULE_ICONS: Record<string, string> = {
  'cd-1': 'grocery',
  'cd-2': 'local_shipping',
  'cd-3': 'receipt_long',
};

export function CompanyDonationCard({ section }: CompanyDonationCardProps) {
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
      {section.rules && (
        <div className={styles.rulesGrid}>
          {section.rules.map((rule) => (
            <div key={rule.id} className={styles.ruleItem}>
              <div className={styles.ruleIconWrapper}>
                <span className="material-symbols-outlined text-xl text-secondary">
                  {RULE_ICONS[rule.id] ?? 'check_circle'}
                </span>
              </div>
              <strong className={styles.ruleTitle}>{rule.title}</strong>
              <p className={styles.ruleDesc}>{rule.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
