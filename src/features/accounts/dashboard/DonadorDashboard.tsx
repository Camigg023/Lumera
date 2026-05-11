import { useState } from "react";
import { DonadorProfile } from "../pages/DonadorProfile";
import NearbyAcopio from "../../collectionPoints/presentation/components/NearbyAcopio/NearbyAcopio";
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
          <p onClick={() => setView("acopio")}>📍 Centro de acopio</p>
          <p onClick={() => setView("perfil")}>👤 Perfil</p>
        </nav>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>

        {/* INICIO */}
        {view === "inicio" && (
          <div className="max-w-2xl mx-auto space-y-8 py-6">
            {/* Bienvenida */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-indigo-600">volunteer_activism</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Bienvenido, Donador
              </h1>
              <p className="text-gray-500 max-w-md mx-auto">
                Cada donación cuenta. Revisa el centro de acopio más cercano para entregar tus productos.
              </p>
            </div>

            {/* Stats rápidas */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-xs text-gray-500 mt-1">Donaciones</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-indigo-600">0</p>
                <p className="text-xs text-gray-500 mt-1">Productos</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <p className="text-2xl font-bold text-indigo-600">0 kg</p>
                <p className="text-xs text-gray-500 mt-1">Donados</p>
              </div>
            </div>

            {/* Centro de acopio cercano — auto-detectado */}
            <div className="max-w-lg mx-auto">
              <NearbyAcopio autoDetectar={true} />
            </div>
          </div>
        )}

        {/* CENTRO DE ACOPIO — vista completa */}
        {view === "acopio" && (
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Centro de acopio</h1>
              <p className="text-gray-500 text-sm mt-1">
                Encuentra el punto más cercano para entregar tus donaciones
              </p>
            </div>
            <NearbyAcopio autoDetectar={true} />
          </div>
        )}

        {/* PERFIL */}
        {view === "perfil" && <DonadorProfile />}

      </main>
    </div>
  );
}
