import { useState } from "react";
import styles from "./HomePage.module.css";

export type HomeNavTab = "inicio" | "sobre" | "estadisticas";

export function HomePage({ onNavigateToLogin }: any) {
  const [tab, setTab] = useState<HomeNavTab>("inicio");
  const [sobreTab, setSobreTab] = useState<"mision" | "vision">("mision");

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <header className={styles.header}>
        
        <div className={styles.topBar}>
          <h1 className={styles.logo}>LUMERA</h1>
        </div>

        <nav className={styles.nav}>
          <button className={styles.navButton} onClick={() => setTab("inicio")}>
            Inicio
          </button>
          <button
            className={styles.navButton}
            onClick={onNavigateToLogin}
          >
            Iniciar sesión
          </button>
          <button className={styles.navButton} onClick={() => setTab("sobre")}>
            Sobre Nosotros
          </button>
          <button className={styles.navButton} onClick={() => setTab("estadisticas")}>
            Estadísticas
          </button>
        </nav>

      </header>

      {/* MAIN */}
      <main className={styles.mainBody}>

        {/* HERO */}
        {tab === "inicio" && (
          <section className={styles.hero}>
            <div className={styles.overlay}>

              <h2 className={styles.heroTitle}>
                Un proyecto para el ODS 2
              </h2>

              <p className={styles.callout}>
                Eso que ya no necesitas puede convertirse en esperanza para alguien más.
                Con Lumera, tu donación sí llega, sí importa y sí transforma.
              </p>

              <button className={styles.ctaButton} onClick={onNavigateToLogin}>
                QUIERO DONAR
              </button>

            </div>
          </section>
        )}

        {/* SOBRE */}
        {tab === "sobre" && (
          <section className={styles.sobre}>
            <div className={styles.sobreOverlay}>

              <div className={styles.sobreTabs}>
                <button
                  className={`${styles.sobreBtn} ${sobreTab === "mision" ? styles.active : ""}`}
                  onClick={() => setSobreTab("mision")}
                >
                  Misión
                </button>

                <button
                  className={`${styles.sobreBtn} ${sobreTab === "vision" ? styles.active : ""}`}
                  onClick={() => setSobreTab("vision")}
                >
                  Visión
                </button>
              </div>

              {sobreTab === "mision" && (
                <p>
                  Nuestra misión es reducir el desperdicio de alimentos conectando
                  donadores con comunidades vulnerables de manera eficiente,
                  transparente y digna.
                </p>
              )}

              {sobreTab === "vision" && (
                <p>
                  Nuestra visión es construir una red inteligente a nivel nacional
                  que garantice el acceso equitativo a alimentos y elimine el hambre.
                </p>
              )}

            </div>
          </section>
        )}

        {/* ESTADISTICAS */}
        {tab === "estadisticas" && (
          <div className={styles.section}>
            <h2>Estadísticas</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statValue}>1.2t</p>
                <p>Alimentos donados</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>48</p>
                <p>Organizaciones</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>3.1k</p>
                <p>Beneficiarios</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>Lumera © 2026 - Tu donación sí importa</p>
      </footer>

    </div>
  );
}