import { useState } from "react";
import styles from "./HomePage.module.css";

export type HomeNavTab = "inicio" | "sobre" | "estadisticas";

function SkylineArt() {
  const s = "#3a3a3a";
  const B: [number, number, number, number][] = [
    [0, 78, 52, 62],
    [58, 62, 44, 78],
    [108, 88, 36, 52],
    [150, 55, 48, 85],
    [204, 72, 38, 68],
    [248, 95, 28, 45],
    [282, 68, 42, 72],
    [330, 82, 34, 58],
    [370, 58, 46, 82],
    [422, 75, 40, 65],
    [468, 90, 32, 50],
    [506, 65, 52, 75],
    [564, 80, 36, 60],
    [606, 52, 44, 88],
    [656, 70, 38, 70],
    [700, 85, 30, 55],
    [736, 60, 48, 80],
    [790, 78, 40, 62],
    [836, 92, 28, 48],
    [870, 68, 44, 72],
    [920, 74, 36, 66],
    [962, 55, 50, 85],
    [1018, 82, 34, 58],
    [1058, 70, 42, 70],
    [1106, 88, 30, 52],
    [1142, 62, 58, 78],
  ];
  return (
    <svg
      className={styles.skylineSvg}
      viewBox="0 0 1200 140"
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label="Silueta urbana"
    >
      {B.map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          fill="none"
          stroke={s}
          strokeWidth="1.6"
        />
      ))}
      <line x1="0" y1="140" x2="1200" y2="140" stroke={s} strokeWidth="1.6" />
    </svg>
  );
}

