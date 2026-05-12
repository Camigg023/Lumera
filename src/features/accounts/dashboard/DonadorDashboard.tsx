import { useState } from "react";
import { DonadorProfile } from "../pages/DonadorProfile";
import NearbyAcopio from "../../collectionPoints/presentation/components/NearbyAcopio/NearbyAcopio";
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
        {/* ========== INICIO ========== */}
        {view === "inicio" && (
          <>
            {/* Perfil del donador */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-indigo-50/50">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
                  <img alt="Elena Rodriguez" className="w-full h-full object-cover rounded-full border-4 border-white"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfuOPe0g_EDDBKlNttYUTXp0l7vAw6Bz71AiGuZ1YFyrMNGCuLqYh7CxxsEzdo9mGVJC3jnM-fORAbyn_X39NPiLUqYzIHa0tdbUtO1qM9O4rqxYxCQPq9yq7J3U-1rKZNA-aeAIKuU8CIBaiex4xmHjYJbb7cdxGouH2y0myWcVK-IAPbumrG-SumHQgZv04uOZGQ9mpnnjmNT4y4dxe-TYJQZXy0OyONyGE_GUeApuedtpZqPJv_OvuYDKlfXXaqYX0OC0V3m9qD" />
                </div>
                <div className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-h1 font-h1 text-on-background">Elena Rodriguez</h1>
                  <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-1">Sustaining Partner Since 2022</p>
                </div>
                <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
                  Passionate about sustainable food systems and community resilience. Currently focused on reducing surplus waste in the metro area through collaborative distribution networks.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-2 rounded-full bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span> San Francisco, CA
                  </span>
                  <span className="px-4 py-2 rounded-full bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">share</span> Share Profile
                  </span>
                </div>
              </div>
            </section>

            {/* Impacto */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-h2 font-h2 text-on-background">Lifetime Impact</h2>
                <button className="text-primary font-label-sm text-label-sm flex items-center gap-1">
                  Full Report <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors"></div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary mb-6">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                    </div>
                    <h3 className="text-body-lg text-body-lg text-on-surface-variant">Total Meals Saved</h3>
                    <p className="text-[56px] font-bold text-on-background leading-none mt-2">12,482</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-indigo-50/50 flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined">trending_up</span>
                    <span className="font-label-sm text-label-sm">+12% from last month</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-indigo-50 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container/10 flex items-center justify-center text-secondary mb-6">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                    </div>
                    <h3 className="text-body-md text-body-md text-on-surface-variant">People Helped</h3>
                    <p className="text-[40px] font-bold text-on-background mt-1">3,204</p>
                  </div>
                  <p className="font-label-sm text-label-sm text-outline mt-4">Direct community reach</p>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-indigo-50 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-error-container/20 flex items-center justify-center text-error mb-6">
                      <span className="material-symbols-outlined text-2xl">co2</span>
                    </div>
                    <h3 className="text-body-md text-body-md text-on-surface-variant">Carbon Reduced</h3>
                    <p className="text-[40px] font-bold text-on-background mt-1">4.2<span className="text-2xl font-semibold">t</span></p>
                  </div>
                  <p className="font-label-sm text-label-sm text-outline mt-4">Equivalent to 84 trees</p>
                </div>
              </div>
            </section>

            {/* Centro de acopio */}
            <section className="max-w-2xl">
              <NearbyAcopio autoDetectar={true} />
            </section>
          </>
        )}

        {/* PERFIL */}
        {view === "perfil" && <DonadorProfile />}

        </div>
      </main>

      {/* ===== BOTTOM NAV BAR (Mobile) ===== */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-indigo-50 shadow-[0_-8px_30px_rgba(79,70,229,0.08)] rounded-t-3xl md:hidden">
        <div className="flex justify-around items-center px-4 pt-3 pb-6">
          {[
            { key: "inicio", icon: "explore", label: "Inicio" },
            { key: "nueva-donacion", icon: "volunteer_activism", label: "Donar" },
            { key: "donar", icon: "near_me", label: "Acopio" },
            { key: "perfil", icon: "person", label: "Perfil" },
          ].map((item) => {
            const activo = view === item.key;
            return (
              <button key={item.key} onClick={() => setView(item.key)}
                className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-200 ${
                  activo ? "bg-indigo-50 text-indigo-700 rounded-2xl" : "text-slate-400 hover:text-indigo-500"
                }`}>
                <span className="material-symbols-outlined mb-1" style={activo ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span className="text-[11px] font-medium uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
