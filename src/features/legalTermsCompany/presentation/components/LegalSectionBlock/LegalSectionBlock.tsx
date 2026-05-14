import type { LegalSection } from "../../../domain/entities/LegalSection";
import { ComplianceList } from "../ComplianceList/ComplianceList";
import { QuoteBlock } from "../QuoteBlock/QuoteBlock";
import styles from "./LegalSectionBlock.module.css";

interface LegalSectionBlockProps {
  section: LegalSection;
}

export function LegalSectionBlock({ section }: LegalSectionBlockProps) {
  return (
    <section id={section.anchor} className={styles.section}>
      <h2 className={styles.title}>{section.title}</h2>

      {section.isHighlighted && (
        <p className={styles.highlightedText}>
          Your organization agrees to strictly adhere to all local health and
          safety regulations regarding food handling and storage prior to
          redistribution.
        </p>
      )}

      {section.content.map((paragraph, idx) => (
        <p key={idx} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}

      {section.quote && <QuoteBlock text={section.quote} />}

      {section.items && section.items.length > 0 && (
        <ComplianceList items={section.items} />
      )}
    </section>
  );
}
