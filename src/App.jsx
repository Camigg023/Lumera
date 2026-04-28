import { useState } from "react";
import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";
import { DashboardPage } from "./features/dashboard";
import { RegisterPage } from "./features/register";
import { PasswordRecoveryPage } from "./features/password-recovery";

// 👇 IMPORTA TUS DASHBOARDS
import { DonadorDashboard } from "./features/accounts/dashboard/DonadorDashboard";
import { EmpresaDashboard } from "./features/accounts/dashboard/EmpresaDashboard";
import { BeneficiarioDashboard } from "./features/accounts/dashboard/BeneficiarioDashboard";

function App() {
  const [screen, setScreen] = useState("dashboard"); // esto es para ver los perfiles sin el firebase
  //const [screen, setScreen] = useState("home"); //cambiarlo despues para ver el home

  // 👇 ESTADO PARA EL ROL
  const [role, setRole] = useState("donador"); // cambia para probar

  // LOGIN
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

  // RECUPERAR CONTRASEÑA
  if (screen === "password-recovery") {
    return (
      <PasswordRecoveryPage
        onBackToHome={() => setScreen("home")}
        onNavigateToLogin={() => setScreen("login")}
        onRecoverySuccess={() => setScreen("login")}
      />
    );
  }

  // 🔥 DASHBOARD POR ROL
  if (screen === "dashboard") {
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

  // HOME
  return <HomePage onNavigateToLogin={() => setScreen("login")} />;
}

export default App;