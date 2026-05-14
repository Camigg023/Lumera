import styles from "./BottomNav.module.css";

const NAV_ITEMS = [
  { icon: "explore", label: "Explore", active: true, filled: true },
  { icon: "volunteer_activism", label: "Donate", active: false, filled: false },
  { icon: "analytics", label: "Impact", active: false, filled: false },
  { icon: "person", label: "Profile", active: false, filled: false },
];

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <a
          key={item.label}
          href="#"
          className={item.active ? styles.itemActive : styles.item}
        >
          <span
            className="material-symbols-outlined"
            style={item.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {item.icon}
          </span>
          <span className={styles.label}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
