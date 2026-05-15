import { LoginForm } from "../components/LoginForm";
import styles from "./LoginPage.module.css";

export const LoginPage = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToPasswordRecovery,
  onBackToHome,
}: any) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src="/img/loginimg.png" alt="Lumera" className={styles.avatar} />
        </div>

        <h1 className={styles.title}>Bienvenido</h1>
        <p className={styles.subtitle}>
          Inicia sesión para continuar transformando vidas
        </p>

        <LoginForm onSuccess={onLoginSuccess} />

        <div className={styles.links}>
          <button className={styles.linkButton} onClick={onNavigateToPasswordRecovery}>
            ¿Olvidaste tu contraseña?
          </button>

          <div className={styles.registerPrompt}>
            <span>¿No tienes una cuenta?</span>
            <button className={styles.secondaryAction} onClick={onNavigateToRegister}>
              Regístrate aquí
            </button>
          </div>

          {onBackToHome && (
            <button className={styles.backButton} onClick={onBackToHome}>
              ← Volver al inicio
            </button>
          )}
        </div>
      </div>
    </div>
  );
};