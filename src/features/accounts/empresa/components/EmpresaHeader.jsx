import { Bell, Search, Menu } from 'lucide-react';

export default function EmpresaHeader({ company, onMenuToggle }) {
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const initials = company?.name
    ? company.name.split(' ').slice(0, 2).map(w => w[0]).join('')
    : 'EM';

  return (
    <header className="empresa-header">
      {/* Left: mobile menu + search */}
      <div className="empresa-header-left">
        <button
          className="empresa-header-icon-btn"
          onClick={onMenuToggle}
          style={{ display: 'none' }}
          aria-label="Menú"
        >
          <Menu size={18} />
        </button>
        <div className="empresa-header-search">
          <Search />
          <input placeholder="Buscar donaciones, reportes…" />
        </div>
      </div>

      {/* Right: date, notifications, avatar */}
      <div className="empresa-header-right">
        <span className="empresa-header-date">{today}</span>
        <button className="empresa-header-icon-btn" aria-label="Notificaciones">
          <Bell size={17} />
          <span className="empresa-header-badge" />
        </button>
        <div className="empresa-header-avatar" title={company?.name}>
          {initials}
        </div>
        <span className="empresa-header-name">{company?.name || 'Mi Empresa'}</span>
      </div>
    </header>
  );
}
