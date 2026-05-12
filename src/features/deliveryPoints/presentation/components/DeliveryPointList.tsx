import type { DeliveryPoint } from "../../domain/entities";
import { DeliveryPointCard } from "./DeliveryPointCard";
import { EmptyState } from "./EmptyState";
import styles from "./DeliveryPointList.module.css";

interface DeliveryPointListProps {
  points: DeliveryPoint[];
  onSelect: (id: string) => void;
}

export function DeliveryPointList({ points, onSelect }: DeliveryPointListProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Nearby Points</h2>
      {points.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.grid}>
          {points.map((point) => (
            <DeliveryPointCard key={point.id} point={point} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}
