import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { DonadorProfile } from "../pages/DonadorProfile";
import AddProductsPanel from "../../addProducts/AddProductsPanel";
import DonationHistory from "../../codeValidation/DonationHistory";
import { LocationMap } from "../../beneficiary/presentation/components/LocationMap";
import {
  Bell,
  Search,
  LogOut,
  LayoutDashboard,
  PackagePlus,
  History,
  Settings,
  User,
} from "lucide-react";
import styles from "./DonadorDashboard.module.css";

/**
 * Dashboard del Donador — Layout tipo BeneficiarioDashboard.
 * Vista informativa con avatar, datos personales, ubicación y stats.
 */
export function DonadorDashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState("inicio");
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [donorProfile, setDonorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState({ donaciones: 0, productos: 0, kg: 0 });

  // Obtener userId desde Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Cargar perfil del donador desde Firestore
  useEffect(() => {
    if (!userId) return;
    setProfileLoading(true);
    const loadProfile = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDonorProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error al cargar perfil del donador:", error);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  // Escuchar stats de donaciones en tiempo real
  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "donations"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalDonaciones = snapshot.size;
      let totalProductos = 0;
      let totalKg = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalProductos += data.totalProductos || 0;
        const kgDoc = data.productos?.reduce((acc, p) => acc + (p.pesoUnidad * p.cantidad), 0) || 0;
        totalKg += kgDoc;
      });

      setStats({
        donaciones: totalDonaciones,
        productos: totalProductos,
        kg: totalKg,
      });
    });

    return () => unsubscribe();
  }, [userId]);

  // Datos del usuario autenticado
  const currentUser = auth.currentUser;
  const donorName = donorProfile?.name || currentUser?.displayName || "Donador";
  const donorPhone = donorProfile?.telefono || "";
  const donorAddress = donorProfile?.direccion || "";
  const donorEmail = currentUser?.email || "";

  // Iniciales para el avatar
  const initials = donorName
    ? donorName.split(" ").map((n) => n.charAt(0)).join("").slice(0, 2).toUpperCase()
    : "??";

  // ─── LOADING ───
  if (!authReady || (profileLoading && !donorProfile && userId)) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4"
        style={{ backgroundColor: "var(--color-background)" }}
        role="status"
        aria-label="Cargando"
      >
        <div
          className="w-12 h-12 border-4 rounded-full mb-4"
          style={{
            borderColor: "var(--color-primary)",
            borderTopColor: "transparent",
          }}
          aria-hidden="true"
        />
        <p className="font-medium" style={{ color: "var(--color-on-surface-variant)" }}>
          Cargando perfil de donador...
        </p>
      </div>
    );
  }

  // ─── VISTA DE INICIO ───
  if (view === "inicio") {
    return (
      <div className={styles.layout} role="application" aria-label="Panel de donador">
        <header className={styles.topbar}>
          <div className={styles.logoSection}>
            <h2 className={styles.logo}>LUMERA</h2>
            <span className={styles.roleBadge}>DONADOR</span>
          </div>

          <nav className={styles.topMenu}>
            <button
              className={`${styles.topMenuItem} ${styles.active}`}
              onClick={() => setView("inicio")}
            >
              <LayoutDashboard size={20} />
              <span>Inicio</span>
            </button>
            <button
              className={styles.topMenuItem}
              onClick={() => setView("nueva-donacion")}
            >
              <PackagePlus size={20} />
              <span>Nueva donación</span>
            </button>
            <button
              className={styles.topMenuItem}
              onClick={() => setView("mis-donaciones")}
            >
              <History size={20} />
              <span>Mis donaciones</span>
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
            <button className={styles.logoutIconBtn} onClick={onLogout} title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main id="main-content" className={styles.contentWrapper} role="main">
          {/* ─── BLOQUE SUPERIOR: DOS COLUMNAS ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* COLUMNA IZQUIERDA: Avatar + Información personal */}
            <div
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: "var(--color-surface-container-lowest)",
                border: "1px solid var(--color-outline-variant)",
              }}
            >
              <div className="flex flex-col items-center">
                {/* Avatar con iniciales */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
                    color: "var(--color-on-primary)",
                  }}
                >
                  {initials}
                </div>

                <div className="w-full mt-4">
                  <h3 className="text-xl font-bold text-center" style={{ color: "var(--color-on-surface)" }}>
                    {donorName}
                  </h3>

                  <div className="mt-4 space-y-3">
                    {/* Email */}
                    {donorEmail && (
                      <div
                        className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg"
                        style={{ backgroundColor: "var(--color-surface-container-high)" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium truncate">{donorEmail}</span>
                      </div>
                    )}

                    {/* Teléfono */}
                    {donorPhone && (
                      <div
                        className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg"
                        style={{ backgroundColor: "var(--color-surface-container-high)" }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="font-medium">{donorPhone}</span>
                      </div>
                    )}

                    {/* Rol */}
                    <div
                      className="flex items-center gap-3 text-sm px-3 py-2 rounded-lg"
                      style={{ backgroundColor: "var(--color-surface-container-high)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Donador</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado de cuenta */}
              <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--color-on-surface-variant)" }}>
                    Estado de cuenta
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Activo
                  </span>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Ubicación */}
            <div
              className="p-6 rounded-2xl"
              style={{
                backgroundColor: "var(--color-surface-container-lowest)",
                border: "1px solid var(--color-outline-variant)",
              }}
            >
              <h4
                className="text-sm font-semibold mb-4 flex items-center gap-2"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ubicación de recogida
              </h4>

              <div className="space-y-3">
                {donorAddress ? (
                  <>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-outline)" }}>
                        Dirección
                      </p>
                      <p className="text-sm font-medium mt-0.5" style={{ color: "var(--color-on-surface)" }}>
                        {donorAddress}
                      </p>
                    </div>
                    <LocationMap
                      latitude={4.7110}
                      longitude={-74.0721}
                      height={180}
                      label={donorAddress}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="text-3xl mb-2">📍</span>
                    <p className="text-sm" style={{ color: "var(--color-outline)" }}>
                      No has configurado tu dirección aún.
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
      Ve a tu perfil para agregarla.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── BLOQUE INFERIOR: ESTADÍSTICAS ─── */}
          <div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: "var(--color-surface-container-lowest)",
              border: "1px solid var(--color-outline-variant)",
            }}
          >
            <h4
              className="text-sm font-semibold mb-4 flex items-center gap-2"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Mis donaciones
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "var(--color-surface-container-high)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                  {stats.donaciones}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-outline)" }}>Donaciones totales</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "var(--color-surface-container-high)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                  {stats.productos}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-outline)" }}>Productos donados</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "var(--color-surface-container-high)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                  {stats.kg.toFixed(1)} kg
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-outline)" }}>Peso total donado</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "var(--color-surface-container-high)" }}>
                <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                  {stats.kg > 0 ? ((stats.kg / 100) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--color-outline)" }}>Meta: 100 kg</p>
              </div>
            </div>

            {/* Barra de progreso */}
            {stats.kg > 0 && (
              <div className="mt-4">
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--color-surface-container-high)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((stats.kg / 100) * 100, 100)}%`,
                      background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─── BOTÓN DE ACCIÓN: REALIZAR DONACIÓN ─── */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setView("nueva-donacion")}
                className="px-8 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-on-primary)",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Realizar donación
              </button>
              <button
                onClick={() => setView("mis-donaciones")}
                className="px-8 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--color-primary)",
                  border: "2px solid var(--color-primary)",
                }}
              >
                <History size={18} />
                Ver historial
              </button>
              <button
                onClick={() => setView("perfil")}
                className="px-8 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--color-on-surface-variant)",
                  border: "2px solid var(--color-outline-variant)",
                }}
              >
                <User size={18} />
                Mi perfil
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─── VISTAS SECUNDARIAS ───
  return (
    <div className={styles.layout} role="application" aria-label="Panel de donador">
      <header className={styles.topbar}>
        <div className={styles.logoSection}>
          <h2 className={styles.logo}>LUMERA</h2>
          <span className={styles.roleBadge}>DONADOR</span>
        </div>

        <div className={styles.topActions}>
          <button
            onClick={() => setView("inicio")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </button>
          <button className={styles.logoutIconBtn} onClick={onLogout} title="Cerrar sesión">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main id="main-content" className={styles.contentWrapper} role="main">
        {/* NUEVA DONACIÓN */}
        {view === "nueva-donacion" && (
          <div className="max-w-4xl mx-auto py-6 animate-fade-in">
            <AddProductsPanel />
          </div>
        )}

        {/* MIS DONACIONES */}
        {view === "mis-donaciones" && (
          <div className="max-w-4xl mx-auto py-6 animate-fade-in">
            <DonationHistory userId={userId} />
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
      </main>
    </div>
  );
}
