import { PasswordRecoveryForm } from "../components/PasswordRecoveryForm";
import styles from "./PasswordRecoveryPage.module.css";

export type PasswordRecoveryPageProps = {
  onBackToHome?: () => void;
  onNavigateToLogin?: () => void;
  onRecoverySuccess?: () => void;
};

export const PasswordRecoveryPage = ({ onBackToHome, onNavigateToLogin, onRecoverySuccess }: PasswordRecoveryPageProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {onBackToHome && (
          <button onClick={onBackToHome} className={styles.backLink}>
            ← Volver
          </button>
        )}

        <h1 className={styles.title}>Recuperar contraseña</h1>
        <p className={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <PasswordRecoveryForm onSuccess={onRecoverySuccess} />

        <div className={styles.links}>
          <button onClick={onNavigateToLogin} className={styles.link}>
            ← Volver al inicio de sesión
          </button>
        </div>

      </div>
    </div>
  );
};
