import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config/firebase";

import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";
import { DashboardPage } from "./features/dashboard";
import { RegisterPage } from "./features/register";
import { PasswordRecoveryPage } from "./features/password-recovery";
import { validateFirebaseConnection } from "./services/firebaseConnectionService";

// Dashboards por Rol
import { DonadorDashboard } from "./features/accounts/dashboard/DonadorDashboard";
import { EmpresaDashboard } from "./features/accounts/dashboard/EmpresaDashboard";
import { BeneficiarioDashboard } from "./features/accounts/dashboard/BeneficiarioDashboard";

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
    return <HomePage onNavigateToLogin={goToLogin} />;
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
  return <HomePage onNavigateToLogin={goToLogin} />;
}

export default App;
