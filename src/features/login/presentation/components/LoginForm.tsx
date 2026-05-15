import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginForm.module.css';

export type LoginFormProps = {
  onSuccess?: (role?: string) => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { signIn, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await signIn(email, password);
      onSuccess?.(user?.role);
    } catch {
      // Error ya está en el estado 'error' del hook
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Correo electrónico</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="tu@email.com"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Contraseña</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
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
        {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
};
