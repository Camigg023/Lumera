import { useState } from 'react';
import { RegisterForm, type RoleType } from "../components/RegisterForm";
import styles from "./RegisterPage.module.css";

export type RegisterPageProps = {
  onBackToHome?: () => void;
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: (role?: string) => void;
};

/* ─── Mapa de roles a contenido (solo texto, el fondo no cambia) ─── */
const ROLE_VISUALS: Record<RoleType, {
  icon: string;
  title: string;
  description: string;
}> = {
  donador: {
    icon: '🤝',
    title: 'Donador',
    description: 'Conecta tu generosidad con quienes más lo necesitan.',
  },
  empresa: {
    icon: '🏢',
    title: 'Empresa',
    description: 'Transforma tu excedente en impacto social medible.',
  },
  beneficiario: {
    icon: '👨‍👩‍👧',
    title: 'Beneficiario',
    description: 'Accede a alimentos frescos y ayuda comunitaria.',
  },
};

export const RegisterPage = ({ onBackToHome, onNavigateToLogin, onRegisterSuccess }: RegisterPageProps) => {
  const [role, setRole] = useState<RoleType>("donador");
  const visual = ROLE_VISUALS[role];

  const steps = ['donador', 'empresa', 'beneficiario'] as const;

  return (
    <div className={styles.page}>

      {/* ─── LEFT: HERO VISUAL (fondo fijo, solo texto cambia) ─── */}
      <div className={styles.imageSide}>
        {/* Indicador de pasos */}
        <div className={styles.stepsIndicator}>
          {steps.map((s) => (
            <div
              key={s}
              className={`${styles.stepDot} ${s === role ? styles.stepDotActive : ''}`}
            />
          ))}
        </div>

        {/* Panel inferior glass */}
        <div className={styles.imageOverlay}>
          <div className={styles.roleBadge}>
            <span className={styles.roleBadgeIcon}>{visual.icon}</span>
            {role === 'donador' ? 'DONANTE INDIVIDUAL' : role === 'empresa' ? 'ENTIDAD CORPORATIVA' : 'ORGANIZACIÓN SOCIAL'}
          </div>
          <h2 className={styles.roleTitle}>{visual.title}</h2>
          <p className={styles.roleDescription}>{visual.description}</p>
        </div>
      </div>

      {/* ─── RIGHT: FORMULARIO ─── */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>

          {onBackToHome && (
            <button onClick={onBackToHome} className={styles.backLink}>
              ← Volver
            </button>
          )}

          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>Completa tus datos para empezar a donar</p>

          <RegisterForm role={role} onRoleChange={setRole} onSuccess={onRegisterSuccess} />

          <div className={styles.links}>
            <button onClick={onNavigateToLogin} className={styles.link}>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
