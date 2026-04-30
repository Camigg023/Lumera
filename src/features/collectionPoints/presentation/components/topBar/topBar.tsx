// import { href } from 'react-router-dom';
import styles from './TopBar.module.css';

interface TopBarProps {
  userAvatarUrl?: string;
}

const NAV_LINKS = [
  { label: 'Explorar', active: true },
  { label: 'Donar', active: false },
  { label: 'Impacto', active: false },
];

export function TopBar({ userAvatarUrl }: TopBarProps) {
    return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={`material-symbols-outlined ${styles.brandIcon}`}>eco</span>
          <h1 className={styles.brandName}>Lumera</h1>
        </div>
        <div className={styles.actions}>
          <nav className={styles.nav}>
            {NAV_LINKS.map(({ label, active }) => (
              <a key={label} href="#" className={active ? styles.navLinkActive : styles.navLink}>
                {label}
              </a>
            ))}
          </nav>
          {userAvatarUrl && (
            <div className={styles.avatar}>
              <img src={userAvatarUrl} alt="Perfil de Usuario" className={styles.avatarImg} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
