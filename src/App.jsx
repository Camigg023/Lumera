import { useState, useEffect, lazy, Suspense } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";

// Lazy loaded components
const HomePage = lazy(() => import("./features/home").then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("./features/login").then(module => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import("./features/dashboard").then(module => ({ default: module.DashboardPage })));
const RegisterPage = lazy(() => import("./features/register").then(module => ({ default: module.RegisterPage })));
const PasswordRecoveryPage = lazy(() => import("./features/password-recovery").then(module => ({ default: module.PasswordRecoveryPage })));

// Nuevas vistas desde feat/views
const CollectionPointsPage = lazy(() => import("./features/collectionPoints").then(module => ({ default: module.CollectionPointsPage })));
const DeliveryPointsPage = lazy(() => import("./features/deliveryPoints").then(module => ({ default: module.DeliveryPointsPage })));
const NewDeliveryTimePage = lazy(() => import("./features/NewDeliveryTime").then(module => ({ default: module.NewDeliveryTimePage })));
const MiniMarketPage = lazy(() => import("./features/miniMarket").then(module => ({ default: module.MiniMarketPage })));
const RewardsPage = lazy(() => import("./features/rewards").then(module => ({ default: module.RewardsPage })));
const TermsPage = lazy(() => import("./features/legalTermsBeneficiary").then(module => ({ default: module.TermsPage })));
const LegalTermsCompanyPage = lazy(() => import("./features/legalTermsCompany").then(module => ({ default: module.LegalTermsCompanyPage })));

// Dashboards por Rol
const DonadorDashboard = lazy(() => import("./features/accounts/dashboard/DonadorDashboard").then(module => ({ default: module.DonadorDashboard })));
const EmpresaDashboard = lazy(() => import("./features/accounts/dashboard/EmpresaDashboard").then(module => ({ default: module.EmpresaDashboard })));
const BeneficiarioDashboard = lazy(() => import("./features/accounts/dashboard/BeneficiarioDashboard").then(module => ({ default: module.BeneficiarioDashboard })));

import { validateFirebaseConnection } from "./services/firebaseConnectionService";

// Configuración centralizada de rutas
import { isValidRole } from "./config/routes";

// Mapeo de roles a componentes dashboard
const DASHBOARD_COMPONENTS = {
  donador: DonadorDashboard,
  empresa: EmpresaDashboard,
  beneficiario: BeneficiarioDashboard,
};


/** @typedef {'loading'|'home'|'login'|'register'|'password-recovery'|'dashboard'} AppState */

function App() {
  const [appState, setAppState] = useState("loading");
  const [role, setRole] = useState(null);
  const [connectionOk, setConnectionOk] = useState(false);

  // ─── 1. VALIDAR CONEXIÓN FIREBASE ───
  useEffect(() => {
    validateFirebaseConnection().then((result) => {
      if (result.success) {
        setConnectionOk(true);
      } else {
        // Si falla la conexión, mostramos error (manejado abajo)
        setConnectionOk(false);
        setAppState("error");
      }
    });
  }, []);

  // ─── 2. RESTAURAR SESIÓN AL CARGAR ───
  useEffect(() => {
    if (!connectionOk) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ✅ Hay sesión activa en Firebase → leer rol desde Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          const userRole = userData.role || "donador";

          if (isValidRole(userRole)) {
            setRole(userRole);
            setAppState("dashboard");
          } else {
            console.warn(`[App] Rol inválido en Firestore: "${userRole}".`);
            setAppState("home");
          }
        } catch (err) {
          console.error("[App] Error al leer perfil del usuario:", err);
          setAppState("home");
        }
      } else {
        // ❌ No hay sesión → mostrar home
        setAppState("home");
      }
    });

    return () => unsubscribe();
  }, [connectionOk]);

  // ─── 3. HANDLERS DE NAVEGACIÓN ───

  const goToHome = () => setAppState("home");
  const goToLogin = () => setAppState("login");
  const goToRegister = () => setAppState("register");
  const goToPasswordRecovery = () => setAppState("password-recovery");
  const goToDashboard = () => setAppState("dashboard");
  const goToCollectionPoints = () => setAppState("collection-points");
  const goToDeliveryPoints = () => setAppState("delivery-points");
  const goToDeliveryTime = () => setAppState("delivery-time");
  const goToMiniMarket = () => setAppState("mini-market");
  const goToRewards = () => setAppState("rewards");
  const goToLegalTerms = () => setAppState("legal-terms-beneficiary");
  const goToLegalTermsCompany = () => setAppState("legal-terms-company");

  /**
   * Se llama después de login/registro exitoso.
   * Recibe el rol del usuario desde Firestore.
   */
  const onAuthSuccess = (userRole) => {
    if (isValidRole(userRole)) {
      setRole(userRole);
      setAppState("dashboard");
    } else {
      console.warn(`[App] Rol inválido en auth success: "${userRole}"`);
      setAppState("dashboard");
    }
  };

  const onLogout = async () => {
    try {
      await signOut(auth);
      setRole(null);
      setAppState("home");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // ─── RENDER POR ESTADO ───
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Cargando...</p>
      </div>
    }>
      {renderContent()}
    </Suspense>
  );

  function renderContent() {
    // Carga inicial
    if (appState === "loading") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Validando sesión...</p>
        </div>
      );
    }

    // Error de conexión Firebase
    if (!connectionOk) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border border-red-100">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Error de Conexión</h2>
            <p className="text-gray-600 mb-6">No se pudo conectar con Firebase.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              Reintentar Conexión
            </button>
          </div>
        </div>
      );
    }

    // Home (público)
    if (appState === "home") {
      return <HomePage onNavigateToLogin={goToLogin} onNavigateToRegister={goToRegister} />;
    }

    // Login
    if (appState === "login") {
      return (
        <LoginPage
          onBackToHome={goToHome}
          onLoginSuccess={(userRole) => onAuthSuccess(userRole)}
          onNavigateToRegister={goToRegister}
          onNavigateToPasswordRecovery={goToPasswordRecovery}
        />
      );
    }

    // Register
    if (appState === "register") {
      return (
        <RegisterPage
          onBackToHome={goToHome}
          onNavigateToLogin={goToLogin}
          onRegisterSuccess={(userRole) => onAuthSuccess(userRole)}
        />
      );
    }

    // Recuperar contraseña
    if (appState === "password-recovery") {
      return (
        <PasswordRecoveryPage
          onBackToHome={goToHome}
          onNavigateToLogin={goToLogin}
          onRecoverySuccess={goToLogin}
        />
      );
    }

    // Collection Points
    if (appState === "collection-points") {
      return <CollectionPointsPage onBackToHome={goToHome} />;
    }

    // Delivery Points
    if (appState === "delivery-points") {
      return <DeliveryPointsPage onBackToHome={goToHome} onNavigateToDeliveryTime={goToDeliveryTime} />;
    }

    // Delivery Time (NewDeliveryTime)
    if (appState === "delivery-time") {
      return <NewDeliveryTimePage onBackToHome={goToHome} />;
    }

    // Mini Market
    if (appState === "mini-market") {
      return <MiniMarketPage onBackToHome={goToHome} />;
    }

    // Rewards
    if (appState === "rewards") {
      return <RewardsPage onBackToHome={goToHome} />;
    }

    // Legal Terms Beneficiary
    if (appState === "legal-terms-beneficiary") {
      return <TermsPage onBackToHome={goToHome} />;
    }

    // Legal Terms Company
    if (appState === "legal-terms-company") {
      return <LegalTermsCompanyPage onBackToHome={goToHome} />;
    }

    // Dashboard (requiere sesión)
    if (appState === "dashboard") {
      if (role && isValidRole(role)) {
        const DashboardComponent = DASHBOARD_COMPONENTS[role];
        return <DashboardComponent onLogout={onLogout} />;
      }

      console.warn(`[App] Rol inválido en dashboard: "${role}".`);
      return <DashboardPage onLogout={onLogout} />;
    }

    // Fallback
    return <HomePage onNavigateToLogin={goToLogin} onNavigateToRegister={goToRegister} />;
  }
}


export default App;
