import "../pages/DonadorDashboard.css";
import { Home, User, Heart, Gift, MapPin, Bell, HandHeart, Leaf, Users, Wallet, Sparkles, BadgeCheck } from "lucide-react";

export function DonadorDashboard() {
  return (
    <div className="dashboard">
      <header className="topbar glass">
        <div className="logo">☰ Lumera</div>
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
          <div className="menu-item">
            <Home size={18} />
            <span>Inicio</span>
          </div>

          <div className="menu-item active">
            <User size={18} />
            <span>Mi Perfil</span>
          </div>

          <div className="menu-item">
            <Heart size={18} />
            <span>Donaciones</span>
          </div>

          <div className="menu-item">
            <Gift size={18} />
            <span>Beneficios</span>
          </div>

          <div className="impact glass">
            <p>Nivel de Impacto</p>
            <div className="impact-rank">
              <BadgeCheck size={20} />
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
              <img src="https://i.pravatar.cc/300" className="avatar" />

              <div className="hero-info">
                <h1>Carlos Mendoza</h1>
                <p>carlos.mendoza@lumera.org • Joined Oct 2023</p>

                <div className="buttons">
                  <button className="primary">Editar Perfil</button>
                  <button className="secondary">Compartir Logros</button>
                </div>
              </div>
            </div>

            <div className="premium glass">
              <div className="badge">
                <BadgeCheck size={42} />
              </div>
              <h4>Membresía</h4>
              <h2>Donador Premium</h2>
              <p>Acceso a beneficios exclusivos de impacto social</p>
            </div>
          </section>

          <section className="stats">
            <div className="card glass">
              <HandHeart className="stat-icon" size={26} />
              <h3>48</h3>
              <p>Donaciones Totales</p>
            </div>

            <div className="card glass">
              <Leaf className="stat-icon" size={26} />
              <h3>1.2T</h3>
              <p>Kg Alimento</p>
            </div>

            <div className="card glass">
              <Users className="stat-icon" size={26} />
              <h3>156</h3>
              <p>Familias Ayudadas</p>
            </div>

            <div className="card glass">
              <Wallet className="stat-icon" size={26} />
              <h3>$250</h3>
              <p>Recompensas</p>
            </div>
          </section>

          <section className="bottom-section">
            <div className="incentives glass">
              <h2 className="incentive-title">
                <Sparkles size={24} />
                Tus Incentivos
              </h2>

              <div className="coupon-progress">
                <h3>Próximo Cupón</h3>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <p>85% completado</p>
                <span>
                  15% más para un descuento del 25% en comercios aliados.
                </span>
              </div>

              <div className="coupon-card active">
                <div>
                  <h4>15% Descuento</h4>
                  <p>Vence en 2 días</p>
                </div>
                <button>Canjear</button>
              </div>

              <div className="coupon-card disabled">
                <div>
                  <h4>Cena Gratis</h4>
                  <p>Usado ayer</p>
                </div>
              </div>
            </div>

            <div className="activity glass">
              <div className="activity-header">
                <h2>Actividad Reciente</h2>
                <a href="#">Ver Todo →</a>
              </div>

              <div className="activity-table">
                <div className="activity-row">
                  <span>Centro Histórico Norte</span>
                  <span>Mar 12, 2024</span>
                  <span>+25kg</span>
                  <span className="status">COMPLETED</span>
                </div>

                <div className="activity-row">
                  <span>Market Solidarity Sur</span>
                  <span>Mar 08, 2024</span>
                  <span>+12kg</span>
                  <span className="status">COMPLETED</span>
                </div>

                <div className="activity-row">
                  <span>Recolección a Domicilio</span>
                  <span>Feb 28, 2024</span>
                  <span>+50kg</span>
                  <span className="status">COMPLETED</span>
                </div>

                <div className="activity-row">
                  <span>Donación Especial: Gala</span>
                  <span>Feb 14, 2024</span>
                  <span>+100kg</span>
                  <span className="status">COMPLETED</span>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}