import styles from "./BottomNav.module.css";

const items = [
  { icon: "inventory_2", label: "Package", active: true, filled: true },
  { icon: "volunteer_activism", label: "Donate", active: false, filled: false },
  { icon: "analytics", label: "Impact", active: false, filled: false },
  { icon: "person", label: "Profile", active: false, filled: false },
];

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      {items.map((item) => (
        <a
          key={item.label}
          href="#"
          className={item.active ? styles.itemActive : styles.item}
        >
          <span
            className="material-symbols-outlined"
            style={
              item.filled
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {item.icon}
          </span>
          <span className={styles.label}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