function StepIcons({ step }: { step: 1 | 2 | 3 | 4 }) {
  const stroke = "#3a3a3a";
  const fill = "none";

  if (step === 1) {
    return (
      <svg viewBox="0 0 80 72" width={80} height={72} aria-hidden>
        <rect
          x="18"
          y="12"
          width="44"
          height="52"
          rx="6"
          fill="#f0ebe4"
          stroke={stroke}
          strokeWidth="1.5"
        />
        <path
          d="M38 28 L42 32 L38 36"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        <path
          d="M40 24 C44 24 47 27 47 31 C47 35 44 38 40 38 C36 38 33 35 33 31 C33 27 36 24 40 24 Z"
          fill="#f5b070"
          stroke={stroke}
          strokeWidth="1.2"
        />
        <path
          d="M52 18 L58 14 L60 20"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (step === 2) {
    return (
      <svg viewBox="0 0 100 72" width={100} height={72} aria-hidden>
        <text
          x="50"
          y="12"
          textAnchor="middle"
          fontSize="6"
          fill={stroke}
          fontFamily="system-ui,sans-serif"
        >
          RECEPCIÓN DEL BENEFICIARIO
        </text>
        <circle cx="28" cy="38" r="6" fill="#e8e0d8" stroke={stroke} />
        <circle cx="50" cy="38" r="6" fill="#e8e0d8" stroke={stroke} />
        <circle cx="72" cy="38" r="6" fill="#e8e0d8" stroke={stroke} />
        <rect
          x="22"
          y="44"
          width="14"
          height="10"
          rx="1"
          fill="#f5b070"
          stroke={stroke}
          strokeWidth="1"
        />
        <rect
          x="43"
          y="44"
          width="14"
          height="10"
          rx="1"
          fill="#c8e6c9"
          stroke={stroke}
          strokeWidth="1"
        />
        <rect
          x="65"
          y="44"
          width="14"
          height="10"
          rx="1"
          fill="#ffe0b2"
          stroke={stroke}
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (step === 3) {
    return (
      <svg viewBox="0 0 100 72" width={100} height={72} aria-hidden>
        <circle cx="22" cy="28" r="5" fill="#e8e0d8" stroke={stroke} />
        <circle cx="50" cy="22" r="5" fill="#e8e0d8" stroke={stroke} />
        <circle cx="78" cy="28" r="5" fill="#e8e0d8" stroke={stroke} />
        <path
          d="M27 30 L45 24 M55 24 L73 30 M50 27 L50 42"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.2"
        />
        <rect
          x="62"
          y="44"
          width="28"
          height="28"
          fill="#fff"
          stroke={stroke}
          strokeWidth="1.5"
        />
        <path
          d="M68 52 H84 M68 58 H84 M68 64 H76"
          stroke={stroke}
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 72" width={80} height={72} aria-hidden>
      <path
        d="M12 48 L68 48 L64 28 L16 28 Z"
        fill="#d7ccc8"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <ellipse cx="40" cy="30" rx="14" ry="6" fill="#ffe082" stroke={stroke} />
      <rect x="24" y="38" width="8" height="6" rx="1" fill="#a5d6a7" stroke={stroke} />
      <rect x="48" y="36" width="10" height="8" rx="1" fill="#ffcc80" stroke={stroke} />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width={28} height={44} viewBox="0 0 28 44" aria-hidden>
      <rect
        x="4"
        y="2"
        width="20"
        height="40"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line x1="10" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="38" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SocialIcon({ name }: { name: "facebook" | "whatsapp" | "x" | "instagram" }) {
  const common = { width: 20, height: 20, fill: "currentColor" as const };
  switch (name) {
    case "facebook":
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden>
          <path d="M13.5 22v-8.5h2.9l.4-3.4H13.5V8.1c0-1 .3-1.7 1.8-1.7h1.9V3.3c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.7H6.5v3.4h3.2V22h3.8z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden>
          <path d="M17.5 14.1c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.2.3-.3.1-.1.2-.2.2-.4.1-.2 0-.3 0-.4-.1-.1-.7-1.7-1-2.3-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.3-.3-.5-.6-.6zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.6 0-3.1-.5-4.4-1.3l-.3-.2-3.1.8.8-3-.2-.3c-.9-1.3-1.4-2.8-1.4-4.4 0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.3-8.3 8.3z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden>
          <path d="M18.2 3h3.2l-7 8.1L22 21h-5.5l-4.3-5.6L6.8 21H3.5l7.5-8.7L2 3h5.6l3.9 5.2L18.2 3z" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 24 24" aria-hidden>
          <path d="M12 7.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm0 12A7.2 7.2 0 1 1 19.2 12 7.21 7.21 0 0 1 12 19.2zm9.1-13.3a1.7 1.7 0 1 1-1.7-1.7 1.7 1.7 0 0 1 1.7 1.7z" />
        </svg>
      );
  }
}

export type HomePageProps = {
  /** Navegación en cliente al login (sin recarga ni cambio de URL). */
  onNavigateToLogin?: () => void;
};

function HomeInicioBody() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroBgBlob} aria-hidden />
        <h2 id="hero-title" className={styles.heroTitle}>
          Un proyecto para el ODS 2
        </h2>
        <div className={styles.heroInner}>
          <div className={styles.callout}>
            Lumera conecta donadores, empresas y beneficiarios para combatir el
            desperdicio y garantizar acceso a comida básica.
          </div>
          <div className={styles.skylineWrap}>
            <SkylineArt />
          </div>
        </div>
      </section>

      <section className={styles.steps} aria-labelledby="steps-title">
        <h2 id="steps-title" className={styles.visuallyHidden}>
          Cómo funciona
        </h2>
        <div className={styles.stepsGrid}>
          {(
            [
              {
                n: 1 as const,
                label: "Registro y validación de donación",
              },
              { n: 2 as const, label: "Asignación justa" },
              { n: 3 as const, label: "Trazabilidad y control" },
              { n: 4 as const, label: "Mini mercados personalizados" },
            ] as const
          ).map(({ n, label }) => (
            <article key={n} className={styles.step}>
              <div className={styles.stepNum}>{n}</div>
              <div className={styles.stepIcon}>
                <StepIcons step={n} />
              </div>
              <p className={styles.stepLabel}>{label}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function HomeSobreBody() {
  return (
    <div className={`${styles.tabPanel} ${styles.panelInner}`}>
      <h2 className={styles.panelTitle}>Sobre nosotros</h2>
      <p className={styles.panelText}>
        Lumera es una iniciativa alineada con el{" "}
        <strong>ODS 2: Hambre cero</strong>. Trabajamos para reducir el
        desperdicio de alimentos y acercar comida segura a quienes la necesitan,
        articulando a donantes, organizaciones y comunidades.
      </p>
      <p className={styles.panelText}>
        Nuestra plataforma prioriza la trazabilidad, la equidad en la
        asignación y la dignidad en cada entrega, con procesos claros y
        medibles.
      </p>
    </div>
  );
}

function HomeEstadisticasBody() {
  return (
    <div className={`${styles.tabPanel} ${styles.panelInner}`}>
      <h2 className={styles.panelTitle}>Estadísticas</h2>
      <p className={`${styles.panelText} ${styles.panelLeadCenter}`}>
        Indicadores orientativos del impacto de la red Lumera (datos de ejemplo).
      </p>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statValue}>1.2 t</p>
          <p className={styles.statLabel}>Alimentos redistribuidos (aprox.)</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statValue}>48</p>
          <p className={styles.statLabel}>Organizaciones aliadas</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statValue}>3.1k</p>
          <p className={styles.statLabel}>Beneficiarios alcanzados</p>
        </div>
      </div>
      <p className={styles.statNote}>
        Las cifras reales se actualizarán cuando la red esté en producción.
      </p>
    </div>
  );
}

function tabHeadingId(t: HomeNavTab) {
  return t === "estadisticas" ? "tab-estadisticas" : `tab-${t}`;
}

const panelIds: Record<HomeNavTab, string> = {
  inicio: "home-panel-inicio",
  sobre: "home-panel-sobre",
  estadisticas: "home-panel-estadisticas",
};

export function HomePage({ onNavigateToLogin }: HomePageProps) {
  const [tab, setTab] = useState<HomeNavTab>("inicio");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logoRow}>
          <h1 className={styles.logo}>
            <span className={styles.logoL}>L</span>
            UMERA
          </h1>
        </div>
        <nav className={styles.nav} aria-label="Principal">
          <button
            type="button"
            id="tab-inicio"
            aria-controls={panelIds.inicio}
            aria-current={tab === "inicio" ? "page" : undefined}
            className={`${styles.navButton} ${tab === "inicio" ? styles.navActive : ""}`}
            onClick={() => setTab("inicio")}
          >
            Inicio
          </button>
          {onNavigateToLogin ? (
            <button
              type="button"
              className={styles.navButton}
              onClick={onNavigateToLogin}
            >
              Iniciar sesión
            </button>
          ) : (
            <a href="#login">Iniciar sesión</a>
          )}
          <button
            type="button"
            id="tab-sobre"
            aria-controls={panelIds.sobre}
            aria-current={tab === "sobre" ? "page" : undefined}
            className={`${styles.navButton} ${tab === "sobre" ? styles.navActive : ""}`}
            onClick={() => setTab("sobre")}
          >
            Sobre nosotros
          </button>
          <button
            type="button"
            id="tab-estadisticas"
            aria-controls={panelIds.estadisticas}
            aria-current={tab === "estadisticas" ? "page" : undefined}
            className={`${styles.navButton} ${tab === "estadisticas" ? styles.navActive : ""}`}
            onClick={() => setTab("estadisticas")}
          >
            Estadísticas
          </button>
        </nav>
      </header>

      <main
        id={panelIds[tab]}
        className={styles.mainBody}
        aria-labelledby={tabHeadingId(tab)}
      >
        {tab === "inicio" ? (
          <div className={styles.tabPanel}>
            <HomeInicioBody />
          </div>
        ) : null}
        {tab === "sobre" ? <HomeSobreBody /> : null}
        {tab === "estadisticas" ? <HomeEstadisticasBody /> : null}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerLead}>
            <strong>No solo estamos creando una aplicación,</strong> estamos
            diseñando una red inteligente de redistribución de alimentos.{" "}
            <strong>Juntos generamos un impacto real.</strong>
          </p>
          <div className={styles.footerRight}>
            <div className={styles.taglineRow}>
              <PhoneIcon />
              <p className={styles.tagline}>
                <strong>Lumera:</strong> Tu donación sí importa.
              </p>
            </div>
            <div className={styles.socials}>
              <a href="#facebook" aria-label="Facebook">
                <SocialIcon name="facebook" />
              </a>
              <a href="#whatsapp" aria-label="WhatsApp">
                <SocialIcon name="whatsapp" />
              </a>
              <a href="#x" aria-label="X">
                <SocialIcon name="x" />
              </a>
              <a href="#instagram" aria-label="Instagram">
                <SocialIcon name="instagram" />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
