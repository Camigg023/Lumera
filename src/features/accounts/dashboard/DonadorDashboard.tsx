import { useState, useEffect } from "react";
import { auth, db } from "../../../config/firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { DonadorProfile } from "../pages/DonadorProfile";
import NearbyAcopio from "../../collectionPoints/presentation/components/NearbyAcopio/NearbyAcopio";
import AddProductsPanel from "../../addProducts/AddProductsPanel";
import DonationHistory from "../../codeValidation/DonationHistory";
import {
  Bell,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  PackagePlus,
  Settings
} from "lucide-react";
import styles from "./DonadorDashboard.module.css";
import toast, { Toaster } from 'react-hot-toast';

export function DonadorDashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState("inicio");
  const [stats, setStats] = useState({ donaciones: 0, productos: 0, kg: 0 });

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Escuchar en tiempo real las donaciones del usuario
    const q = query(collection(db, "donations"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalDonaciones = snapshot.size;
      let totalProductos = 0;
      let totalKg = 0;

      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const docData = change.doc.data();
          if (docData.estado === "entregado" || docData.estado === "validado") {
            toast.success(`¡Tu donación ${docData.codigoUnico} ha sido entregada exitosamente!`, {
              duration: 6000,
              icon: '🎉'
            });
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("¡Donación entregada!", {
                body: `Tu donación ${docData.codigoUnico} ha sido recibida en el centro de acopio.`,
                icon: "/favicon.ico"
              });
            }
          }
        }
      });

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalProductos += data.totalProductos || 0;
        const kgDoc = data.productos?.reduce((acc, p) => acc + (p.pesoUnidad * p.cantidad), 0) || 0;
        totalKg += kgDoc;
      });

      setStats({
        donaciones: totalDonaciones,
        productos: totalProductos,
        kg: totalKg
      });
    });

    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.layout}>
      <Toaster position="top-right" />

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
              className={`${styles.topMenuItem} ${view === "mis-donaciones" ? styles.active : ""}`}
              onClick={() => setView("mis-donaciones")}
            >
              <LayoutDashboard size={20} />
              <span>Mis donaciones</span>
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
              {/* Stats desde Firebase */}
              <div className="max-w-4xl mx-auto pt-6 animate-fade-in">
                <div className="text-center mb-10">
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
                </div>

                {/* Stats rápidas (Conectadas a Firebase) */}
                <div className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
                  <div className="bg-white rounded-3xl p-6 border border-outline-variant/40 shadow-sm text-center">
                    <p className="text-4xl font-bold text-primary mb-2">{stats.donaciones}</p>
                    <p className="text-sm font-medium text-outline uppercase tracking-wider">Donaciones</p>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-outline-variant/40 shadow-sm text-center">
                    <p className="text-4xl font-bold text-primary mb-2">{stats.productos}</p>
                    <p className="text-sm font-medium text-outline uppercase tracking-wider">Productos</p>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-outline-variant/40 shadow-sm text-center">
                    <p className="text-4xl font-bold text-primary mb-2">{stats.kg.toFixed(1)} <span className="text-lg">kg</span></p>
                    <p className="text-sm font-medium text-outline uppercase tracking-wider">Donados</p>
                  </div>
                </div>
              </div>

              {/* Centro de acopio */}
              <div className="max-w-2xl mx-auto mt-10">
                <NearbyAcopio autoDetectar={true} />
              </div>
            </>
          )}

          {/* NUEVA DONACIÓN */}
          {view === "nueva-donacion" && (
            <div className="max-w-3xl mx-auto pt-6">
              <AddProductsPanel />
            </div>
          )}

          {/* MIS DONACIONES */}
          {view === "mis-donaciones" && (
            <div className="max-w-3xl mx-auto pt-6">
              <DonationHistory userId={auth.currentUser?.uid} />
            </div>
          )}

          {/* PERFIL */}
          {view === "perfil" && (
            <div className="max-w-2xl mx-auto pt-6">
              <DonadorProfile />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
