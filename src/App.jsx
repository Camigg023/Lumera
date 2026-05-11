import { useState, useEffect } from "react";

import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";
import { DashboardPage } from "./features/dashboard";
import { RegisterPage } from "./features/register";
import { PasswordRecoveryPage } from "./features/password-recovery";
import { validateFirebaseConnection } from "./services/firebaseConnectionService";

// Dashboards y Páginas por Rol
import { DonadorDashboard } from "./features/accounts/dashboard/DonadorDashboard";
import { EmpresaDashboard } from "./features/accounts/dashboard/EmpresaDashboard";
import { BeneficiarioDashboard } from "./features/accounts/dashboard/BeneficiarioDashboard";
import { DonacionConfirmada } from "./features/accounts/dashboard/DonacionConfirmada";
import { ProgramarDonacion } from "./features/accounts/dashboard/ProgramarDonacion";
import { Trazabilidad } from "./features/accounts/dashboard/Trazabilidad";
import { DonationDetailPage } from "./features/traceability/presentation/pages/DonationDetailPage/DonationDetailPage";

function App() {
  const [screen, setScreen] = useState("home");
  const [role, setRole] = useState("donador");

  const [connectionStatus, setConnectionStatus] = useState({
    loading: true,
    error: null,
    warning: null
  });

  useEffect(() => {
    const checkConnection = async () => {
      const result = await validateFirebaseConnection();
      if (!result.success) {
        setConnectionStatus({
          loading: false,
          error: result.error,
          warning: null
        });
      } else {
        setConnectionStatus({
          loading: false,
          error: null,
          warning: result.warning || null
        });
        if (result.warning) {
          console.warn("[Firebase] Connected with warnings:", result.warning);
        }
      }
    };

    checkConnection();
  }, []);

  if (connectionStatus.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Validando conexión con Firebase...</p>
      </div>
    );
  }

  if (connectionStatus.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border border-red-100">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-6">{connectionStatus.error}</p>
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

  if (screen === "login") {

    return (
      <LoginPage
        onBackToHome={() => setScreen("home")}
        onLoginSuccess={() => {
          // 🔥 SIMULACIÓN DE ROL (cambia aquí para probar)
          setRole("donador"); // "empresa" o "beneficiario"
          setScreen("dashboard");
        }}
        onNavigateToRegister={() => setScreen("register")}
        onNavigateToPasswordRecovery={() => setScreen("password-recovery")}
      />
    );

  }

  // REGISTER
  if (screen === "register") {

    return (
      <RegisterPage
        onBackToHome={() => setScreen("home")}
        onNavigateToLogin={() => setScreen("login")}
        onRegisterSuccess={() => setScreen("dashboard")}
      />
    );

  }

  if (screen === "password-recovery") {

    return (
      <PasswordRecoveryPage
        onBackToHome={() => setScreen("home")}
        onNavigateToLogin={() => setScreen("login")}
        onRecoverySuccess={() => setScreen("login")}
      />
    );

  }

  if (screen === "dashboard") {

    // DONADOR
    if (role === "donador") {
      return <DonadorDashboard />;
    }

    // BENEFICIARIO
    if (role === "beneficiario") {
      return <BeneficiarioDashboard />;
    }

    // CONFIRMACIÓN
    if (role === "confirmacion") {
      return <DonacionConfirmada />;
    }

    // PROGRAMAR
    if (role === "programar") {
      return <ProgramarDonacion />;
    }

    // TRAZABILIDAD
    if (role === "trazabilidad") {
      return <Trazabilidad />;
    }

    // FALLBACK
    if (role === "donador") {
      return <DonadorDashboard />;
    }

    if (role === "empresa") {
      return <EmpresaDashboard />;
    }

    if (role === "beneficiario") {
      return <BeneficiarioDashboard />;
    }

    // fallback
    return <DashboardPage onLogout={() => setScreen("home")} />;
  }

  if (screen === "traceability") {
    return <DonationDetailPage />;

  }

  // HOME
  return (
    <>
      {connectionStatus.warning && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-center text-sm font-medium border-b border-yellow-200 sticky top-0 z-50">
          ⚠️ {connectionStatus.warning}
        </div>
      )}
      <HomePage onNavigateToLogin={() => setScreen("login")} />
    </>
  );
}

export default App;