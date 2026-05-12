import { useState, useEffect } from "react";
import { auth, db } from "../../../config/firebase";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { DonadorProfile } from "../pages/DonadorProfile";
import AddProductsPanel from "../../addProducts/AddProductsPanel";
import DonationHistory from "../../codeValidation/DonationHistory";
import styles from "./DonadorDashboard.module.css";
import toast, { Toaster } from 'react-hot-toast';

export function DonadorDashboard() {
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
            // Mostrar notificación de éxito!
            toast.success(`¡Tu donación ${docData.codigoUnico} ha sido entregada exitosamente!`, {
              duration: 6000,
              icon: '🎉'
            });
            // Opcional: API de notificaciones del navegador
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

    // Pedir permiso para notificaciones nativas si es necesario
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className={styles.layout}>
      <Toaster position="top-right" />
      
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className="flex-1">
          <h2 className={styles.logo}>LUMERA</h2>

          <nav className={styles.menu}>
            <p onClick={() => setView("inicio")} className={view === "inicio" ? "font-bold text-primary" : ""}>🏠 Inicio</p>
            <p onClick={() => setView("nueva-donacion")} className={view === "nueva-donacion" ? "font-bold text-primary" : ""}>📦 Nueva donación</p>
            <p onClick={() => setView("mis-donaciones")} className={view === "mis-donaciones" ? "font-bold text-primary" : ""}>📋 Mis donaciones</p>
            <p onClick={() => setView("perfil")} className={view === "perfil" ? "font-bold text-primary" : ""}>👤 Perfil</p>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="mt-auto mb-6 flex items-center justify-center gap-2 text-error hover:bg-error-container/50 px-4 py-3 rounded-xl transition cursor-pointer font-medium"
        >
          <span className="material-symbols-outlined">logout</span>
          Cerrar sesión
        </button>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>

        {/* INICIO */}
        {view === "inicio" && (
          <div className="max-w-4xl mx-auto py-12 animate-fade-in">
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

            {/* Onboarding / Tutorial Rápido */}
            <div className="mt-16 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 max-w-3xl mx-auto">
              <h3 className="font-h3 text-h3 text-on-surface mb-6 text-center">¿Cómo funciona?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                  <h4 className="font-semibold text-on-surface mb-2">Registra</h4>
                  <p className="text-sm text-outline">Agrega los productos que quieres donar con sus detalles.</p>
                </div>
                <div className="text-center relative">
                  <div className="hidden md:block absolute top-6 left-[-20%] w-[40%] h-0.5 bg-outline-variant/40"></div>
                  <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center mx-auto mb-4 font-bold text-xl relative z-10">2</div>
                  <h4 className="font-semibold text-on-surface mb-2">Obtén tu código</h4>
                  <p className="text-sm text-outline">El sistema generará un QR único para tu donación.</p>
                </div>
                <div className="text-center relative">
                  <div className="hidden md:block absolute top-6 left-[-20%] w-[40%] h-0.5 bg-outline-variant/40"></div>
                  <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center mx-auto mb-4 font-bold text-xl relative z-10">3</div>
                  <h4 className="font-semibold text-on-surface mb-2">Entrega</h4>
                  <p className="text-sm text-outline">Lleva tus productos al centro de acopio más cercano.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NUEVA DONACIÓN - AddProductsPanel */}
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

      </main>
    </div>
  );
}
