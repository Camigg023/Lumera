import { LoginForm } from "../components/LoginForm";
import styles from "./LoginPage.module.css";

export type LoginPageProps = {
  /** Volver al inicio sin recarga (misma app). */
  onBackToHome?: () => void;
  /** Redirigir al home tras login exitoso. */
  onLoginSuccess?: () => void;
  /** Redirigir a la pantalla de registro. */
  onNavigateToRegister?: () => void;
  /** Redirigir a la pantalla de recuperación de contraseña. */
  onNavigateToPasswordRecovery?: () => void;
};

export const LoginPage = ({ onBackToHome, onLoginSuccess, onNavigateToRegister, onNavigateToPasswordRecovery }: LoginPageProps) => {
  return (
    <div className={styles.page}>
      {/* Left side - Image */}
      <div className={styles.imageSide}>
        <div className={styles.imageContainer}>
          <span className={styles.foodEmoji}>🍎🥕🍞🥦🍌🍇</span>
          <div className={styles.crate}>
            <div className={styles.barcode}>📦</div>
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
          
          <h1 className={styles.title}>Log In</h1>
          <p className={styles.subtitle}>Bienvenido de nuevo a Lumera.</p>
          
          <LoginForm onSuccess={onLoginSuccess} />
          
          <div className={styles.links}>
            {onNavigateToRegister ? (
              <button
                type="button"
                onClick={onNavigateToRegister}
                className={styles.link}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Crear Cuenta
              </button>
            ) : (
              <a href="#signup" className={styles.link}>Crear Cuenta</a>
            )}
            {onNavigateToPasswordRecovery ? (
              <button
                type="button"
                onClick={onNavigateToPasswordRecovery}
                className={styles.link}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Recuperar cuenta
              </button>
            ) : (
              <a href="#recover" className={styles.link}>Recuperar cuenta</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
