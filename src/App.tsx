// App.tsx
import { useState } from "react";
import "./App.css";
import Home from "./components/Home";
import WasteTypeSelector from "./components/WasteTypeSelector";

function App() {
  const [currentStep, setCurrentStep] = useState<"home" | "wasteType">("home");
  const [, setSelectedAddress] = useState<any>(null);

  return (
    <div className="w-full">
      {currentStep === "home" ? (
        <Home 
          onContinue={() => setCurrentStep("wasteType")} 
          onAddressSelect={setSelectedAddress}
        />
      ) : (
        <WasteTypeSelector 
          onBack={() => setCurrentStep("home")} 
          onContinue={() => console.log("Continuing to next step")}
        />
      )}
    </div>
  );
}

export default App;