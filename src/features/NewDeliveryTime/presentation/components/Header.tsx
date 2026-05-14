import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={`material-symbols-outlined ${styles.logoIcon}`}>eco</span>
          <span className={styles.logoText}>Lumera</span>
        </div>
        <div className={styles.nav}>
          <div className={styles.navLinks}>
            <span className={styles.navActive}>Impact</span>
            <span className={styles.navItem}>Donate</span>
          </div>
          <div className={styles.avatar}>
            <img
              className={styles.avatarImg}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCctpQISYNI-zi1G2w9d9p0poWViE_kYzUEEg4KdKk2Ihe7je-wJbNdGZhitJV1bqvC8H_znKk-p-bx5nRzl218RykcpQLQYiyMte6mAKQJHtvZJ4kzzw6fooXmodCFcuWPI9FRZoNGzyHCrUzTpzUV2X52vQM5_-vZnb_D_BFBsKHtgx02jiMAQQDDJr6dl3pmFe9z4S5l1xy4FxG1MnAtANH1itFeK1F-P8XaQauVs4bzWxPXXAAlrC3khai5VdaTwHdPslQZXI01"
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
