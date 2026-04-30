import styles from './SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Ingresa calle o barrio...' }: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <span className={`material-symbols-outlined ${styles.icon}`}>search</span>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar puntos de recolección"
      />
    </div>
  );
}
