import { useState } from "react";
import styles from "./DashboardPage.module.css";

export type DashboardPageProps = {
  /** Cerrar sesión y volver al home/login. */
  onLogout?: () => void;
};

function IconBox({ children }: { children: React.ReactNode }) {
  return <div className={styles.iconBox}>{children}</div>;
}

function DonationCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Registrar nueva donación</h3>
      <div className={styles.donationIcons}>
        <div className={styles.iconItem}>
          <IconBox>🍽️</IconBox>
          <span>Alimento</span>
        </div>
        <div className={styles.iconItem}>
          <IconBox>📦</IconBox>
          <span>Cantidad</span>
        </div>
        <div className={styles.iconItem}>
          <IconBox>📅</IconBox>
          <span>Vencimiento</span>
        </div>
      </div>
      <button className={styles.btnPrimary}>Registrar producto</button>
    </div>
  );
}

function MapCard() {
  return (
    <div className={`${styles.card} ${styles.mapCard}`}>
      <h3 className={styles.cardTitle}>Puntos de entrega</h3>
      <div className={styles.mapPlaceholder}>
        <div className={styles.mapPin}>📍</div>
        <p className={styles.mapAddress}>Calle 10 # 43A - 15, Medellín</p>
        <p className={styles.mapVerified}>✅ Ubicación para empresas verificada</p>
      </div>
      <button className={styles.btnPrimary}>Ver puntos de entrega</button>
    </div>
  );
}

function RewardsCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Mis recompensas</h3>
      <p className={styles.levelText}>Nivel plata - 750/1000 puntos</p>
      <div className={styles.rewardIcons}>
        <span>🏆</span>
        <span>🎁</span>
        <span>🎉</span>
        <span>🎯</span>
      </div>
      <p className={styles.pointsText}>Puntos acumulados: 750</p>
    </div>
  );
}

function ActivityCard() {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Resumen actividad</h3>
      <div className={styles.activityRow}>
        <span>💰</span>
        <div>
          <p>Total Donado: <strong>250 kg</strong></p>
        </div>
      </div>
      <div className={styles.activityRow}>
        <span>🎁</span>
        <div>
          <p>Donaciones: <strong>15</strong></p>
        </div>
      </div>
      <div className={styles.activityRow}>
        <span>⚡</span>
        <div>
          <p>Nivel de Prioridad de Recolección: <strong>ALTO</strong></p>
        </div>
      </div>
    </div>
  );
}

function TraceabilityCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Trazabilidad</h3>
      <div className={styles.timeline}>
        <div className={styles.timelineItem}>
          <span className={styles.dotCompleted}>🟠</span>
          <span>Donación arroz aceptada</span>
          <span className={styles.statusTagGreen}>Solicitud enviada</span>
        </div>
        <div className={styles.timelineItem}>
          <span className={styles.dotPending}>🟠</span>
          <span>Donación arroz en proceso</span>
          <span className={styles.statusTagOrange}>En proceso</span>
        </div>
        <div className={styles.timelineItem}>
          <span className={styles.dotCompleted}>🟢</span>
          <span>Donación arroz lista</span>
          <span className={styles.statusTagGreen}>Aceptado</span>
        </div>
      </div>
      <button
        className={styles.btnLink}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Ver menos" : "Ver más"}
      </button>
    </div>
  );
}

export function DashboardPage({ onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<"donador" | "perfil" | "ayuda">(
    "donador"
  );

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.logo}>LUMERA</h1>
      </header>

      <div className={styles.container}>
        {/* Sidebar */}
        <nav className={styles.sidebar}>
          <button
            className={`${styles.navButton} ${activeTab === "donador" ? styles.active : ""}`}
            onClick={() => setActiveTab("donador")}
          >
            <span>🍃</span>
            <span>Donador</span>
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "perfil" ? styles.active : ""}`}
            onClick={() => setActiveTab("perfil")}
          >
            <span>👤</span>
            <span>Perfil</span>
          </button>
          <button
            className={`${styles.navButton} ${activeTab === "ayuda" ? styles.active : ""}`}
            onClick={() => setActiveTab("ayuda")}
          >
            <span>❓</span>
            <span>Ayuda</span>
          </button>
          {onLogout && (
            <button className={styles.navButton} onClick={onLogout}>
              <span>🚪</span>
              <span>Salir</span>
            </button>
          )}
        </nav>

        {/* Main Content */}
        <main className={styles.main}>
          {activeTab === "donador" && (
            <div className={styles.grid}>
              <div className={styles.gridRow}>
                <DonationCard />
                <MapCard />
                <RewardsCard />
              </div>
              <div className={styles.gridRow}>
                <ActivityCard />
                <TraceabilityCard />
              </div>
            </div>
          )}

          {activeTab === "perfil" && (
            <div className={styles.placeholderPanel}>
              <h2>Perfil del usuario</h2>
              <p>Configuración de cuenta y preferencias.</p>
            </div>
          )}

          {activeTab === "ayuda" && (
            <div className={styles.placeholderPanel}>
              <h2>Centro de ayuda</h2>
              <p>Preguntas frecuentes y soporte.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
