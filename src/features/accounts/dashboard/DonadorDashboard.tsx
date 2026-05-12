import { useState, useEffect } from "react";
import { auth, db } from "../../../config/firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { DonadorProfile } from "../pages/DonadorProfile";
// @ts-ignore
import AddProductsPanel from "../../addProducts/AddProductsPanel";
// @ts-ignore
import DonationHistory from "../../codeValidation/DonationHistory";
// @ts-ignore
import NearbyAcopio from "../../collectionPoints/presentation/components/NearbyAcopio/NearbyAcopio";
import { 
  Bell, 
  Search, 
  User, 
  LogOut,
  LayoutDashboard,
  PackagePlus,
  Settings,
  History
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
        const kgDoc = data.productos?.reduce((acc: number, p: any) => acc + (p.pesoUnidad * p.cantidad), 0) || 0;
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
  }, [auth.currentUser]);

  const handleLogout = () => {
    auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <div className={styles.layout}>
      <Toaster position="top-right" />
      
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
              <History size={20} />
              <span>Mis donaciones</span>
            </button>

            <button 
              className={`${styles.topMenuItem} ${view === "perfil" ? styles.active : ""}`}
              onClick={() => setView("perfil")}
            >
              <User size={20} />
              <span>Mi Perfil</span>
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
                <span className={styles.userName}>{auth.currentUser?.displayName || "Usuario"}</span>
              </div>
              {auth.currentUser?.photoURL ? (
                <img 
                  src={auth.currentUser.photoURL} 
                  alt="Profile" 
                  className={styles.avatar} 
                />
              ) : (
                <div className={`${styles.avatar} flex items-center justify-center bg-indigo-100 text-primary font-bold`}>
                  {auth.currentUser?.displayName?.charAt(0) || "U"}
                </div>
              )}
              <button className={styles.logoutIconBtn} onClick={handleLogout} title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          {/* INICIO */}
          {view === "inicio" && (
            <div className="max-w-7xl mx-auto px-5 md:px-10 mt-4 space-y-12 animate-fade-in pb-20">
              {/* Header de bienvenida */}
              <section className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-outline-variant/40 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-4xl">volunteer_activism</span>
                  </div>
                  <div>
                    <h1 className="text-h2 font-h2 text-on-surface">Bienvenido de nuevo, {auth.currentUser?.displayName?.split(' ')[0] || "Donador"}</h1>
                    <p className="text-body-md text-on-surface-variant">Tu contribución está haciendo la diferencia hoy.</p>
                  </div>
                </div>
                <button
                  onClick={() => setView("nueva-donacion")}
                  className="h-14 px-8 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PackagePlus size={20} />
                  Nueva Donación
                </button>
              </section>

              {/* Stats Rápidas */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm group hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed/30 flex items-center justify-center text-primary mb-4">
                    <History size={24} />
                  </div>
                  <p className="text-4xl font-bold text-on-surface mb-1">{stats.donaciones}</p>
                  <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Donaciones totales</p>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm group hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed/30 flex items-center justify-center text-secondary mb-4">
                    <PackagePlus size={24} />
                  </div>
                  <p className="text-4xl font-bold text-on-surface mb-1">{stats.productos}</p>
                  <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Productos entregados</p>
                </div>
                <div className="bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm group hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center text-tertiary mb-4">
                    <span className="material-symbols-outlined text-2xl">weight</span>
                  </div>
                  <p className="text-4xl font-bold text-on-surface mb-1">{stats.kg.toFixed(1)} <span className="text-xl font-semibold">kg</span></p>
                  <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Peso total donado</p>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Centros de acopio cercanos */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-h3 font-h3 text-on-surface">Puntos de Acopio Cercanos</h3>
                    <button className="text-primary text-sm font-bold hover:underline">Ver mapa completo</button>
                  </div>
                  <NearbyAcopio autoDetectar={true} />
                </section>

                {/* Tutorial Rápido */}
                <section className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/40 space-y-8">
                  <h3 className="text-h3 font-h3 text-on-surface">¿Cómo funciona?</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0 font-bold">1</div>
                      <p className="text-on-surface-variant">Registra los productos que quieres donar en la pestaña <b>"Nueva Donación"</b>.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0 font-bold">2</div>
                      <p className="text-on-surface-variant">Obtén tu <b>código QR único</b> generado automáticamente para tu donación.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0 font-bold">3</div>
                      <p className="text-on-surface-variant">Lleva tus productos al <b>centro de acopio</b> y muestra tu código al personal.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* NUEVA DONACIÓN */}
          {view === "nueva-donacion" && (
            <div className="max-w-4xl mx-auto py-6 animate-fade-in">
               <AddProductsPanel />
            </div>
          )}

          {/* MIS DONACIONES */}
          {view === "mis-donaciones" && (
            <div className="max-w-4xl mx-auto py-6 animate-fade-in">
              <DonationHistory userId={auth.currentUser?.uid} />
            </div>
          )}

          {/* PERFIL */}
          {view === "perfil" && (
            <div className="max-w-2xl mx-auto py-6 animate-fade-in">
              <DonadorProfile />
            </div>
          )}

          {/* CONFIGURACIÓN */}
          {view === "configuracion" && (
            <div className="max-w-2xl mx-auto py-20 text-center animate-fade-in">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-outline">
                <Settings size={40} />
              </div>
              <h2 className="text-h2 font-h2 text-on-surface">Configuración</h2>
              <p className="text-body-md text-outline mt-2">Opciones de cuenta y preferencias próximamente.</p>
            </div>
          )}
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-8px_30px_rgba(0,0,0,0.05)] md:hidden">
        <div className="flex justify-around items-center px-2 py-3">
          {[
            { key: "inicio", icon: <LayoutDashboard size={22} />, label: "Inicio" },
            { key: "nueva-donacion", icon: <PackagePlus size={22} />, label: "Donar" },
            { key: "mis-donaciones", icon: <History size={22} />, label: "Historial" },
            { key: "perfil", icon: <User size={22} />, label: "Perfil" },
          ].map((item) => {
            const activo = view === item.key;
            return (
              <button 
                key={item.key} 
                onClick={() => setView(item.key)}
                className={`flex flex-col items-center justify-center min-w-[70px] py-1 transition-all duration-200 ${
                  activo ? "text-primary" : "text-outline"
                }`}
              >
                <div className={`p-1 rounded-xl transition-colors ${activo ? "bg-primary/10" : ""}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
