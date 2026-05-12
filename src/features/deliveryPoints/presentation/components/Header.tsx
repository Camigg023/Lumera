import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={`material-symbols-outlined ${styles.brandIcon}`}>eco</span>
          <h1 className={styles.brandName}>Lumera</h1>
        </div>
        <div className={styles.avatar}>
          <img
            className={styles.avatarImg}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzNxG2y1438P8FaBRjN10Zt1kMr0rQGFEMIqGzBMPBKPD9Kc447u3lFAODGPBZupzXKDooOt0W4plhKIrQVcz3glOsQXeeJNFeUgYReATLnBgGIWh5DviQDIOgTGDRp1WToAY4K25qvaQMB5vcuROt6DlhA7aTDCY7hnRENXN6jwPJBurI2QFM_5QMT13EfQdZVNGH8K9cb_I7kHHRmyXcKwn9bOrQBbfy2scfDf-brfGfs8alujVdve6J0z07lmPXJnxpFXYNdOmM"
            alt="User"
          />
        </div>
      </div>
    </header>
  );
}
