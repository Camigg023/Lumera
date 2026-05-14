import type { LegalSection } from "../../../domain/entities/LegalSection";
import { ConsentFooter } from "../ConsentFooter/ConsentFooter";
import { HelpCard } from "../HelpCard/HelpCard";
import { PrivacyCard } from "../HelpCard/PrivacyCard";
import { LegalSectionBlock } from "../LegalSectionBlock/LegalSectionBlock";
import styles from "./LegalContent.module.css";

interface LegalContentProps {
  sections: LegalSection[];
  accepted: boolean;
  onAcceptChange: (value: boolean) => void;
  onAccept: () => void;
}

export function LegalContent({
  sections,
  accepted,
  onAcceptChange,
  onAccept,
}: LegalContentProps) {
  return (
    <div className={styles.wrapper}>
      {/* Main scrollable card */}
      <div className={styles.card}>
        <div className={styles.scrollArea}>
          {sections.map((section) => (
            <LegalSectionBlock key={section.id} section={section} />
          ))}
        </div>

        <ConsentFooter
          accepted={accepted}
          onAcceptChange={onAcceptChange}
          onAccept={onAccept}
        />
      </div>

      {/* Help cards grid */}
      <div className={styles.helpGrid}>
        <HelpCard />
        <PrivacyCard />
      </div>
    </div>
  );
}
