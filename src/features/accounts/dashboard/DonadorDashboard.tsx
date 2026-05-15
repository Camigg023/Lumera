import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { DonadorProfile } from "../pages/DonadorProfile";
import AddProductsPanel from "../../addProducts/AddProductsPanel";
import DonationHistory from "../../codeValidation/DonationHistory";
import { DonacionConfirmada } from "./DonacionConfirmada";
import { DonadorRewards } from "./DonadorRewards";
import { DonadorSidebar } from "./components/DonadorSidebar";
import { UserListByRole } from "./components/UserListByRole";
import { roleService } from "../../../services/roleService";
import { Settings, LogOut, Menu, X } from "lucide-react";
import styles from "./DonadorDashboard.module.css";

/**
 * Dashboard del Donador con sidebar de navegación.
 * El sidebar incluye acceso a listados de usuarios por rol:
 * - Donadores
 * - Beneficiarios (con aprobación/rechazo)
 * - Empresas
 */
export function DonadorDashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState("inicio");
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [donorProfile, setDonorProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ donaciones: 0, productos: 0, kg: 0 });
  const [canViewUsers, setCanViewUsers] = useState(false);
  const [lastDonation, setLastDonation] = useState<{ codigo: string; data?: any } | null>(null);

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

  // Cargar perfil del donador y sus permisos desde Firestore
  useEffect(() => {
    if (!userId) return;
    setProfileLoading(true);
    const loadProfile = async () => {
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setDonorProfile(userData);

          // Cargar permisos del rol desde Firestore
          const userRole = userData.role;
          if (userRole) {
            const role = await roleService.getRole(userRole);
            if (role) {
              const hasViewUsers =
                role.permissions.includes('ver_usuarios') ||
                role.permissions.includes('ver_beneficiarios') ||
                role.id === 'super-admin';
              setCanViewUsers(hasViewUsers);
            }
          }
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

  // Iniciales para el avatar
  const initials = donorName
    ? donorName.split(" ").map((n) => n.charAt(0)).join("").slice(0, 2).toUpperCase()
    : "??";

  const onDonationSuccess = (codigo: string, data: any) => {
    setLastDonation({ codigo, data });
    setView("confirmacion");
  };

  const handleNavigate = (newView: string) => {
    setView(newView);
    setSidebarOpen(false);
  };

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

  return (
    <div className="flex min-h-screen bg-background">
      {/* ═══ SIDEBAR ═══ */}
      <DonadorSidebar
        view={view}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        canViewUsers={canViewUsers}
      />

      {/* ═══ OVERLAY (móvil) ═══ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[150] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══ CONTENIDO PRINCIPAL ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ─── TOPBAR ─── */}
        <header
          className="h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40"
          style={{
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-outline-variant)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Botón menú móvil */}
            <button
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition lg:hidden cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-primary">Lumera</h2>
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                Donador
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                backgroundColor: "var(--color-success-container)",
                color: "var(--color-success)",
              }}
            >
              ✅ Activo
            </span>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-outline hover:text-error hover:bg-error-container transition cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* ─── CONTENIDO ─── */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background">
          {/* ═══ INICIO (3 columnas) ═══ */}
          {view === "inicio" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* ─── LEFT: Perfil ─── */}
              <aside className="lg:col-span-3 space-y-5">
                <div
                  className="rounded-2xl p-6 shadow-sm border overflow-hidden relative"
                  style={{
                    backgroundColor: "var(--color-surface-container-lowest)",
                    borderColor: "var(--color-outline-variant)",
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-bl-full"
                    style={{
                      backgroundColor: "var(--color-primary-fixed)",
                      opacity: 0.3,
                      marginRight: "-2rem",
                      marginTop: "-2rem",
                    }}
                  />
                  <div className="relative flex flex-col items-center text-center">
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md mb-4 border-2"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
                        color: "var(--color-on-primary)",
                        borderColor: "var(--color-surface-container-lowest)",
                      }}
                    >
                      {initials}
                    </div>
                    <h2 className="text-xl font-bold" style={{ color: "var(--color-on-surface)" }}>
                      {donorName}
                    </h2>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full mt-2"
                      style={{ backgroundColor: "var(--color-surface-container)", color: "var(--color-primary)" }}
                    >
                      ✅ Donador Activo
                    </span>
                    <p className="text-xs mt-3 font-mono" style={{ color: "var(--color-outline)" }}>
                      ID #{userId?.slice(-6) || "---"}
                    </p>
                  </div>

                  <hr className="my-6" style={{ borderColor: "var(--color-outline-variant)" }} />

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className="p-3 rounded-2xl text-center"
                      style={{ backgroundColor: "var(--color-surface-container-low)" }}
                    >
                      <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                        {stats.donaciones}
                      </p>
                      <p
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        Donaciones
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-2xl text-center"
                      style={{ backgroundColor: "var(--color-surface-container-low)" }}
                    >
                      <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                        {stats.kg.toFixed(1)} kg
                      </p>
                      <p
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--color-on-surface-variant)" }}
                      >
                        Donados
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* ─── CENTER: Bienvenida ─── */}
              <section className="lg:col-span-6 space-y-5">
                <div
                  className="rounded-2xl p-8 shadow-sm border relative overflow-hidden"
                  style={{
                    backgroundColor: "var(--color-surface-container-lowest)",
                    borderColor: "var(--color-outline-variant)",
                  }}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className="relative">
                    <span
                      className="text-sm font-semibold px-4 py-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-surface-container)", color: "var(--color-primary)" }}
                    >
                      🫶 Bienvenido Donador
                    </span>
                    <h2 className="text-3xl font-bold mt-4" style={{ color: "var(--color-on-surface)" }}>
                      ¡Hola, {donorName.split(" ")[0]}!
                    </h2>
                    <p className="mt-2" style={{ color: "var(--color-on-surface-variant)" }}>
                      Cada donación cuenta. Agrega los productos que deseas donar y ayúdanos a llevarlos a
                      quienes más lo necesitan.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                      {[
                        { emoji: "🥫", title: "No Perecederos", desc: "Arroz, pasta, legumbres" },
                        { emoji: "🥦", title: "Frescos", desc: "Frutas, verduras" },
                        { emoji: "🥛", title: "Lácteos", desc: "Leche, yogurt" },
                        { emoji: "🥖", title: "Panadería", desc: "Pan, tortas" },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="flex items-start gap-4 p-4 rounded-2xl border hover:shadow-md transition-shadow"
                          style={{
                            backgroundColor: "var(--color-surface-container-lowest)",
                            borderColor: "var(--color-outline-variant)",
                          }}
                        >
                          <div
                            className="p-2 rounded-xl"
                            style={{ backgroundColor: "var(--color-surface-container-high)" }}
                          >
                            <span className="text-lg">{item.emoji}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm" style={{ color: "var(--color-on-surface)" }}>
                              {item.title}
                            </h4>
                            <p className="text-xs" style={{ color: "var(--color-outline)" }}>
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {stats.kg > 0 && (
                      <div
                        className="mt-8 p-5 rounded-2xl flex items-center justify-between"
                        style={{ backgroundColor: "var(--color-primary-container)" }}
                      >
                        <div>
                          <p className="text-sm font-medium opacity-90" style={{ color: "var(--color-on-primary-fixed)" }}>
                            Impacto Total
                          </p>
                          <p className="text-xl font-bold" style={{ color: "var(--color-on-primary-fixed)" }}>
                            ~{Math.round(stats.kg * 3.5)} kg CO₂ Ahorrados
                          </p>
                        </div>
                        <span className="text-4xl opacity-50" style={{ color: "var(--color-on-primary-fixed)" }}>
                          🌱
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Donaciones", value: stats.donaciones },
                    { label: "Productos", value: stats.productos },
                    { label: "Donados", value: `${stats.kg.toFixed(1)} kg` },
                    { label: "Meta activa", value: stats.productos > 0 ? "🎯" : "—" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="p-4 rounded-xl text-center"
                      style={{ backgroundColor: "var(--color-surface-container-high)" }}
                    >
                      <p className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                        {s.value}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--color-outline)" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ─── RIGHT: Logística ─── */}
              <aside className="lg:col-span-3 space-y-5">
                <div
                  className="rounded-2xl p-6 shadow-sm border"
                  style={{
                    backgroundColor: "var(--color-surface-container-lowest)",
                    borderColor: "var(--color-outline-variant)",
                  }}
                >
                  <h3 className="font-bold mb-4" style={{ color: "var(--color-on-surface)" }}>
                    Centro de Acopio
                  </h3>
                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--color-surface-container-high)" }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: "var(--color-primary)" }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-outline)" }}>
                          Dirección
                        </p>
                        <p className="text-sm font-bold" style={{ color: "var(--color-on-surface)" }}>
                          {donorAddress || "No configurada"}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                          Centro de acopio más cercano
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="mt-4 rounded-2xl h-32 flex items-center justify-center"
                    style={{ backgroundColor: "var(--color-surface-container-high)" }}
                  >
                    <span className="text-3xl">📍</span>
                  </div>

                  <button
                    onClick={() => setView("nueva-donacion")}
                    className="w-full py-3.5 rounded-2xl mt-4 font-bold text-sm transition-all active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: "var(--color-surface-container-low)",
                      color: "var(--color-primary)",
                    }}
                  >
                    Ver puntos de acopio
                  </button>
                </div>

                <div
                  className="rounded-2xl p-6 text-center shadow-lg relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                  </div>
                  <h4 className="font-bold mb-4 relative z-10 text-white">
                    ¿Listo para donar?
                  </h4>
                  <div className="bg-white p-3 rounded-2xl inline-block shadow-xl relative z-10">
                    <div className="w-28 h-28 flex items-center justify-center">
                      <span className="text-6xl">🎁</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setView("nueva-donacion")}
                    className="mt-4 w-full py-3.5 rounded-2xl font-bold text-sm bg-white/20 text-white hover:bg-white/30 transition-all active:scale-95 cursor-pointer relative z-10"
                  >
                    Hacer una donación
                  </button>
                </div>

                {stats.kg > 0 && (
                  <div
                    className="rounded-2xl p-5 shadow-sm border"
                    style={{
                      backgroundColor: "var(--color-surface-container-lowest)",
                      borderColor: "var(--color-outline-variant)",
                    }}
                  >
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-on-surface-variant)" }}>
                      Progreso: {Math.min((stats.kg / 100) * 100, 100).toFixed(0)}%
                    </p>
                    <div
                      className="h-2.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-surface-container-high)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: Math.min((stats.kg / 100) * 100, 100) + "%",
                          background:
                            "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1 text-right" style={{ color: "var(--color-outline)" }}>
                      Meta: 100 kg
                    </p>
                  </div>
                )}
              </aside>
            </div>
          )}

          {/* ═══ NUEVA DONACIÓN ═══ */}
          {view === "nueva-donacion" && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <AddProductsPanel onSuccess={onDonationSuccess} />
            </div>
          )}

          {/* ═══ CONFIRMACIÓN ═══ */}
          {view === "confirmacion" && lastDonation && (
            <div className="max-w-6xl mx-auto">
              <DonacionConfirmada
                codigoDonacion={lastDonation.codigo}
                donacion={lastDonation.data}
                onBackToDashboard={() => setView("inicio")}
              />
            </div>
          )}

          {/* ═══ MIS DONACIONES ═══ */}
          {view === "mis-donaciones" && (
            <div className="max-w-4xl mx-auto animate-fade-in">
              <DonationHistory userId={userId} onViewDetail={onDonationSuccess} />
            </div>
          )}

          {/* ═══ PERFIL ═══ */}
          {view === "perfil" && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <DonadorProfile />
            </div>
          )}

          {/* ═══ BENEFICIOS ═══ */}
          {view === "beneficios" && (
            <div className="max-w-5xl mx-auto animate-fade-in">
              <DonadorRewards stats={stats} />
            </div>
          )}

          {/* ═══ USUARIOS: DONADORES ═══ */}
          {view === "usuarios-donadores" && (
            <div className="max-w-5xl mx-auto animate-fade-in">
              <UserListByRole role="donador" onBack={() => setView("inicio")} />
            </div>
          )}

          {/* ═══ USUARIOS: BENEFICIARIOS ═══ */}
          {view === "usuarios-beneficiarios" && (
            <div className="max-w-6xl mx-auto animate-fade-in">
              <UserListByRole role="beneficiario" onBack={() => setView("inicio")} />
            </div>
          )}

          {/* ═══ USUARIOS: EMPRESAS ═══ */}
          {view === "usuarios-empresas" && (
            <div className="max-w-5xl mx-auto animate-fade-in">
              <UserListByRole role="empresa" onBack={() => setView("inicio")} />
            </div>
          )}

          {/* ═══ CONFIGURACIÓN ═══ */}
          {view === "configuracion" && (
            <div className="max-w-2xl mx-auto py-20 text-center animate-fade-in">
              <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-outline">
                <Settings size={40} />
              </div>
              <h2 className="text-h2 font-h2 text-on-surface">Configuración</h2>
              <p className="text-body-md text-outline mt-2">
                Opciones de cuenta y preferencias próximamente.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
