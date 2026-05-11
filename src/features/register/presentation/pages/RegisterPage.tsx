import { RegisterForm } from "../components/RegisterForm";
import styles from "./RegisterPage.module.css";

export type RegisterPageProps = {
  onBackToHome?: () => void;
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: (role?: string) => void;
};

export const RegisterPage = ({ onBackToHome, onNavigateToLogin, onRegisterSuccess }: RegisterPageProps) => {
  return (
    <div className={styles.page}>

      {/* LEFT - IMAGEN COMPLETA */}
      <div className={styles.imageSide}></div>

      {/* RIGHT - FORMULARIO */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>

          {onBackToHome && (
            <button onClick={onBackToHome} className={styles.backLink}>
              ← Volver al inicio
            </button>
          )}

          <h1 className={styles.title}>Crear Cuenta</h1>
          <RegisterForm onSuccess={onRegisterSuccess} />

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