import { useState } from "react";
import { HomePage } from "./features/home";
import { LoginPage } from "./features/login";
import { RegisterPage } from "./features/register";
import { PasswordRecoveryPage } from "./features/password-recovery";
import { CollectionPointsPage } from "./features/collectionPoints";
import { RewardsPage } from "./features/rewards";
import { MiniMarketPage } from "./features/miniMarket";
import { TermsPage } from "./features/legalTermsBeneficiary";
import { NewDeliveryTimePage } from "./features/NewDeliveryTime";
import { LegalTermsCompanyPage } from "./features/legalTermsCompany";
import {DeliveryPointsPage} from "./features/deliveryPoints";


function App() {
  // 💅 cambia esto según lo que quieras ver primero
  const [screen, setScreen] = useState("delivery-points");

  if (screen === "legalTermsBeneficiary") {
    return <TermsPage />;
  }

  if (screen === "legalTermsCompany") {
    return <LegalTermsCompanyPage />;
  }

  if (screen === "delivery-time") {
    return <NewDeliveryTimePage />;
  }

  if (screen === "login") {
    return (
      <LoginPage
        onBackToHome={() => setScreen("home")}
        onLoginSuccess={() => setScreen("collection-points")}
        onNavigateToRegister={() => setScreen("register")}
        onNavigateToPasswordRecovery={() => setScreen("password-recovery")}
        onNavigateToMiniMarket={() => setScreen("mini-market")}
        onNavigateToDeliveryPoints={() => setScreen("delivery-points")}

      />
    );
  }

  if (screen === "register") {
    return (
      <RegisterPage
        onBackToHome={() => setScreen("home")}
        onNavigateToLogin={() => setScreen("login")}
        onNavigateToMiniMarket={() => setScreen("mini-market")}
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


  if (screen === "collection-points") {
    return <CollectionPointsPage />;
  }

  if (screen === "delivery-points") {
    return <DeliveryPointsPage />;
  } 

  if (screen === "rewards") {
    return <RewardsPage />;
  }

  if (screen === "mini-market") {
    return <MiniMarketPage />;
  }

  return (
    <HomePage onNavigateToLogin={() => setScreen("login")} />
  );
}


export default App;