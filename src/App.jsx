import { useState } from "react";
import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";

function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "login") {
    return <LoginPage onBackToHome={() => setScreen("home")} />;
  }

  return <HomePage onNavigateToLogin={() => setScreen("login")} />;
}

export default App;
