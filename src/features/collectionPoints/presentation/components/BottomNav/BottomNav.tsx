import styles from './BottomNav.module.css';

interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Explore',  icon: 'explore',             href: '#', active: true  },
  { label: 'Donate',   icon: 'volunteer_activism',  href: '#'                },
  { label: 'Impact',   icon: 'analytics',           href: '#'                },
  { label: 'Profile',  icon: 'person',              href: '#'                },
];

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Bottom navigation">
      {NAV_ITEMS.map(({ label, icon, href, active }) => (
        <a
          key={label}
          href={href}
          className={active ? styles.itemActive : styles.item}
          aria-current={active ? 'page' : undefined}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
          >
            {icon}
          </span>
          <span className={styles.label}>{label}</span>
        </a>
      ))}
    </nav>
  );
}
