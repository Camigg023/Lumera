import { TermSection } from '../../domain/entities/TermSection';
import { FoodIntegritySection } from './FoodIntegritySection';
import { FairUsageCard } from './FairUsageCard';
import styles from './RulesGrid.module.css';

interface RulesGridProps {
  foodSection: TermSection;
  fairUsageSection: TermSection;
}

export function RulesGrid({ foodSection, fairUsageSection }: RulesGridProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.colLarge}>
        <FoodIntegritySection section={foodSection} />
      </div>
      <div className={styles.colSmall}>
        <FairUsageCard section={fairUsageSection} />
      </div>
    </div>
  );
}
