import {
  LayoutDashboard, Package, Truck, BarChart2, Users, Building2,
  Gift, LogOut, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'inicio',    label: 'Inicio',      icon: LayoutDashboard },
  { id: 'donaciones', label: 'Donaciones',  icon: Gift },
  { id: 'inventario', label: 'Inventario',  icon: Package },
  { id: 'reportes',   label: 'Reportes',    icon: BarChart2 },
  { id: 'perfil',     label: 'Perfil',      icon: Building2 },
];

export default function EmpresaSidebar({ view, onNavigate, onClose, isOpen }) {
  return (
    <aside className={`empresa-sidebar${isOpen ? ' open' : ''}`}>
      {/* Logo */}
      <div className="empresa-sidebar-logo">
        <div className="empresa-sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div className="empresa-sidebar-logo-text">Lumera</div>
        </div>
        <span className="empresa-sidebar-logo-badge">Empresa</span>
      </div>

      {/* Nav */}
      <nav className="empresa-sidebar-nav">
        <div className="empresa-nav-section-label">Principal</div>
        {NAV_ITEMS.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              className={`empresa-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onClose && onClose(); }}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>
          );
        })}

       
        {NAV_ITEMS.slice(5).map(item => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <button
              key={item.id}
              className={`empresa-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onClose && onClose(); }}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="empresa-sidebar-footer">
        <button
          className="empresa-logout-btn"
          onClick={() => {
            import('firebase/auth').then(({ signOut }) => {
              import('../../../../config/firebase').then(({ auth }) => {
                signOut(auth).catch(() => {});
              });
            });
            window.location.reload();
          }}
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
