import { LoginForm } from "../components/LoginForm";

export type LoginPageProps = {
  /** Volver al inicio sin recarga (misma app). */
  onBackToHome?: () => void;
  /** Redirigir al home tras login exitoso. */
  onLoginSuccess?: () => void;
};

export const LoginPage = ({ onBackToHome, onLoginSuccess }: LoginPageProps) => {
  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      {onBackToHome ? (
        <p style={{ margin: "0 0 1rem" }}>
          <button
            type="button"
            onClick={onBackToHome}
            style={{
              font: "inherit",
              color: "var(--accent, #aa3bff)",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ← Inicio
          </button>
        </p>
      ) : null}
      <h1>Login</h1>
      <LoginForm onSuccess={onLoginSuccess} />
    </div>
  );
};
