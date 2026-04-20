import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import styles from './RegisterForm.module.css';

export type RegisterFormProps = {
  onSuccess?: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { signUp, isLoading, error } = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donador');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, role, name);
      onSuccess?.();
    } catch {
      // Error ya está en el estado 'error' del hook
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Nombre completo"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className={styles.input}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={styles.select}
        >
          <option value="donador">Donador</option>
          <option value="beneficiario">Beneficiario</option>
          <option value="voluntario">Voluntario</option>
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? 'Registrando...' : 'CREAR CUENTA'}
      </button>
    </form>
  );
};
