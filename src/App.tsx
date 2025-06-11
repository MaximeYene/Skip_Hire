// App.tsx
import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import WasteTypeSelector from "./components/WasteTypeSelector";
import SelectSkip from "./components/SelectSkip"; // 1. Importer le nouveau composant
import PermitCheck from "./components/PermitCheck";
import ChooseDate from "./components/ChooseDate";
import Payments from "./components/Payments";

function App() {
  // 2. Ajouter 'selectSkip' comme étape possible
  const [currentStep, setCurrentStep] = useState<"home" | "wasteType" | "selectSkip" | "permitCheck" | "chooseDate" | "payment">("home");
  const [, setSelectedAddress] = useState<any>(null);
  const [, setWasteSelection] = useState<string[]>([]); // Ajout pour stocker les sélections

  const handleWasteSelectionContinue = (wastes: string[]) => {
    console.log("Waste selection confirmed:", wastes);
    setWasteSelection(wastes); // Optionnel : stocker les données reçues
    setCurrentStep("selectSkip"); // 3. Changer de vue vers SelectSkip
  };

  const renderStep = () => {
    switch (currentStep) {
      case "home":
        return (
          <Home 
            onContinue={() => setCurrentStep("wasteType")} 
            onAddressSelect={setSelectedAddress}
          />
        );
      case "wasteType":
        return (
          <WasteTypeSelector 
            onBack={() => setCurrentStep("home")} 
            // 4. Utiliser la nouvelle fonction pour continuer
            onContinue={handleWasteSelectionContinue} 
          />
        );
      case "selectSkip":
        return (
          // 5. Afficher le composant SelectSkip et lui donner un moyen de revenir en arrière
          <SelectSkip 
            onBack={() => setCurrentStep("wasteType")}
            onContinue={() => setCurrentStep("permitCheck")}
          />
        );
      case "permitCheck":
        return (
          // 5. Afficher le composant PermitCheck et lui donner un moyen de revenir en arrière
          <PermitCheck
          onBack={() => setCurrentStep("selectSkip")}
          onContinue={() => setCurrentStep("chooseDate")} 
          />
        );
        case "chooseDate":
        return (
          <ChooseDate
            onBack={() => setCurrentStep("permitCheck")}
            onContinue={() => setCurrentStep("payment")} // 3. Naviguer vers le paiement
          />
        );
      case "payment": // 4. Ajouter le cas pour le paiement
        return (
            <Payments
                onBack={() => setCurrentStep("chooseDate")}
            />
        );
      default:
        return (
          <Home 
            onContinue={() => setCurrentStep("wasteType")} 
            onAddressSelect={setSelectedAddress}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {renderStep()}
    </div>
  );
}

export default App;