import { useState } from "react";
import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";
import { DashboardPage } from "./features/dashboard";
import { RegisterPage } from "./features/register";

function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "login") {
    return (
      <LoginPage
        onBackToHome={() => setScreen("home")}
        onLoginSuccess={() => setScreen("dashboard")}
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

  if (screen === "dashboard") {
    return (
      <DashboardPage
        onLogout={() => setScreen("home")}
      />
    );
  }

  return <HomePage onNavigateToLogin={() => setScreen("login")} />;
}

export default App;
