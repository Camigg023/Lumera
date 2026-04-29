import { useState } from "react";
import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";
import { DashboardPage } from "./features/dashboard";
import { RegisterPage } from "./features/register";
import { PasswordRecoveryPage } from "./features/password-recovery";
import { CollectionPointsPage } from './features/collectionPoints';

function App() {
 const [screen, setScreen] = useState("home");
  if (screen === "login") {
    return (
      <LoginPage
        onBackToHome={() => setScreen("home")}
        onLoginSuccess={() => setScreen("collection-points")}
        onNavigateToRegister={() => setScreen("register")}
        onNavigateToPasswordRecovery={() => setScreen("password-recovery")}
      />
    );
  }

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
    return (
      <DashboardPage onLogout={() => setScreen("home")} />
    );
  }

  if (screen === "collection-points") {
    return <CollectionPointsPage />;
  }

  return <HomePage onNavigateToLogin={() => setScreen("login")} />;
}

export default App;