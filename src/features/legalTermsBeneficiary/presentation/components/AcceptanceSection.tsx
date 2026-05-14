import { UserAgreement } from '../../domain/entities/TermSection';
import styles from './AcceptanceSection.module.css';

interface AcceptanceSectionProps {
  agreement: UserAgreement | null;
  isAccepting: boolean;
  onAccept: () => void;
  onDownload: () => void;
}

export function AcceptanceSection({
  agreement,
  isAccepting,
  onAccept,
  onDownload,
}: AcceptanceSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.box}>
        <h3 className={styles.title}>Ready to join the movement?</h3>
        <p className={styles.description}>
          By clicking below, you acknowledge that you have read and agreed to the Lumera
          User Terms and Community Guidelines.
        </p>
        {agreement?.hasAccepted && (
          <div className={styles.acceptedBadge}>
            <span className="material-symbols-outlined text-xl">check_circle</span>
            <span>Terms accepted on {agreement.acceptedAt?.toLocaleDateString()}</span>
          </div>
        )}
        <div className={styles.actions}>
          <button
            className={styles.primaryBtn}
            onClick={onAccept}
            disabled={isAccepting || !!agreement?.hasAccepted}
          >
            {isAccepting
              ? 'Accepting...'
              : agreement?.hasAccepted
              ? 'Terms Accepted'
              : 'I Accept the Terms'}
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_right</span>
          </button>
          <button className={styles.secondaryBtn} onClick={onDownload}>
            Download PDF
          </button>
        </div>
      </div>
    </section>
  );
}
