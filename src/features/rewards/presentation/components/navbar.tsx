import React from 'react';
import styles from './navBar.module.css';

const NAV_LINKS = ['Explore', 'Donate', 'Impact', 'Profile'] as const;
type NavLink = (typeof NAV_LINKS)[number];

interface NavbarProps {
  activeLink?: NavLink;
}

export const Navbar: React.FC<NavbarProps> = ({ activeLink = 'Profile' }) => {
  return (
    <header className={styles.navbar}>
      
      <div className={styles.container}>

        {/* IZQUIERDA */}
        <div className={styles.logo}>
          <span className="material-symbols-outlined">eco</span>
          <h1 className={styles.title}>Lumera</h1>
        </div>

        {/* DERECHA */}
        <div className={styles.right}>

          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <span
                key={link}
                className={
                  link === activeLink
                    ? styles.activeLink
                    : styles.link
                }
              >
                {link}
              </span>
            ))}
          </div>

          <div className={styles.avatar}>
            <img
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaY6AN2-q3Lrvh-LqIPGwJvq-KUZopVoWBpQDRpL2La-FUNv3-j--fkYYzU3QR6RfnKGwnCk1s1OYXFe_8HiW3ZigQei3aQd2Fk7DAH9CohPLM-fKUyMhA3YW-d6pNnK66_n3Rgo-qP1jm0oQbIGOz5MJlBNA3VuIlmy0qdlMUL9emVbvU9ecDvqCZtLoNlsW033W7XoAChL0AUj4-so4HisGALBY_zZpB1EuF7pKDr_AvoZG3JUyzh8-BQj2pJ1xhjVtmAjMWvIlb"
            />
          </div>

        </div>

      </div>

    </header>
  );
};