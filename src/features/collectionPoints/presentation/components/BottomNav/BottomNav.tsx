import styles from './BottomNav.module.css';

interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Explorar', icon: 'explore',             href: '#', active: true  },
  { label: 'Donar',    icon: 'volunteer_activism',  href: '#'                },
  { label: 'Impacto',  icon: 'analytics',           href: '#'                },
  { label: 'Perfil',   icon: 'person',              href: '#'                },
];

export function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Navegación inferior">
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
