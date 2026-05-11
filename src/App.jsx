import { useState } from "react";

import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";
import { DashboardPage } from "./features/dashboard";
import { RegisterPage } from "./features/register";
import { PasswordRecoveryPage } from "./features/password-recovery";

// DASHBOARDS
import { DonadorDashboard } from "./features/accounts/dashboard/DonadorDashboard";
import { BeneficiarioDashboard } from "./features/accounts/dashboard/BeneficiarioDashboard";
import { DonacionConfirmada } from "./features/accounts/dashboard/DonacionConfirmada";
import { ProgramarDonacion } from "./features/accounts/dashboard/ProgramarDonacion";
import { Trazabilidad } from "./features/accounts/dashboard/Trazabilidad";

function App() {

  // PROBAR PANTALLAS
  const [screen, setScreen] = useState("dashboard");

  // 👇 CAMBIA EL ROL PARA VER CADA PANTALLA
  // "donador"
  // "beneficiario"
  // "confirmacion"
  // "programar"
  // "trazabilidad"

  const [role, setRole] = useState("trazabilidad");

  // LOGIN
  if (screen === "login") {

    return (
      <LoginPage
        onBackToHome={() => setScreen("home")}
        onLoginSuccess={() => {

          setRole("donador");
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

  // PASSWORD RECOVERY
  if (screen === "password-recovery") {

    return (
      <PasswordRecoveryPage
        onBackToHome={() => setScreen("home")}
        onNavigateToLogin={() => setScreen("login")}
        onRecoverySuccess={() => setScreen("login")}
      />
    );

  }

  // DASHBOARDS
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
    return (
      <DashboardPage
        onLogout={() => setScreen("home")}
      />
    );

  }

  // HOME
  return (
    <HomePage
      onNavigateToLogin={() => setScreen("login")}
    />
  );

}

export default App;