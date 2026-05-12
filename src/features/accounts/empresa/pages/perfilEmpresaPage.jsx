import { useState, useRef } from 'react';
import { Camera, Save, Building2 } from 'lucide-react';

export default function PerfilEmpresaPage({ data }) {
  const { company } = data;
  const [form, setForm] = useState({
    name: company?.name || '',
    rfc: company?.rfc || '',
    address: company?.address || '',
    phone: company?.phone || '',
    email: company?.email || '',
    logoUrl: company?.logoUrl || null,
    logoPreview: null,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(p => ({ ...p, logoPreview: url }));
  }

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast('✓ Perfil actualizado correctamente');
      setTimeout(() => setToast(null), 3000);
    }, 1200);
  }

  const logoSrc = form.logoPreview || form.logoUrl;
  const initials = form.name
    ? form.name.split(' ').slice(0, 2).map(w => w[0]).join('')
    : 'EM';

  return (
    <div>
      <h1 className="empresa-page-title">Perfil de empresa</h1>
      <p className="empresa-page-subtitle">Información oficial, logo y datos de contacto</p>

      <div className="empresa-grid-2" style={{ alignItems: 'start' }}>
        {/* Formulario */}
        <div className="empresa-card">
          <div className="empresa-card-header" style={{ marginBottom: 20 }}>
            <span className="empresa-card-title">Información de la empresa</span>
            {company?.verified && (
              <span style={{ fontSize: 11, background: '#ecfdf5', color: '#047857', padding: '3px 10px', borderRadius: 99, fontWeight: 600 }}>
                ✓ Verificada
              </span>
            )}
          </div>

          <div className="empresa-form-group">
            <label className="empresa-label">Nombre de la empresa</label>
            <input className="empresa-input" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="empresa-form-group">
            <label className="empresa-label">RFC / NIT</label>
            <input className="empresa-input" value={form.rfc}
              onChange={e => setForm(p => ({ ...p, rfc: e.target.value }))} />
          </div>
          <div className="empresa-form-group">
            <label className="empresa-label">Dirección</label>
            <input className="empresa-input" value={form.address}
              onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="empresa-form-group">
              <label className="empresa-label">Teléfono</label>
              <input className="empresa-input" type="tel" value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="empresa-form-group">
              <label className="empresa-label">Correo electrónico</label>
              <input className="empresa-input" type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          <button
            className="empresa-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Guardando…
              </>
            ) : (
              <><Save size={14} /> Guardar cambios</>
            )}
          </button>
        </div>

        {/* Logo + preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="empresa-card" style={{ textAlign: 'center' }}>
            <p className="empresa-card-title" style={{ marginBottom: 20 }}>Logo de la empresa</p>

            {/* Logo preview */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <div style={{
                width: 100, height: 100, borderRadius: 24,
                background: logoSrc ? 'white' : 'linear-gradient(135deg, #3525cd, #712ae2)',
                border: '3px solid #eaedff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {logoSrc ? (
                  <img src={logoSrc} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>{initials}</span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 30, height: 30, borderRadius: '50%',
                  background: '#3525cd', border: '2px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'white',
                }}
              >
                <Camera size={14} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={handleLogoChange} />
            </div>

            <p style={{ fontSize: 12, color: '#64748b' }}>
              PNG, JPG o SVG · Máx 2MB
            </p>
            <button
              className="empresa-btn-secondary"
              style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
              onClick={() => fileRef.current?.click()}
            >
              <Camera size={14} /> Cambiar logo
            </button>
          </div>

          {/* Info card */}
          <div className="empresa-card" style={{ background: '#f2f3ff', border: '1px solid #dae2fd' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Building2 size={18} color="#4f46e5" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#131b2e', margin: '0 0 4px' }}>
                  Perfil público
                </p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Tu información aparecerá en el directorio de empresas donantes de Lumera y será visible para beneficiarios verificados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {toast && <div className="empresa-toast">{toast}</div>}
    </div>
  );
}
