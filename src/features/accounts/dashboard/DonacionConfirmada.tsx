import "../pages/DonacionConfirmada.css";

import {
  LayoutDashboard,
  HandHeart,
  Users,
  Truck,
  Settings,
  Bell,
  CheckCircle2,
  Copy,
  CalendarDays,
  Clock3,
  MapPin,
  ArrowRight,
  Home,
} from "lucide-react";

export function DonacionConfirmada() {
  return (
    <div className="confirm-dashboard">

      {/* TOPBAR */}

      <header className="confirm-topbar">

        <div className="confirm-logo">
          Lumera
        </div>

        <div className="confirm-top-actions">

          <div className="search-box">
            <input
              type="text"
              placeholder="Search activities..."
            />
          </div>

          <Bell size={18} className="top-icon" />

          <div className="profile-mini">
            <img
              src="https://i.pravatar.cc/100"
              alt=""
            />
          </div>

        </div>

      </header>

      {/* CONTAINER */}

      <div className="confirm-container">

        {/* SIDEBAR */}

        <aside className="confirm-sidebar">

          <div>

            <div className="sidebar-brand">
              <h2>Confirmacion</h2>
            </div>

            <div className="confirm-menu">

              <div className="confirm-item">
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </div>

              <div className="confirm-item active">
                <HandHeart size={17} />
                <span>Donaciones</span>
              </div>

              <div className="confirm-item">
                <Users size={17} />
                <span>Beneficiarios</span>
              </div>

              <div className="confirm-item">
                <Settings size={17} />
                <span>Configuracion</span>
              </div>

            </div>

          </div>

          <div className="sidebar-bottom">

            <button className="impact-btn">
              Informe de impacto
            </button>

            <div className="bottom-link">
              Cerrar sesión
            </div>

          </div>

        </aside>

        {/* MAIN */}

        <main className="confirm-main">

          <div className="confirm-wrapper">

            {/* SUCCESS ICON */}

            <div className="success-icon">
              <CheckCircle2 size={54} />
            </div>

            {/* TITLE */}

            <h1>
              Tu donación ha sido
              <br />
              programada con éxito
            </h1>

            <p className="confirm-description">
              Nuestro sistema inteligente ha validado los parámetros logísticos.
              La recolección está lista para ser asignada a un transportista disponible.
            </p>

            {/* CARDS */}

            <div className="confirm-cards">

              {/* LEFT */}

              <div className="code-card">

                <span className="mini-label">
                  IDENTIFICADOR ÚNICO
                </span>

                <h3>
                  Código de donación
                </h3>

                <p>
                  Usa este código para cualquier referencia logística
                  o seguimiento manual con el equipo de Lumera.
                </p>

                <div className="code-box">

                  <span>
                    LUM-2026-000123
                  </span>

                  <Copy size={18} />

                </div>

              </div>

              {/* RIGHT */}

              <div className="status-card">

                <div className="status-top">

                  <span>
                    Estado actual
                  </span>

                  <div className="status-badge">
                    ACTIVE
                  </div>

                </div>

                <h3>
                  Disponibilidad inmediata
                </h3>

                <p>
                  Tu donación ahora está disponible para asignación
                  en el marketplace logístico.
                </p>

                <div className="drivers">

                  <img
                    src="https://i.pravatar.cc/40?img=12"
                    alt=""
                  />

                  <img
                    src="https://i.pravatar.cc/40?img=13"
                    alt=""
                  />

                  <div className="driver-plus">
                    +12
                  </div>

                </div>

                <small>
                  Conductores cercanos en zona de impacto
                </small>

              </div>

            </div>

            {/* SUMMARY */}

            <div className="summary-card">

              <h2>
                Resumen de programación
              </h2>

              <div className="summary-grid">

                <div className="summary-item">

                  <CalendarDays size={18} />

                  <div>
                    <span>FECHA DE RECOLECCIÓN</span>
                    <h4>14 de Octubre, 2026</h4>
                  </div>

                </div>

                <div className="summary-item">

                  <Clock3 size={18} />

                  <div>
                    <span>VENTANA HORARIA</span>
                    <h4>09:00 AM - 11:30 AM</h4>
                  </div>

                </div>

                <div className="summary-item">

                  <Truck size={18} />

                  <div>
                    <span>REQUERIMIENTOS</span>

                    <div className="requirements">

                      <div className="req blue">
                        Refrigeración
                      </div>

                      <div className="req red">
                        Urgente
                      </div>

                    </div>

                  </div>

                </div>

                <div className="summary-item">

                  <MapPin size={18} />

                  <div>
                    <span>UBICACIÓN DE ORIGEN</span>
                    <h4>Centro Logístico Sur</h4>
                  </div>

                </div>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="confirm-actions">

              <button className="trace-btn">

                Ver trazabilidad

                <ArrowRight size={18} />

              </button>

              <button className="home-btn">

                <Home size={17} />

                Volver al inicio

              </button>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}