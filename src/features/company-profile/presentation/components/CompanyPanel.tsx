import { useState, useEffect } from 'react';
import { useCompany } from '../hooks/useCompany';
import styles from './CompanyPanel.module.css';

type CompanyPanelProps = {
  userId: string;
  isAdmin?: boolean;
};

export function CompanyPanel({ userId, isAdmin = false }: CompanyPanelProps) {
  const { company, isLoading, error, updateCompany, verifyCompany } = useCompany(userId);
  const [formData, setFormData] = useState({
    name: '',
    nit: '',
    legalRepresentative: '',
    phone: '',
    email: '',
    address: '',
    sector: '',
    website: '',
    description: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sincronizar formulario con perfil cargado
  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        nit: company.nit || '',
        legalRepresentative: company.legalRepresentative || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        sector: company.sector || '',
        website: company.website || '',
        description: company.description || '',
      });
      setSaveSuccess(false);
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      // Error ya manejado por hook
    }
  };

  const handleVerify = async (status: 'verified' | 'rejected') => {
    if (window.confirm(`¿${status === 'verified' ? 'Verificar' : 'Rechazar'} esta empresa?`)) {
      try {
        await verifyCompany(status);
      } catch (err) {
        // Error ya manejado
      }
    }
  };

  if (isLoading && !company) {
    return <div className={styles.loading}>Cargando perfil de empresa...</div>;
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Perfil de Empresa</h2>

      {error && <div className={styles.error}>{error}</div>}
      {saveSuccess && <div className={styles.success}>Perfil actualizado correctamente.</div>}

      {company && (
        <div className={styles.verificationStatus}>
          <strong>Estado de verificación:</strong>
          <span className={`${styles.status} ${styles[company.verificationStatus]}`}>
            {company.verificationStatus === 'pending' && 'Pendiente'}
            {company.verificationStatus === 'verified' && 'Verificado'}
            {company.verificationStatus === 'rejected' && 'Rechazado'}
          </span>
          {isAdmin && (
            <div className={styles.adminActions}>
              <button
                className={`${styles.button} ${styles.success}`}
                onClick={() => handleVerify('verified')}
                disabled={company.verificationStatus === 'verified'}
              >
                ✅ Verificar
              </button>
              <button
                className={`${styles.button} ${styles.danger}`}
                onClick={() => handleVerify('rejected')}
                disabled={company.verificationStatus === 'rejected'}
              >
                ❌ Rechazar
              </button>
            </div>
          )}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nombre legal de la empresa *</label>
          <input
            type="text"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>NIT *</label>
          <input
            type="text"
            name="nit"
            className={styles.input}
            value={formData.nit}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Representante legal *</label>
          <input
            type="text"
            name="legalRepresentative"
            className={styles.input}
            value={formData.legalRepresentative}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Teléfono de contacto *</label>
          <input
            type="tel"
            name="phone"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Email corporativo *</label>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Dirección fiscal *</label>
          <input
            type="text"
            name="address"
            className={styles.input}
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Sector</label>
          <input
            type="text"
            name="sector"
            className={styles.input}
            value={formData.sector}
            onChange={handleChange}
            placeholder="Ej: Alimentos, Logística, Retail"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Sitio web</label>
          <input
            type="url"
            name="website"
            className={styles.input}
            value={formData.website}
            onChange={handleChange}
            placeholder="https://"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Descripción de la empresa</label>
          <textarea
            name="description"
            className={styles.textarea}
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Breve descripción de la actividad de la empresa"
          />
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
            onClick={() => company && setFormData({
              name: company.name || '',
              nit: company.nit || '',
              legalRepresentative: company.legalRepresentative || '',
              phone: company.phone || '',
              email: company.email || '',
              address: company.address || '',
              sector: company.sector || '',
              website: company.website || '',
              description: company.description || '',
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