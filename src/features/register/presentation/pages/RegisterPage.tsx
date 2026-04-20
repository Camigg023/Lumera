import { RegisterForm } from "../components/RegisterForm";
import styles from "./RegisterPage.module.css";

export type RegisterPageProps = {
  onBackToHome?: () => void;
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: () => void;
};

export const RegisterPage = ({ onBackToHome, onNavigateToLogin, onRegisterSuccess }: RegisterPageProps) => {
  return (
    <div className={styles.page}>
      {/* Left side - Image */}
      <div className={styles.imageSide}>
        <div className={styles.imageContainer}>
          <span className={styles.foodEmoji}>🌱🤝📦</span>
          <div className={styles.crate}>
            <div className={styles.barcode}>👋</div>
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
          
          <h1 className={styles.title}>Crear Cuenta</h1>
          
          <RegisterForm onSuccess={onRegisterSuccess} />
          
          <div className={styles.links}>
            <button type="button" onClick={onNavigateToLogin} className={styles.link}>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
