import { TermSection } from '../../domain/entities/TermSection';
import { TermsDocument } from '../../domain/entities/TermSection';
import styles from './TransparencyCard.module.css';

interface TransparencyCardProps {
  section: TermSection;
  document: TermsDocument;
}

export function TransparencyCard({ section, document }: TransparencyCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h3 className={styles.title}>
            {section.number}. {section.title}
          </h3>
          <p className={styles.description}>{section.description}</p>
        </div>
        <div className={styles.versionBox}>
          <span className="material-symbols-outlined text-3xl text-primary">policy</span>
          <span className={styles.versionText}>
            Version {document.version}
            <br />
            Updated {document.updatedAt}
          </span>
        </div>
      </div>
    </div>
  );
}
