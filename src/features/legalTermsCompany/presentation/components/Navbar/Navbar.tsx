import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-3xl">
            eco
          </span>
          <span className={styles.logo}>Lumera</span>
        </div>

        <div className={styles.links}>
          <a href="#" className={styles.link}>Platform</a>
          <a href="#" className={styles.link}>Resources</a>
          <a href="#" className={styles.linkActive}>Legal</a>
        </div>

        <div className={styles.avatar}>
          <div className={styles.avatarWrapper}>
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMlbR7gktP_hrhYci66n7GaTxVWmXY0MYVyF-KgUpffsm_DVXiZl9wdMHpCMHfhKnX1d40lRuYyIEL_hxHXbU6_Oae29GTy-n-rcdYszgyEBQIuKjIZqzn_eHCWpgAgMx2ytpvYMxL1tfN4pp1AFynZhloYLOcHpLk-rfRIng4yt4XXqH_sSXvPplPaLTSc1oIKMyxm_SlJhK1C-Lv_zjw9fjb2QU6XzdOwA8vE-yyDWI83hKi44_wrYEqGv7RcTC1umDRelAma3Sg"
              alt="Corporate executive"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
