import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginForm.module.css';
import { validEmail, validPassword } from '../../../../utils/validators';

export type LoginFormProps = {
  onSuccess?: (role?: string) => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { signIn, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateField = (field: 'email' | 'password', value: string) => {
    const error =
      field === 'email' ? validEmail(value) :
      field === 'password' && value ? validPassword(value) : null;
    setFieldErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar antes de enviar
    const emailErr = validEmail(email);
    const passErr = password ? null : 'La contraseña es obligatoria.';
    setFieldErrors({ email: emailErr || undefined, password: passErr || undefined });

    if (emailErr || passErr) return;

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
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) validateField('email', e.target.value);
          }}
          onBlur={(e) => validateField('email', e.target.value)}
          type="email"
          placeholder="tu@email.com"
          className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
          required
        />
        {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Contraseña</label>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) validateField('password', e.target.value);
          }}
          onBlur={(e) => e.target.value && validateField('password', e.target.value)}
          type="password"
          placeholder="••••••••"
          className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
          required
        />
        {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
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
