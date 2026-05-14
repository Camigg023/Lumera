import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Find Pickup Points</h2>
      <div className={styles.wrapper}>
        <span className={`material-symbols-outlined ${styles.icon}`}>search</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search by neighborhood or zip code..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </section>
  );
}
