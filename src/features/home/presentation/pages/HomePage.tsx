import { useState } from "react";
import styles from "./HomePage.module.css";

export type HomeNavTab = "inicio" | "sobre" | "estadisticas";

interface HomePageProps {
  onNavigateToLogin?: () => void;
  onNavigateToRegister?: () => void;
}

export function HomePage({ onNavigateToLogin, onNavigateToRegister }: HomePageProps) {
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
                Transforma el exceso en esperanza
              </h2>

              <p className={styles.callout}>
                Cada alimento que donas viaja con trazabilidad hasta quien más lo necesita.
                Lumera conecta voluntad con necesidad, con transparencia y dignidad.
              </p>

              <button className={styles.ctaButton} onClick={onNavigateToRegister}>
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
                  Reducir el desperdicio de alimentos conectando donadores con 
                  comunidades vulnerables de manera eficiente, trazable y digna. 
                  Transformamos lo que sobra en puentes de solidaridad.
                </p>
              )}

              {sobreTab === "vision" && (
                <p>
                  Construir una red inteligente a nivel nacional donde el hambre 
                  sea cosa del pasado y cada alimento excedente encuentre su camino 
                  hacia quien lo necesita.
                </p>
              )}

            </div>
          </section>
        )}

        {/* ESTADISTICAS */}
        {tab === "estadisticas" && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Impacto hasta ahora</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <p className={styles.statValue}>1.2t</p>
                <p className={styles.statLabel}>Alimentos donados</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>48</p>
                <p className={styles.statLabel}>Organizaciones activas</p>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statValue}>3.1k</p>
                <p className={styles.statLabel}>Beneficiarios alcanzados</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>Lumera © {new Date().getFullYear()} — Tu donación sí importa</p>
      </footer>

    </div>
  );
}
