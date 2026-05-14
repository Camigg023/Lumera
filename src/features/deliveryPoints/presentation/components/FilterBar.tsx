import styles from "./FilterBar.module.css";

const FILTERS = [
  { id: "nearest", label: "Nearest", icon: "near_me" },
  { id: "open_now", label: "Open Now", icon: "schedule" },
  { id: "high_stock", label: "High Stock", icon: "inventory_2" },
];

interface FilterBarProps {
  active: string;
  onSelect: (id: string) => void;
}

export function FilterBar({ active, onSelect }: FilterBarProps) {
  return (
    <div className={styles.bar}>
      {FILTERS.map((f) => (
        <button
          key={f.id}
          className={active === f.id ? styles.btnActive : styles.btnInactive}
          onClick={() => onSelect(f.id)}
        >
          <span className={`material-symbols-outlined ${styles.filterIcon}`}>
            {f.icon}
          </span>
          {f.label}
        </button>
      ))}
    </div>
  );
}
