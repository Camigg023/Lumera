import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-3xl">eco</span>
          <h1 className={styles.logo}>Lumera</h1>
        </div>
        <div className={styles.actions}>
          <div className={styles.avatar}>
            <img
              alt="User profile photo"
              className={styles.avatarImg}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKsOLPtDD-aBrgr1lhDSbinf5nwCjb_ivVikJqAN4Lh_f0P1nLdzjzhVSfoG52j9o5LQh19d3meNqSPgNYpZeDJUL6klJtC9LDuAbNkrcxqitpBKy_Rwp7hKgnKKxWyw2V2Itx3AEoi-q_gpNwvgaoIlo-gknK0BhHssW06VF2_0ZBK98REshKCthYFIlixELYk4MN1BVJvLfvo3kQoyPj1fbSGaBYDjdb2QEa7fywh2x7mTJUbnQvMoqSi-BeM5LSvM3jUSGyTTug"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
