import { useState } from 'react';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';
import styles from './PasswordRecoveryForm.module.css';

export type PasswordRecoveryFormProps = {
  onSuccess?: () => void;
};

export const PasswordRecoveryForm = ({ onSuccess }: PasswordRecoveryFormProps) => {
  const { sendResetEmail, isLoading, error, success } = usePasswordRecovery();
  const [email, setEmail] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendResetEmail(email);
      onSuccess?.();
    } catch {
      // Error ya está en el estado 'error' del hook
    }
  };

  if (success) {
    return (
      <div className={styles.successMessage}>
        <div className="text-4xl mb-4">✉️</div>
        <h3>Revisa tu correo</h3>
        <p>Te hemos enviado un enlace para restablecer tu contraseña.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Ingresa tu email"
          className={styles.input}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
      </button>
    </form>
  );
};