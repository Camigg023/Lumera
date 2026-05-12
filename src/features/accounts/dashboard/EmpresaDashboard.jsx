export function EmpresaDashboard({ onLogout }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Empresa Dashboard 🏢</h1>
      <button 
        onClick={onLogout}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#E53935',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}