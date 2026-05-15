import {
  LayoutDashboard,
  Gift,
  Users,
  Building2,
  UserCheck,
  Award,
  User,
  LogOut,
  ChevronRight,
  Heart,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio',        label: 'Inicio',           icon: LayoutDashboard, section: 'Principal' },
  { id: 'nueva-donacion', label: 'Nueva Donación',  icon: Gift,            section: 'Donaciones' },
  { id: 'mis-donaciones', label: 'Mis Donaciones',  icon: Heart,           section: 'Donaciones' },
  { id: 'usuarios-donadores', label: 'Donadores',   icon: UserCheck,       section: 'Usuarios' },
  { id: 'usuarios-beneficiarios', label: 'Beneficiarios', icon: Users,      section: 'Usuarios' },
  { id: 'usuarios-empresas', label: 'Empresas',     icon: Building2,       section: 'Usuarios' },
  { id: 'beneficios',    label: 'Beneficios',        icon: Award,           section: 'Cuenta' },
  { id: 'perfil',        label: 'Perfil',            icon: User,            section: 'Cuenta' },
];

interface DonadorSidebarProps {
  view: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  /** Si el usuario tiene permiso para ver la sección de usuarios */
  canViewUsers?: boolean;
}

/**
 * Sidebar de navegación del Donador con secciones agrupadas.
 * Incluye acceso directo a listados de usuarios por rol.
 */
export function DonadorSidebar({
  view,
  onNavigate,
  onLogout,
  isOpen,
  onClose,
  canViewUsers = false,
}: DonadorSidebarProps) {
  // Filtrar items según permisos
  const filteredItems = NAV_ITEMS.filter((item) => {
    // Ocultar sección Usuarios si no tiene permiso
    if (item.section === 'Usuarios' && !canViewUsers) return false;
    return true;
  });

  // Agrupar items por sección
  const sections = filteredItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const section = item.section || 'General';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  const isActive = (id: string) => view === id;

  const handleNav = (id: string) => {
    onNavigate(id);
    onClose?.();
  };

  return (
    <aside
      className={`donador-sidebar ${isOpen ? 'donador-sidebar--open' : ''}`}
    >
      {/* Logo */}
      <div className="donador-sidebar__logo">
        <div className="donador-sidebar__logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <div className="donador-sidebar__logo-text">Lumera</div>
          <span className="donador-sidebar__badge">Donador</span>
        </div>
      </div>

      {/* Navegación por secciones */}
      <nav className="donador-sidebar__nav">
        {Object.entries(sections).map(([sectionName, items]) => (
          <div key={sectionName} className="donador-sidebar__section">
            <div className="donador-sidebar__section-label">{sectionName}</div>
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  className={`donador-sidebar__item ${active ? 'donador-sidebar__item--active' : ''}`}
                  onClick={() => handleNav(item.id)}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  {active && <ChevronRight size={14} className="donador-sidebar__chevron" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="donador-sidebar__footer">
        <button className="donador-sidebar__logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>

      <style>{`
        .donador-sidebar {
          width: 260px;
          min-width: 260px;
          height: 100vh;
          background: var(--color-surface, #fff);
          border-right: 1px solid var(--color-outline-variant, #e0e0e0);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: sticky;
          top: 0;
          z-index: 50;
          transition: transform 0.3s ease;
        }

        .donador-sidebar__logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid var(--color-outline-variant, #e0e0e0);
        }

        .donador-sidebar__logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--color-primary, #F28C33);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .donador-sidebar__logo-text {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary, #F28C33);
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .donador-sidebar__badge {
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--color-outline, #9e9e9e);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .donador-sidebar__nav {
          flex: 1;
          padding: 0.75rem 0.75rem;
          overflow-y: auto;
        }

        .donador-sidebar__section {
          margin-bottom: 0.5rem;
        }

        .donador-sidebar__section-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-outline, #9e9e9e);
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0.75rem 0.75rem 0.4rem;
        }

        .donador-sidebar__item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--color-on-surface-variant, #5f6368);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .donador-sidebar__item:hover {
          background: var(--color-surface-container-low, #f8f9fa);
          color: var(--color-primary, #F28C33);
        }

        .donador-sidebar__item--active {
          background: var(--color-primary-fixed, #fef3e7);
          color: var(--color-primary, #F28C33);
          font-weight: 600;
        }

        .donador-sidebar__chevron {
          margin-left: auto;
          opacity: 0.5;
        }

        .donador-sidebar__footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--color-outline-variant, #e0e0e0);
        }

        .donador-sidebar__logout {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: var(--color-error, #E53935);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .donador-sidebar__logout:hover {
          background: var(--color-error-container, #fce4ec);
        }

        @media (max-width: 768px) {
          .donador-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            transform: translateX(-100%);
            box-shadow: 4px 0 24px rgba(0,0,0,0.15);
            z-index: 200;
          }
          .donador-sidebar--open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}
