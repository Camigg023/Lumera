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
      {/* Left side - Image */}
      <div className={styles.imageSide}>
        <div className={styles.imageContainer}>
          <span className={styles.foodEmoji}>🔐📧</span>
          <div className={styles.crate}>
            <div className={styles.barcode}>🔑</div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className={styles.backLink}
            >
              ← Volver al inicio
            </button>
          )}
          
          <h1 className={styles.title}>Recuperar Contraseña</h1>
          <p className={styles.subtitle}>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.</p>
          
          <PasswordRecoveryForm onSuccess={onRecoverySuccess} />
          
          <div className={styles.links}>
            <button type="button" onClick={onNavigateToLogin} className={styles.link}>
              ← Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};