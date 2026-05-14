import { useState } from 'react';
import { RegisterForm, type RoleType } from "../components/RegisterForm";
import styles from "./RegisterPage.module.css";

export type RegisterPageProps = {
  onBackToHome?: () => void;
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: (role?: string) => void;
};

/* ─── Mapa de roles a imagen/info ─── */
const ROLE_VISUALS: Record<RoleType, {
  icon: string;
  title: string;
  description: string;
  gradient: string;
}> = {
  donador: {
    icon: '🤝',
    title: 'Donador',
    description: 'Conecta tu generosidad con quienes más lo necesitan.',
    gradient: 'linear-gradient(135deg, rgba(53,37,205,0.85), rgba(79,70,229,0.6))',
  },
  empresa: {
    icon: '🏢',
    title: 'Empresa',
    description: 'Transforma tu excedente en impacto social medible.',
    gradient: 'linear-gradient(135deg, rgba(242,140,51,0.85), rgba(242,140,51,0.5))',
  },
  beneficiario: {
    icon: '👨‍👩‍👧',
    title: 'Beneficiario',
    description: 'Accede a alimentos frescos y ayuda comunitaria.',
    gradient: 'linear-gradient(135deg, rgba(113,42,226,0.85), rgba(138,76,252,0.5))',
  },
};

export const RegisterPage = ({ onBackToHome, onNavigateToLogin, onRegisterSuccess }: RegisterPageProps) => {
  const [role, setRole] = useState<RoleType>("donador");
  const visual = ROLE_VISUALS[role];

  return (
    <div className={styles.page}>

      {/* LEFT - IMAGEN COMPLETA CON OVERLAY POR ROL */}
      <div
        className={styles.imageSide}
        style={{ '--role-gradient': visual.gradient } as React.CSSProperties}
      >
        <div className={styles.imageOverlay}>
          <span className={styles.roleIcon}>{visual.icon}</span>
          <h2 className={styles.roleTitle}>{visual.title}</h2>
          <p className={styles.roleDescription}>{visual.description}</p>
        </div>
      </div>

      {/* RIGHT - FORMULARIO */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>

          {onBackToHome && (
            <button onClick={onBackToHome} className={styles.backLink}>
              ← Volver al inicio
            </button>
          )}

          <h1 className={styles.title}>Crear Cuenta</h1>
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