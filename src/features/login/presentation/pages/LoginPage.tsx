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