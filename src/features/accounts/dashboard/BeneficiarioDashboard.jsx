import "../pages/BeneficiarioDashboard.css";

import {
  LayoutDashboard,
  Users,
  HandHeart,
  Settings,
  Bell,
  ShieldAlert,
  BadgeCheck,
  Package,
  Map,
  HeartHandshake,
  Clock3,
  Circle,
  ShoppingBasket
} from "lucide-react";

export function BeneficiarioDashboard() {
  return (
    <div className="dashboard">

      <header className="topbar glass">

        <div className="logo">
          ☰ Lumera
        </div>

        <div className="top-actions">

          <div className="notif">
            <Bell size={22} />
          </div>

          <button className="logout-btn">
            Cerrar sesión
          </button>

        </div>

      </header>

      <div className="container">

        <aside className="sidebar glass">

          <div className="sidebar-title">
            Beneficiario
          </div>

          <div className="menu-item">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>

          <div className="menu-item active">
            <Users size={18} />
            <span>Beneficiario</span>
          </div>

          <div className="menu-item">
            <HandHeart size={18} />
            <span>Donaciones</span>
          </div>

          <div className="menu-item">
            <Settings size={18} />
            <span>Configuración</span>
          </div>

          <div className="impact glass">

            <p>Nivel de Impacto</p>

            <div className="impact-rank">
              <BadgeCheck size={18} />
              <span>Platino</span>
            </div>

            <div className="bar">
              <div className="fill"></div>
            </div>

            <span>240xp para el siguiente rango</span>

          </div>

        </aside>

        <main className="main">

          <section className="hero">

            <div className="hero-card glass">

              <img
                src="https://i.pravatar.cc/300"
                className="avatar"
              />

              <div className="hero-info">

                <h1>
                  Centro Familiar "Esperanza"
                </h1>

                <p>
                  Ubicación: Sector Sur, Manzana 14
                </p>

                <div className="hero-tags">

                  <div className="tag critical">
                    <ShieldAlert size={14} />
                    Prioridad Crítica
                  </div>

                  <div className="tag">
                    8 Beneficiarios
                  </div>

                  <div className="tag success">
                    Nivel: Platino
                  </div>

                </div>

              </div>

            </div>

            <div className="premium glass">

              <div className="badge">
                <HeartHandshake size={42} />
              </div>

              <h4>Estado de Ayuda</h4>

              <h2>Stock Crítico</h2>

              <p>
                Última entrega hace 5 días.
                Stock actual estimado al 15%.
              </p>

              <button className="primary">
                REABASTECER AHORA
              </button>

            </div>

          </section>

          <section className="stats">

            <div className="card glass">
              <HandHeart className="stat-icon" size={26} />
              <h3>1.2k Kg</h3>
              <p>Total Ayuda Recibida</p>
            </div>

            <div className="card glass">
              <Package className="stat-icon" size={26} />
              <h3>4,850</h3>
              <p>Comidas Servidas</p>
            </div>

            <div className="card glass">
              <Users className="stat-icon" size={26} />
              <h3>94%</h3>
              <p>Impacto Comunitario</p>
            </div>

            <div className="card glass">
              <BadgeCheck className="stat-icon" size={26} />
              <h3>100%</h3>
              <p>Entregas Puntuales</p>
            </div>

          </section>

          <section className="bottom-section">

            {/* IZQUIERDA */}
            <div className="left-column">

              <div className="incentives glass">

                <div className="route-header">

                  <h2 className="incentive-title">
                    <Map size={22} />
                    Ruta de Entrega Activa
                  </h2>

                  <div className="live-badge">
                    Vivo
                  </div>

                </div>

                <div className="route-box">

                  <iframe
                    src="https://www.google.com/maps?q=Medellin&output=embed"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>

                </div>

              </div>

              <div className="history glass">

                <h2>
                  Historial Reciente
                </h2>

                <div className="history-item">

                  <div className="history-icon active">
                    <Circle size={10} fill="currentColor" />
                  </div>

                  <div>
                    <h4>
                      Entrega Completada - Hoy 10:30 AM
                    </h4>

                    <p>
                      45kg de vegetales frescos y lácteos recibidos.
                    </p>
                  </div>

                </div>

                <div className="history-item">

                  <div className="history-icon">
                    <Clock3 size={16} />
                  </div>

                  <div>
                    <h4>
                      Donación Programada - Mañana 09:00 AM
                    </h4>

                    <p>
                      Suministro semanal de proteínas y granos secos.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* DERECHA */}
            <div className="activity glass">

              <div className="activity-header">

                <h2>
                  Alimentos Disponibles
                </h2>

                <a href="#">
                  Ver Todos
                </a>

              </div>

              <div className="food-filters">

                <button className="filter active">
                  Urgente
                </button>

                <button className="filter">
                  Hoy
                </button>

                <button className="filter">
                  Cercanos
                </button>

                <button className="filter">
                  Familia
                </button>

              </div>

              <div className="food-list">

                <div className="food-card">

                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop"
                    alt=""
                  />

                  <div className="food-info">

                    <div className="food-top">

                      <div>
                        <h3>Canasta de Vegetales</h3>
                        <p>
                          12 unidades disponibles de mercado local.
                        </p>
                      </div>

                      <span className="distance">
                        A 1.2km
                      </span>

                    </div>

                    <button className="reserve-btn">
                      + Reservar Lote
                    </button>

                  </div>

                </div>

                <div className="food-card">

                  <img
                    src="https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600&auto=format&fit=crop"
                    alt=""
                  />

                  <div className="food-info">

                    <div className="food-top">

                      <div>
                        <h3>Lácteos Mixtos</h3>
                        <p>
                          Pack de 6 leches y 2 quesos artesanales.
                        </p>
                      </div>

                      <span className="distance">
                        A 3.5km
                      </span>

                    </div>

                    <button className="reserve-btn">
                      + Reservar Lote
                    </button>

                  </div>

                </div>

                <div className="food-card">

                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop"
                    alt=""
                  />

                  <div className="food-info">

                    <div className="food-top">

                      <div>
                        <h3>Panadería Artesanal</h3>
                        <p>
                          Surtido de pan integral del día.
                        </p>
                      </div>

                      <span className="distance">
                        A 0.8km
                      </span>

                    </div>

                    <button className="reserve-btn">
                      + Reservar Lote
                    </button>

                  </div>

                </div>

              </div>

              <button className="help-btn">
                <ShoppingBasket size={20} />
                Solicitar Ayuda
              </button>

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}