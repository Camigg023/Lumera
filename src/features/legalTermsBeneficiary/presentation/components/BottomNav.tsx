import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { icon: 'explore', label: 'Explore', active: false },
  { icon: 'volunteer_activism', label: 'Donate', active: false },
  { icon: 'analytics', label: 'Impact', active: false },
  { icon: 'person', label: 'Profile', active: true },
];

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={item.active ? styles.itemActive : styles.item}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
