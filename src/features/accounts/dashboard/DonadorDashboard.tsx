import { useState } from "react";
import { DonadorProfile } from "../pages/DonadorProfile";
import CodeValidator from "../../codeValidation/components/CodeValidator";
import DonationHistory from "../../codeValidation/DonationHistory";
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
          <p onClick={() => setView("donaciones")}>📦 Mis donaciones</p>
          <p onClick={() => setView("validar")}>✅ Validar código</p>
          <p onClick={() => setView("perfil")}>👤 Perfil</p>
        </nav>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>

        {/* INICIO */}
        {view === "inicio" && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-indigo-50 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-indigo-600">volunteer_activism</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Bienvenido, Donador
            </h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Cada donación cuenta. Revisa tus códigos de donación o valida una entrega en el punto de acopio.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => setView("donaciones")}
                className="h-14 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">inventory_2</span>
                Mis donaciones
              </button>
              <button
                onClick={() => setView("validar")}
                className="h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">qr_code_scanner</span>
                Validar código
              </button>
            </div>
          </div>
        )}

        {/* MIS DONACIONES - Historial con códigos */}
        {view === "donaciones" && (
          <DonationHistory userId="demo-user-001" />
        )}

        {/* VALIDAR CÓDIGO - Para puntos de acopio */}
        {view === "validar" && (
          <CodeValidator />
        )}

        {/* PERFIL */}
        {view === "perfil" && <DonadorProfile />}

      </main>
    </div>
  );
}
