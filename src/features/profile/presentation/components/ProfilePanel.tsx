import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import styles from './ProfilePanel.module.css';

type ProfilePanelProps = {
  uid: string;
};

export function ProfilePanel({ uid }: ProfilePanelProps) {
  const { profile, isLoading, error, updateProfile } = useProfile(uid);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    notifications: true,
    language: 'es' as 'es' | 'en',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sincronizar formulario con perfil cargado
  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        notifications: profile.preferences?.notifications ?? true,
        language: profile.preferences?.language || 'es',
      });
      setSaveSuccess(false);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        displayName: formData.displayName || null,
        email: formData.email || null,
        phone: formData.phone,
        address: formData.address,
        preferences: {
          notifications: formData.notifications,
          language: formData.language,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      // Error ya manejado por useProfile
    }
  };

  if (isLoading && !profile) {
    return <div className={styles.loading}>Cargando perfil...</div>;
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Mi Perfil</h2>

      {error && <div className={styles.error}>{error}</div>}
      {saveSuccess && <div className={styles.success}>Perfil actualizado correctamente.</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre</label>
          <input
            type="text"
            name="displayName"
            className={styles.input}
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Correo electrónico</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            placeholder="email@ejemplo.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Teléfono</label>
          <input
            type="tel"
            name="phone"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+57 300 1234567"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Dirección</label>
          <input
            type="text"
            name="address"
            className={styles.input}
            value={formData.address}
            onChange={handleChange}
            placeholder="Calle, ciudad, país"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Idioma</label>
          <select
            name="language"
            className={styles.select}
            value={formData.language}
            onChange={handleChange}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            className={styles.checkbox}
            checked={formData.notifications}
            onChange={handleChange}
          />
          <label htmlFor="notifications" className={styles.label}>
            Recibir notificaciones
          </label>
        </div>

        <div className={styles.buttons}>
          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={() => profile && setFormData({
              displayName: profile.displayName || '',
              email: profile.email || '',
              phone: profile.phone || '',
              address: profile.address || '',
              notifications: profile.preferences?.notifications ?? true,
              language: profile.preferences?.language || 'es',
            })}
            disabled={isLoading}
          >
            Restaurar
          </button>
        </div>
      </form>
    </div>
  );
}