import { LoginForm } from "../components/LoginForm";
import styles from "./LoginPage.module.css";

export const LoginPage = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToPasswordRecovery,
  onBackToHome,
}: any) => {
  return (
    <div className={styles.page}>

      {/* LEFT IMAGE ONLY */}
      <div className={styles.left}></div>

      {/* RIGHT LOGIN */}
      <div className={styles.right}>
        <div className={styles.card}>

          <h2>Bienvenido</h2>
          <p className={styles.subtitle}>
            Inicia sesión en tu cuenta
          </p>

          <LoginForm onSuccess={onLoginSuccess} />

          <div className={styles.links}>
            <button onClick={onNavigateToPasswordRecovery}>
              ¿Olvidaste tu contraseña?
            </button>

            <button onClick={onNavigateToRegister}>
              Crear cuenta
            </button>

            {onBackToHome && (
              <button onClick={onBackToHome}>
                ← Volver al inicio
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};