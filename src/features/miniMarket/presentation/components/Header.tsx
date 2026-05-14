import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={`material-symbols-outlined ${styles.brandIcon}`}>eco</span>
          <h1 className={styles.brandName}>Lumera</h1>
        </div>
        <div className={styles.right}>
          <div className={styles.badge}>
            <span className={`material-symbols-outlined ${styles.badgeIcon}`}>verified_user</span>
            <span className={styles.badgeText}>Fair Distribution Active</span>
          </div>
          <div className={styles.avatar}>
            <img
              className={styles.avatarImg}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrnAqslNfcFZp5p_NsbsZyry3pFmwKQ5FqtNhOivsIu7QsG2OSnWF9friPE3iFxu_u0M0PpaDPiUTGAxBg4Z1P1lWhHwwYxQ4VLdMC1q70lXmcvMSZjOpqCczkcql0-Kzowl1i4vOozgcKIWlS-h_1vuHtLn71xC6Pm6SksMwIP3lMK-FFTV2wCikUm3GPdGhLWjjFuUGux23ENw_-QF0bEwKNXnVgjPWNmfyhR80_7vsD7ppIZhcNtmsM-j7CGI0hhpX3tlGFoG6N"
              alt="User profile"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
