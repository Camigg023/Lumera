import { useState } from 'react';
import { Menu } from 'lucide-react';
import EmpresaSidebar from './components/EmpresaSidebar';
import EmpresaHeader from './components/EmpresaHeader';
import InicioPage from './pages/inicioPage';
import DonacionesPage from './pages/donacionesPage';
import InventarioPage from './pages/inventarioPage';

import ReportesPage from './pages/reportesPage';
import PerfilEmpresaPage from './pages/perfilEmpresaPage';
import { useEmpresaData } from './hooks/useEmpresaData';
import './styles/empresa.css';

const PAGE_MAP = {
  inicio: InicioPage,
  donaciones: DonacionesPage,
  inventario: InventarioPage,
  reportes: ReportesPage,
  perfil: PerfilEmpresaPage,
};

export default function EmpresaModule({ onLogout }) {

  const [view, setView] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const empresaData = useEmpresaData();

  const PageComponent = PAGE_MAP[view] || InicioPage;

  if (empresaData.loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#f4f6ff', gap: 16
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid #eaedff', borderTopColor: '#4f46e5',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontWeight: 500, fontSize: 14 }}>Cargando dashboard…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="empresa-layout">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="empresa-sidebar-overlay open"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <EmpresaSidebar
        view={view}
        onNavigate={setView}
        onClose={() => setSidebarOpen(false)}
        isOpen={sidebarOpen}
        onLogout={onLogout}
      />


      {/* Main */}
      <div className="empresa-main">
        {/* Mobile header */}
        <div className="empresa-mobile-header">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#464555', padding: 4 }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#131b2e' }}>Lumera</span>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #3525cd, #712ae2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 12
          }}>
            {(empresaData.company?.name || 'EM').split(' ').slice(0, 2).map(w => w[0]).join('')}
          </div>
        </div>

        {/* Desktop header */}
        <EmpresaHeader
          company={empresaData.company}
          onMenuToggle={() => setSidebarOpen(p => !p)}
        />

        {/* Page content */}
        <div className="empresa-page">
          <PageComponent data={empresaData} />
        </div>
      </div>

      {/* Sidebar mobile open style */}
      <style>{`
        @media (max-width: 768px) {
          .empresa-sidebar.open {
            transform: translateX(0) !important;
            box-shadow: 8px 0 32px rgba(0,0,0,0.12);
          }
        }
      `}</style>
    </div>
  );
}
