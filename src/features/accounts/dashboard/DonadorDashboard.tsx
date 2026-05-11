import { useState } from "react";
import { DonadorProfile } from "../pages/DonadorProfile";
import AddProductsPanel from "../../addProducts/AddProductsPanel";
import styles from "./DonadorDashboard.module.css";

export function DonadorDashboard() {
  const [view, setView] = useState("inicio");

  return (
    <div className={styles.layout}>
      
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>LUMERA</h2>

        <nav className={styles.menu}>
          <p onClick={() => setView("inicio")}>🏠 Inicio</p>
          <p onClick={() => setView("nueva-donacion")}>📦 Nueva donación</p>
          <p onClick={() => setView("perfil")}>👤 Perfil</p>
        </nav>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>

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

        {/* NUEVA DONACIÓN - AddProductsPanel */}
        {view === "nueva-donacion" && (
          <AddProductsPanel />
        )}

        {/* PERFIL */}
        {view === "perfil" && <DonadorProfile />}

      </main>
    </div>
  );
}
