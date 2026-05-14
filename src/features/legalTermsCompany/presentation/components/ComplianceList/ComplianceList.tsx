import styles from "./ComplianceList.module.css";

interface ComplianceListProps {
  items: string[];
}

export function ComplianceList({ items }: ComplianceListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index} className={styles.item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
