import { useState } from "react";
import { DonadorProfile } from "../pages/DonadorProfile";
import { 
  Bell, 
  Search, 
  HelpCircle, 
  User, 
  LogOut,
  LayoutDashboard,
  PackagePlus,
  Settings,
  Heart
} from "lucide-react";
import styles from "./DonadorDashboard.module.css";

export function DonadorDashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState("inicio");

  return (
    <div className={styles.layout}>
      {/* MAIN */}
      <main className={styles.main}>
        {/* TOP NAVBAR */}
        <header className={styles.topbar}>
          <div className={styles.logoSection}>
            <h2 className={styles.logo}>LUMERA</h2>
            <span className={styles.roleBadge}>DONADOR</span>
          </div>

          <nav className={styles.topMenu}>
            <button 
              className={`${styles.topMenuItem} ${view === "inicio" ? styles.active : ""}`}
              onClick={() => setView("inicio")}
            >
              <LayoutDashboard size={20} />
              <span>Inicio</span>
            </button>
            
            <button 
              className={`${styles.topMenuItem} ${view === "nueva-donacion" ? styles.active : ""}`}
              onClick={() => setView("nueva-donacion")}
            >
              <PackagePlus size={20} />
              <span>Nueva donación</span>
            </button>

            <button 
              className={`${styles.topMenuItem} ${view === "perfil" ? styles.active : ""}`}
              onClick={() => setView("perfil")}
            >
              <User size={20} />
              <span>Mi Perfil</span>
            </button>

            <button 
              className={`${styles.topMenuItem} ${view === "configuracion" ? styles.active : ""}`}
              onClick={() => setView("configuracion")}
            >
              <Settings size={20} />
              <span>Configuración</span>
            </button>
          </nav>

          <div className={styles.topActions}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input type="text" placeholder="Buscar..." />
            </div>

            <button className={styles.iconBtn} aria-label="Notificaciones">
              <Bell size={20} />
              <span className={styles.notifBadge}></span>
            </button>
            
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Oscar Correa</span>
              </div>
              <img 
                src="https://i.pravatar.cc/150?u=oscar" 
                alt="Profile" 
                className={styles.avatar} 
              />
              <button className={styles.logoutIconBtn} onClick={onLogout} title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className={styles.contentWrapper}>

        {/* INICIO */}
        {view === "inicio" && (
          <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-surface-container-low flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-primary">volunteer_activism</span>
            </div>
            <h1 className="text-h2 font-h2 text-on-surface mb-3">
              Bienvenido, Donador
            </h1>
            <p className="text-body-md text-outline mb-8 max-w-md mx-auto">
              Cada donación cuenta. Agrega los productos que deseas donar y ayúdanos a llevarlos a quienes más lo necesitan.
            </p>
            <button
              onClick={() => setView("nueva-donacion")}
              className="h-14 px-10 bg-gradient-to-r from-primary to-primary-container text-white font-bold text-body-md rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Nueva donación
            </button>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/40">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-outline mt-1">Donaciones</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/40">
                <p className="text-2xl font-bold text-primary">0</p>
                <p className="text-xs text-outline mt-1">Productos</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/40">
                <p className="text-2xl font-bold text-primary">0 kg</p>
                <p className="text-xs text-outline mt-1">Donados</p>
              </div>
            </div>
          </div>
        )}

        {/* PERFIL */}
        {view === "perfil" && <DonadorProfile />}

        </div>
      </main>
    </div>
  );
}
